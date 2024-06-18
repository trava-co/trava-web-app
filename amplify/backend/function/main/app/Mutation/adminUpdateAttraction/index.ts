import {
  AdminUpdateAttractionMutationVariables,
  Coords,
  GenerationStep,
  GetAttractionPhotosQueryVariables,
  Status,
  UpdateAttractionInput,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import checkAttractionAccessUpdate from './before/checkAttractionAccessUpdate'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'
import { getTimezoneFromCoords } from '../../utils/getTimezoneFromCoords'
import putGooglePlaceEntry from '../../utils/putGooglePlaceEntry'
import { updateAttraction } from '../../utils/updateAttraction'
import { startGetAttractionPhotos } from '../../utils/startGetAttractionPhotos'
import { startGenerateAttractionDetails } from '../../utils/startGenerateAttractionDetails'

const beforeHooks = [checkAttractionAccessUpdate]

const adminUpdateAttraction: AppSyncResolverHandler<AdminUpdateAttractionMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */

  for (const hook of beforeHooks) {
    await hook(event)
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE)
  }

  const { locations } = event.arguments.input

  const filteredLocations = locations?.filter(Boolean)

  if (!filteredLocations?.length) {
    throw new Error('No location provided')
  }

  // create a dictionary composed of googlePlaceIds and coords
  let placeDictionary: Record<string, Coords> = {}

  // create GooglePlaces for each googlePlaceId
  for (const location of filteredLocations) {
    if (location?.startLoc?.googlePlaceId) {
      let coords = placeDictionary[location.startLoc.googlePlaceId]
      if (!coords) {
        const googlePlace = await putGooglePlaceEntry({
          googlePlaceId: location.startLoc.googlePlaceId,
        })
        coords = googlePlace.data.coords
        placeDictionary[location.startLoc.googlePlaceId] = coords
      }
      location.startLoc.timezone = getTimezoneFromCoords(coords)
    }
    if (location?.endLoc?.googlePlaceId) {
      let coords = placeDictionary[location.endLoc.googlePlaceId]
      if (!coords) {
        const googlePlace = await putGooglePlaceEntry({
          googlePlaceId: location.endLoc.googlePlaceId,
        })
        coords = googlePlace.data.coords
        placeDictionary[location.endLoc.googlePlaceId] = coords
      }
      location.endLoc.timezone = getTimezoneFromCoords(coords)
    }
  }

  const updateAttractionArguments: UpdateAttractionInput = {
    ...event.arguments.input,
    locations: filteredLocations,
  }

  const attraction = await updateAttraction(updateAttractionArguments)

  if (!attraction) {
    throw new Error('Failed to update attraction')
  }

  // if generation is in step PENDING, invoke the generation function
  if (attraction.generation?.status === Status.PENDING) {
    if (attraction.generation.step === GenerationStep.GET_PHOTOS) {
      const getPhotosInput: GetAttractionPhotosQueryVariables = {
        input: {
          attractionId: attraction.id,
          photos: attraction?.locations?.[0]?.startLoc.googlePlace.data.photos ?? [],
        },
      }

      await startGetAttractionPhotos({
        queryVariables: getPhotosInput,
        failureCount: attraction.generation.failureCount ?? 0,
        shouldThrowIfError: false,
        withDynamoDbClient: false,
      })
    } else if (attraction.generation.step === GenerationStep.GET_DETAILS) {
      await startGenerateAttractionDetails({
        attractionId: attraction.id,
        failureCount: attraction.generation.failureCount ?? 0,
        shouldThrowIfError: false,
        withDynamoDbClient: false,
      })
    }
  }

  return attraction
}

export default adminUpdateAttraction
