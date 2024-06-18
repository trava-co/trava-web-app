import { ScheduledHandler } from 'aws-lambda'
import ApiClient from './utils/ApiClient'
import {
  LambdaGooglePlacesByIsValidByDataLastCheckedAtQueryVariables,
  LambdaGooglePlacesByIsValidByDataLastCheckedAtQuery,
  ModelSortDirection,
  PlaceDataInput,
  UpdateGooglePlaceInput,
  LambdaPrivateUpdateGooglePlaceMutationVariables,
  LambdaPrivateUpdateGooglePlaceMutation,
  LambdaPrivateUpdateAttractionMutationVariables,
  LambdaPrivateUpdateAttractionMutation,
  BACKEND_ENV_NAME,
} from 'shared-types/API'
import {
  lambdaGooglePlacesByIsValidByDataLastCheckedAt,
  lambdaPrivateUpdateGooglePlace,
  lambdaPrivateUpdateAttraction,
} from 'shared-types/graphql/lambda'
import { getGooglePlaceDetails } from './utils/getGooglePlaceDetails'
import { retryWithExponentialBackoff } from './utils/retryWithExponentialBackoff'
import { sendSlackMessage } from './utils/sendSlackMessage'
import getAllPaginatedData from './utils/getAllPaginatedData'
import { getSSMVariable } from './utils/getSSMVariable'

// this lambda is triggered every day at 7am UTC
export const handler: ScheduledHandler = async () => {
  // only run this function in production
  if (process.env.ENV?.toLowerCase() !== BACKEND_ENV_NAME.PROD.toLowerCase()) {
    console.log('updateGooglePlaces not running in non-prod environment')
    return
  }

  console.log('updateGooglePlaces started')
  ApiClient.get().useIamAuth()

  const key = await getSSMVariable('GOOGLE_MAPS_API_KEY')

  // 1. fetch all googlePlaces, oldest first
  const googlePlacesOldestFirst = await fetchGooglePlacesByOldestFirst()
  const existingGooglePlacesCount = googlePlacesOldestFirst?.length
  console.log(`total GooglePlaces: ${existingGooglePlacesCount}`)

  // if there are no google places, return
  if (!existingGooglePlacesCount) {
    throw new Error('no google places found')
  }

  // every day, process 1/45 of the oldest google places
  const proportionToProcess = 1 / 45
  // identify the oldest set of google places to process
  const batchSize = Math.ceil(existingGooglePlacesCount * proportionToProcess)
  const itemsToProcess = googlePlacesOldestFirst.slice(0, batchSize)
  console.log(`in tonight's batch, processing ${batchSize} items`)

  const placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded: string[] = []
  const placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed: string[] = []
  const placeIdsFailedFetchFromGoogleAndUpdateSucceeded: string[] = []
  const placeIdsFailedFetchFromGoogleAndUpdateFailed: string[] = []

  // 2. for each google place, query Google Places API and update the google place with the new data
  for (let i = 0; i < itemsToProcess.length; i++) {
    const place = itemsToProcess[i]
    console.log(`\n **************** \n processing google place id: ${place.id}`)
    const now = new Date().toISOString()

    let newGooglePlace: PlaceDataInput
    try {
      newGooglePlace = await retryWithExponentialBackoff({
        func: () => getGooglePlaceDetails({ placeId: place.id, GOOGLE_MAPS_KEY: key }),
        maxRetries: 1,
      })
    } catch (error: any) {
      error.message = `\n Error fetching google place for googlePlaceId: ${place.id} from Google API. ${error.message}`
      console.warn(error)

      // update google place data, incrementing consecutiveFailedRequests
      const newConsecutiveFailedRequests = (place.consecutiveFailedRequests ?? 0) + 1

      const input: UpdateGooglePlaceInput = {
        id: place.id,
        consecutiveFailedRequests: newConsecutiveFailedRequests,
        // if there have been 2 consecutive failed requests, mark the google place as invalid to avoid future requests
        isValid: newConsecutiveFailedRequests < 2 ? 1 : 0,
        dataLastCheckedAt: now,
      }

      try {
        await updateGooglePlace(input)
        placeIdsFailedFetchFromGoogleAndUpdateSucceeded.push(place.id)
      } catch (error: any) {
        placeIdsFailedFetchFromGoogleAndUpdateFailed.push(place.id)
        console.warn(error)
      }

      continue
    }

    const input: UpdateGooglePlaceInput = {
      id: place.id,
      data: newGooglePlace,
      consecutiveFailedRequests: 0,
      isValid: 1,
      dataLastCheckedAt: now,
      dataLastUpdatedAt: now,
    }

    try {
      await updateGooglePlace(input)
      placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.push(place.id)
      console.log(`successfully updated google place id: ${place.id}`)
    } catch (error: any) {
      placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.push(place.id)
      console.warn(error)
    }
  }

  // 3. log the results
  console.log(`\n\n******\n\n${batchSize} items fetched from GooglePlaces table for updating:`)

  console.log(
    `\n\n******\n\n${placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.length} google places successfully fetched & updated GooglePlaces table:`,
  )
  placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.forEach((placeId) => console.log(placeId))

  console.log(
    `\n\n******\n\n ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.length} google places successfully fetched but failed to update GooglePlaces table:`,
  )
  placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.forEach((placeId) => console.log(placeId))

  console.log(
    `\n\n******\n\n${placeIdsFailedFetchFromGoogleAndUpdateSucceeded.length} google places failed to fetch but successfully updated GooglePlaces table:`,
  )
  placeIdsFailedFetchFromGoogleAndUpdateSucceeded.forEach((placeId) => console.log(placeId))

  console.log(
    `\n\n******\n\n${placeIdsFailedFetchFromGoogleAndUpdateFailed.length} google places failed to fetch & failed to update GooglePlaces table:`,
  )
  placeIdsFailedFetchFromGoogleAndUpdateFailed.forEach((placeId) => console.log(placeId))

  // these place ids need to be checked manually and potentially updated manually
  const placeIdsFailedFetchFromGoogle = [
    ...placeIdsFailedFetchFromGoogleAndUpdateSucceeded,
    ...placeIdsFailedFetchFromGoogleAndUpdateFailed,
  ]

  // 4. send slack message with results
  const messageParts = [
    'Google Places Nightly Update:',
    `- Total items processed: ${batchSize}`,
    `- Google fetch succeeded, Trava update succeeded: ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.length}`,
    `- Google fetch succeeded, Trava update failed: ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.length}`,
    `- Google fetch failed, Trava update succeeded: ${placeIdsFailedFetchFromGoogleAndUpdateSucceeded.length}`,
    `- Google fetch failed, Trava update failed: ${placeIdsFailedFetchFromGoogleAndUpdateFailed.length}`,
  ]

  placeIdsFailedFetchFromGoogle.length > 0 &&
    messageParts.push('\nSee attached CSV for IDs that failed to fetch from Google.')

  const message = messageParts.join('\n')

  await sendSlackMessage(message, placeIdsFailedFetchFromGoogle)
}

