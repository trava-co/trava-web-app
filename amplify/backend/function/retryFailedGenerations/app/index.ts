import { ScheduledEvent, ScheduledHandler } from 'aws-lambda'
import { Generation, GenerationStep, GetAttractionPhotosQueryVariables, Status } from 'shared-types/API'
import ApiClient from './utils/ApiClient'
import { updateAttraction } from './utils/updateAttraction'
import { startGetAttractionPhotos } from './utils/startGetAttractionPhotos'
import { startGenerateAttractionDetails } from './utils/startGenerateAttractionDetails'

type SearchableAttraction = {
  id: string
  generation: Generation
}

const failureCountLimit = 3

// this lambda is triggered every 15 minutes, and retriggers attractions with failed generations and fewer than 3 failures
export const handler: ScheduledHandler = async (event: ScheduledEvent) => {
  console.log('retryFailedGenerations triggered')

  ApiClient.get().useIamAuth()

  // get all attractions that have failed generations from opensearch
  const getPhotosQuery = createOpenSearchQuery({ generationStep: GenerationStep.GET_PHOTOS })
  const getDetailsQuery = createOpenSearchQuery({ generationStep: GenerationStep.GET_DETAILS })

  const getPhotosPromise = ApiClient.get().openSearchFetch('attraction', getPhotosQuery)
  const getDetailsPromise = ApiClient.get().openSearchFetch('attraction', getDetailsQuery)

  const [getPhotosResponse, getDetailsResponse] = await Promise.all([getPhotosPromise, getDetailsPromise])

  // @ts-ignore
  const failedPhotosAttractions = getPhotosResponse.hits.hits.map((hit) => hit._source)
  console.log(`found ${failedPhotosAttractions.length} attractions with failed or pending getPhotos generations`)

  // @ts-ignore
  const failedDetailsAttractions = getDetailsResponse.hits.hits.map((hit) => hit._source)

  console.log(`found ${failedDetailsAttractions.length} attractions with failed or pending getDetails generations`)

  // for each of the failedPhotosAttractions, retrigger the getPhotos mutation by setting generationStatus to PENDING via appsync
  const failedPhotosPromises = failedPhotosAttractions.map(async (attraction: SearchableAttraction) => {
    const input = {
      id: attraction.id,
      generation: {
        ...attraction.generation,
        status: Status.PENDING,
        lastUpdatedAt: new Date().toISOString(),
      },
    }

    const updatedAttraction = await updateAttraction({
      input,
    })

    const getPhotosInput: GetAttractionPhotosQueryVariables = {
      input: {
        attractionId: attraction.id,
        photos: updatedAttraction?.locations?.[0]?.startLoc.googlePlace.data.photos ?? [],
      },
    }

    return startGetAttractionPhotos({
      queryVariables: getPhotosInput,
      failureCount: attraction.generation.failureCount ?? 0,
    })
  })

  // for each of the failedDetailsAttractions, retrigger the getDetails mutation by setting generationStatus to PENDING
  const failedDetailsPromises = failedDetailsAttractions.map(async (attraction: SearchableAttraction) => {
    const input = {
      id: attraction.id,
      generation: {
        ...attraction.generation,
        status: Status.PENDING,
        lastUpdatedAt: new Date().toISOString(),
      },
    }
    console.log(`retriggering getDetails for attraction with input: ${JSON.stringify(input, null, 2)}`)
    await updateAttraction({
      input,
    })

    return startGenerateAttractionDetails({
      attractionId: attraction.id,
      failureCount: attraction.generation.failureCount ?? 0,
    })
  })

  await Promise.allSettled([...failedPhotosPromises, ...failedDetailsPromises])

  console.log(
    `finished processing ${failedPhotosAttractions.length} attractions with failed getPhotos generations and ${failedDetailsAttractions.length} attractions with failed getDetails generations`,
  )
}

interface ICreateOpenSearchQuery {
  generationStep: GenerationStep
}

const createOpenSearchQuery = ({ generationStep }: ICreateOpenSearchQuery) => {
  const mustNotConditions = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions: any[] = [
    {
      term: {
        'generation.step': generationStep,
      },
    },
    {
      bool: {
        should: [
          {
            term: {
              'generation.status': Status.FAILED,
            },
          },
          {
            term: {
              'generation.status': Status.PENDING,
            },
          },
          {
            bool: {
              must: [
                {
                  term: {
                    'generation.status': Status.IN_PROGRESS,
                  },
                },
                {
                  range: {
                    'generation.lastUpdatedAt': {
                      lt: tenMinutesAgo,
                    },
                  },
                },
              ],
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
    {
      range: {
        'generation.failureCount': {
          lt: failureCountLimit,
        },
      },
    },
  ]

  const query = {
    bool: {
      filter: filterConditions,
      must_not: mustNotConditions,
    },
  }

  return {
    _source: {
      includes: ['id', 'generation'],
    },
    size: 50,
    query,
  }
}

const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
