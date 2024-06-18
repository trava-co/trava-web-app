import {
  CreateAttractionFromPlaceIdMutationVariables,
  CreateGooglePlaceInput,
  GetAttractionPhotosQueryVariables,
  PlaceDataInput,
  PlacePhoto,
  PlacePhotoInput,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import { CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'
import { checkForExistingCards } from '../../utils/checkForExistingCards'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { OTHER_DESTINATION_ID } from '../../utils/constants'
import { retryWithExponentialBackoff } from '../../utils/retryWithExponentialBackoff'
import { getGooglePlaceDetails } from '../../utils/getGooglePlaceDetails'
import { getInputToCreateGooglePlace } from './utils/getInputToCreateGooglePlace'
import { IBusinessOverview, getInputToCreateAttraction } from './utils/getInputToCreateAttraction'
import dbClient from '../../utils/dbClient'
import { getInputToTransaction } from './utils/getInputToTransaction'
import { getAttractionExistsItem } from './utils/getAttractionExistsItem'
import { startGetAttractionPhotos } from '../../utils/startGetAttractionPhotos'

// For creating User Created Cards, which should only have one location, comprised of the same startLoc and endLoc. If these assumptions change, this function will need to be updated.
const createAttractionFromPlaceId: AppSyncResolverHandler<CreateAttractionFromPlaceIdMutationVariables, any> = async (
  event,
) => {
  console.log(
    `Running createAttractionFromPlaceId lambda resolver with event arguments input: ${JSON.stringify(
      event.arguments.input,
      null,
      2,
    )}`,
  )

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE)
  }

  const { googlePlaceId, destinationDates, authorType, recommendationBadges } = event.arguments.input
  let destinationId = OTHER_DESTINATION_ID

  const googleMapsKeyPromise = getSSMVariable('GOOGLE_MAPS_API_KEY') // start fetch in background
  let GOOGLE_MAPS_KEY: string

  /* Step 0: Check if googlePlace and an existing attraction for the google place already exists */
  const { existingGooglePlace, existingAttractions } = await checkForExistingCards({
    googlePlaceId,
    userId: event.identity.sub,
    destinationDates: destinationDates ?? undefined,
  })

  // if an existing attraction already exists, then return it
  if (existingAttractions?.length) {
    console.log('Attraction exists, returning existing attraction')
    return {
      __typename: 'CreateAttractionFromPlaceIdResponse',
      existingAttractions: existingAttractions,
      createdAttraction: null,
    }
  }

  // attraction doesn't already exist, so we need to create it

  /* Step 1: Get data from Google Place necessary to create attraction & prepare input to create google place if it doesn't already exist */
  let businessDataToCreateAttraction: IBusinessOverview
  let newGooglePlace: PlaceDataInput | undefined

  let createGooglePlaceInput: CreateGooglePlaceInput | undefined
  let existingGooglePlacePhotos: PlacePhotoInput[] | undefined

  if (existingGooglePlace) {
    // there's an existing google place, so we don't need to fetch it from google places api
    // prepare the business data necessary to create the attraction
    businessDataToCreateAttraction = {
      googlePlaceId: existingGooglePlace.id,
      name: existingGooglePlace.data.name,
      coords: existingGooglePlace.data.coords,
      mealServices: existingGooglePlace.data.mealServices,
      hours: existingGooglePlace.data.hours,
      editorialSummary: existingGooglePlace.data.editorialSummary,
    }

    existingGooglePlacePhotos =
      existingGooglePlace.data.photos
        ?.filter((photo): photo is PlacePhoto => Boolean(photo))
        .map((photo) => {
          const { __typename, ...photoWithoutTypename } = photo
          return photoWithoutTypename
        }) ?? undefined
  } else {
    // no existing google place, so we must fetch it from google places api
    GOOGLE_MAPS_KEY = await googleMapsKeyPromise

    try {
      newGooglePlace = (await retryWithExponentialBackoff({
        func: () => getGooglePlaceDetails({ placeId: googlePlaceId, GOOGLE_MAPS_KEY }),
      })) as PlaceDataInput

      if (!newGooglePlace) throw new Error('newGooglePlace is falsy')

      // no existing google place, so prepare the googlePlace input to create one
      createGooglePlaceInput = getInputToCreateGooglePlace({
        googlePlaceId,
        googlePlaceData: newGooglePlace,
      })

      // prepare the business data necessary to create the attraction
      businessDataToCreateAttraction = {
        googlePlaceId,
        name: newGooglePlace.name,
        coords: newGooglePlace.coords,
        mealServices: newGooglePlace.mealServices,
        hours: newGooglePlace.hours,
        editorialSummary: newGooglePlace.editorialSummary,
      }
    } catch (error) {
      throw new Error(`Error getting google place details from google places api. ${error}`)
    }
  }

  /* Step 2: Prepare input to create attraction */
  // use the relevant google place data to classify the attraction & prepare the input to create the attraction
  const createAttractionInput = getInputToCreateAttraction({
    destinationId,
    business: businessDataToCreateAttraction,
    authorType,
    authorId: event.identity.sub,
    recommendationBadges,
  })

  /* Step 3: Perform transaction to create attraction, google place */
  // parallelize the following 2 in a dynamodb transaction:
  // 1. create google place entry if it doesn't exist
  // 2. create attraction
  // if any of the above fail, then the transaction will rollback
  const transaction = getInputToTransaction({
    createAttractionInput,
    createGooglePlaceInput,
  })

  // perform transaction
  try {
    await dbClient.transactWrite(transaction).promise()
  } catch (error: any) {
    console.error('Transaction failed:', error)
    throw new Error('Transaction failed: ' + error?.message)
  }

  /* Step 4: call getAttractionPhotos to start that async process */
  const getPhotosInput: GetAttractionPhotosQueryVariables = {
    input: {
      attractionId: createAttractionInput.id!,
      photos: createGooglePlaceInput?.data?.photos ?? existingGooglePlacePhotos ?? [],
    },
  }
  await startGetAttractionPhotos({
    queryVariables: getPhotosInput,
    failureCount: 0,
    shouldThrowIfError: true,
    withDynamoDbClient: true,
  })

  /* Step 5: Return createdAttraction as type AttractionExistsItem */
  const createdAttraction = getAttractionExistsItem({
    attraction: createAttractionInput,
    coords: businessDataToCreateAttraction.coords,
  })

  return {
    __typename: 'CreateAttractionFromPlaceIdResponse',
    existingAttractions: null,
    createdAttraction,
  }
}

export default createAttractionFromPlaceId