const fetchGooglePlacesByOldestFirst = async () => {
  const googlePlaces: { id: string; consecutiveFailedRequests?: number | null }[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const result = await ApiClient.get().apiFetch<
        LambdaGooglePlacesByIsValidByDataLastCheckedAtQueryVariables,
        LambdaGooglePlacesByIsValidByDataLastCheckedAtQuery
      >({
        query: lambdaGooglePlacesByIsValidByDataLastCheckedAt,
        variables: {
          isValid: 1,
          limit: 1000,
          sortDirection: ModelSortDirection.ASC,
          nextToken,
        },
      })

      return {
        nextToken: result.data?.googlePlacesByIsValidByDataLastCheckedAt?.nextToken,
        data: result.data?.googlePlacesByIsValidByDataLastCheckedAt?.items,
      }
    },
    (data) => {
      if (!data) return

      data.forEach((item) => {
        if (!item) return
        googlePlaces.push(item)
      })
    },
  )

  return googlePlaces
}

// get the attraction ids associated with this googlePlaceId, and update these attractions to trigger update to OpenSearch attraction documents
const updateAssociatedAttractions = async (googlePlaceId: string) => {
  // query OpenSearch with googlePlaceId to get the attraction id
  const openSearchQuery = createOpenSearchQuery(googlePlaceId)
  const openSearchResponse = await ApiClient.get().openSearchFetch('attraction', openSearchQuery)
  // @ts-ignore
  const matchedAttractionDocs = openSearchResponse.hits.hits

  // @ts-ignore
  const matchedAttractionIds = matchedAttractionDocs.map((doc) => doc._source.id)
  if (matchedAttractionIds?.length > 0) {
    console.log(`matched attractionIds: ${matchedAttractionIds}`)
  } else {
    console.log(`no attractions matched for googlePlaceId: ${googlePlaceId}`)
    // TODO: think about deleting this googleplace if there are no attractions associated with it
  }

  // for each of these attractionIds, update the attraction's updatedAt field to trigger update to OpenSearch attraction docs with this googlePlaceId
  for (const matchedAttractionId of matchedAttractionIds) {
    console.log(`updating attraction id: ${matchedAttractionId}`)
    await ApiClient.get().apiFetch<
      LambdaPrivateUpdateAttractionMutationVariables,
      LambdaPrivateUpdateAttractionMutation
    >({
      query: lambdaPrivateUpdateAttraction,
      variables: {
        input: {
          id: matchedAttractionId,
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }
}

const updateGooglePlace = async (updateGooglePlaceInput: UpdateGooglePlaceInput) => {
  await ApiClient.get()
    .apiFetch<LambdaPrivateUpdateGooglePlaceMutationVariables, LambdaPrivateUpdateGooglePlaceMutation>({
      query: lambdaPrivateUpdateGooglePlace,
      variables: { input: updateGooglePlaceInput },
    })
    .catch((error: any) => {
      error.message = `\n Error updating GooglePlace table for googlePlaceId: ${updateGooglePlaceInput.id}. ${error.message}`
      throw error
    })

  await updateAssociatedAttractions(updateGooglePlaceInput.id).catch((error) => {
    error.message = `\n Error updating associated attractions for googlePlaceId: ${updateGooglePlaceInput.id}. ${error.message}`
    throw error
  })
}

const createOpenSearchQuery = (googlePlaceId: string) => {
  const filterConditions = [
    {
      term: {
        googlePlaceIds: googlePlaceId,
      },
    },
  ]

  const query = {
    bool: {
      filter: filterConditions,
    },
  }

  return {
    _source: {
      includes: ['id'],
    },
    size: 50,
    query,
  }
}
