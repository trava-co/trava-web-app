import { AppSyncResolverHandler } from 'aws-lambda'
import {
  BACKEND_ENV_NAME,
  GenerationStep,
  GetAttractionPhotosQueryVariables,
  S3ObjectInput,
  Status,
} from 'shared-types/API'
import { getSSMVariable } from './utils/getSSMVariable'
import { getGooglePhoto } from './utils/getGooglePhoto'
import {
  updateAttraction,
  updateAttractionStatusToInProgress,
  updateAttractionWithFailure,
} from './utils/updateAttraction'
import { startGenerateAttractionDetails } from './utils/startGenerateAttractionDetails'
import { envNamesToConfig } from './utils/env-names-to-config'
import { getAttractionWithDynamoDbClient } from './utils/getAttraction'

const OTHER_DESTINATION_ID = '7cd39ab7-f703-45a0-8d4d-3732410f711f'

export const handler: AppSyncResolverHandler<GetAttractionPhotosQueryVariables, any> = async (event) => {
  const { attractionId, photos } = event.arguments.input

  console.log(`starting getAttractionPhotos with attraction id ${attractionId}`)

  const numPhotos = photos?.length

  const destinationId = OTHER_DESTINATION_ID

  // start fetch of google maps key
  const googleMapsKeyPromise = getSSMVariable('GOOGLE_MAPS_API_KEY')

  try {
    // attempt to update attraction status to IN_PROGRESS. If fails, log error and return false.
    // don't want to throw error & set FAILED status just because another fn is currently processing this attraction
    await updateAttractionStatusToInProgress({ attractionId })
  } catch (error: any) {
    console.error(
      `Attraction ${attractionId} is not in the GET_PHOTOS step or status is not PENDING. Error: ${error?.message}`,
    )
    if (error.code === 'TransactionCanceledException') {
      console.error(`Cancellation reasons: ${JSON.stringify(error.CancellationReasons)}`)
    }
    return false
  }

  // now that we have the attraction and have set status to IN_PROGRESS, we can attempt to get photos
  try {
    let images: S3ObjectInput[] = []
    console.log(`Getting ${numPhotos} photos for attraction ${attractionId}`)
    if (numPhotos) {
      // get bucket name from env
      const env = process.env.ENV
      if (!env) throw new Error('ENV not set')
      const parsedEnv = env.toUpperCase()
      const envConfig = envNamesToConfig[parsedEnv as BACKEND_ENV_NAME]
      const STORAGE_BUCKETNAME = envConfig.bucketName

      // if photos, getGooglePhoto for first 3
      const photosToGet = photos?.slice(0, 3) ?? []

      const GOOGLE_MAPS_KEY = await googleMapsKeyPromise

      const photoPromises = photosToGet.map((photo, i) =>
        getGooglePhoto({
          ...photo,
          destinationId,
          attractionId,
          order: i + 1,
          GOOGLE_MAPS_KEY,
          STORAGE_BUCKETNAME,
        }),
      )

      images = await Promise.all(photoPromises)
    }

    console.log('about to update attraction')

    // need to call appsync updateAttraction mutation to trigger subscription
    await updateAttraction({
      input: {
        id: attractionId,
        images: images?.length ? images : null,
        generation: {
          step: GenerationStep.GET_DETAILS,
          status: Status.PENDING,
          failureCount: 0, // success, so reset failureCount
          lastUpdatedAt: new Date().toISOString(),
        },
      },
    })

    console.log('Updated attraction')
  } catch (error: any) {
    // if there was a failure while getting the photos, update the attraction with the failure
    // first, fetch the attraction
    const attraction = await getAttractionWithDynamoDbClient({ attractionId })

    await updateAttractionWithFailure({
      attractionId,
      failureCount: attraction?.generation?.failureCount ?? undefined,
      step: GenerationStep.GET_PHOTOS,
      errorMessage: error?.message,
    }).catch((error: any) => console.error(error))

    return false
  }

  try {
    // start the generateAttractionDetails function
    await startGenerateAttractionDetails(attractionId)
    return true
  } catch (error: any) {
    // if there was a failure while starting the generateAttractionDetails function, update the attraction with the failure
    console.error('Error calling startGenerateAttractionDetails:', error)
    await updateAttractionWithFailure({
      attractionId,
      step: GenerationStep.GET_DETAILS,
      errorMessage: error?.message,
    }).catch((error: any) => console.error(error))

    return false
  }
}
