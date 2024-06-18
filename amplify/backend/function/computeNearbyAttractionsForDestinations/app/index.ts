import { ScheduledEvent, ScheduledHandler } from 'aws-lambda'
import {
  ATTRACTION_TYPE,
  UpdateDestinationMutationVariables,
  UpdateDestinationMutation,
  ATTRACTION_PRIVACY,
  CoordsInput,
  Parity,
  AUTHOR_TYPE,
} from 'shared-types/API'
import ApiClient from './utils/ApiClient'
import getAllDestinations from './utils/getAllDestinations'
import { updateDestination } from 'shared-types/graphql/mutations'
import getLastUpdateParity from './utils/getLastUpdateParity'
import createUpdate from './utils/createUpdate'

const NEARBY_THRESHOLD = 15 // miles
const ATTRACTIONS_LIMIT_PER_QUERY = 1000

// this lambda is triggered every 4 hours, and computes the number of nearby public attractions for each destination
export const handler: ScheduledHandler = async (event: ScheduledEvent) => {
  ApiClient.get().useIamAuth()

  const destinations = await getAllDestinations()
  const numDestinations = destinations.length

  const lastUpdate = await getLastUpdateParity()
  const lastUpdateParity = lastUpdate?.parityLastProcessed

  // if lastUpdateParity is odd or falsy, then iterate through even indices
  let parityToUpdateForThisRun = lastUpdateParity === Parity.EVEN ? Parity.ODD : Parity.EVEN
  console.log(`Processing ${parityToUpdateForThisRun}s during this run.`)

  let startIndex = 0

  if (parityToUpdateForThisRun === Parity.ODD) {
    startIndex = 1
  }

  let successCount = 0
  let failureCount = 0

  // for each destination, we need to compute the number of nearby public do/eat, and trava do/eat
  for (let i = startIndex; i < numDestinations; i += 2) {
    try {
      const destination = destinations[i]

      async function getOpenSearchQueryPromise({
        attractionType,
        createdByTravaAdminOnly,
      }: Pick<ICreateOpenSearchQuery, 'attractionType' | 'createdByTravaAdminOnly'>) {
        const query = createOpenSearchQuery({
          attractionType,
          createdByTravaAdminOnly,
          centerCoords: destination.coords,
          range: NEARBY_THRESHOLD,
          limit: ATTRACTIONS_LIMIT_PER_QUERY,
          destinationId: destination.id,
        })

        return ApiClient.get().openSearchFetch('attraction', query)
      }

      const publicDoCountPromise = getOpenSearchQueryPromise({
        attractionType: ATTRACTION_TYPE.DO,
        createdByTravaAdminOnly: false,
      })
      const publicEatCountPromise = getOpenSearchQueryPromise({
        attractionType: ATTRACTION_TYPE.EAT,
        createdByTravaAdminOnly: false,
      })
      const travaDoCountPromise = getOpenSearchQueryPromise({
        attractionType: ATTRACTION_TYPE.DO,
        createdByTravaAdminOnly: true,
      })
      const travaEatCountPromise = getOpenSearchQueryPromise({
        attractionType: ATTRACTION_TYPE.EAT,
        createdByTravaAdminOnly: true,
      })

      // compute the number of nearby public experiences and nearby trava public experiences
      const [publicDoCountResult, publicEatCountResult, travaDoCountResult, travaEatCountResult] = await Promise.all([
        publicDoCountPromise,
        publicEatCountPromise,
        travaDoCountPromise,
        travaEatCountPromise,
      ])

      // @ts-ignore
      const publicDoCount = publicDoCountResult.hits.total.value
      // @ts-ignore
      const publicEatCount = publicEatCountResult.hits.total.value
      // @ts-ignore
      const travaDoCount = travaDoCountResult.hits.total.value
      // @ts-ignore
      const travaEatCount = travaEatCountResult.hits.total.value

      // Update the destination with the actual counts
      await ApiClient.get().apiFetch<UpdateDestinationMutationVariables, UpdateDestinationMutation>({
        query: updateDestination,
        variables: {
          input: {
            id: destination.id,
            nearbyThingsToDoCount: publicDoCount,
            nearbyPlacesToEatCount: publicEatCount,
            nearbyTravaThingsToDoCount: travaDoCount,
            nearbyTravaPlacesToEatCount: travaEatCount,
            featured: travaDoCount >= 25 && travaEatCount >= 10,
          },
        },
      })

      successCount++
    } catch (e) {
      console.error(e)
      failureCount++
    }
  }

  await createUpdate(parityToUpdateForThisRun)

  console.log(
    `createDestinationNearbyAttractionsTrigger finished. successCount: ${successCount}, failureCount: ${failureCount}`,
  )
}

interface ICreateOpenSearchQuery {
  attractionType: ATTRACTION_TYPE
  centerCoords: CoordsInput
  range: number
  limit: number
  createdByTravaAdminOnly: boolean
  destinationId: string
}

// get all public cards that are 1) not deleted and 2) within 15 miles of centerCoords
const createOpenSearchQuery = ({
  attractionType,
  centerCoords,
  range,
  limit,
  createdByTravaAdminOnly,
  destinationId,
}: ICreateOpenSearchQuery) => {
  const searchRadius = `${range}mi`
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
        privacy: ATTRACTION_PRIVACY.PUBLIC,
      },
    },
  ]

  if (createdByTravaAdminOnly) {
    filterConditions.push(
      {
        term: {
          isTravaCreated: 1,
        },
      },
      {
        term: {
          authorType: AUTHOR_TYPE.ADMIN,
        },
      },
      {
        term: {
          'destination.id': destinationId,
        },
      },
    )
  } else {
    filterConditions.push({
      bool: {
        should: [
          {
            geo_distance: {
              distance: searchRadius,
              startLoc_coords: {
                lat: centerCoords.lat,
                lon: centerCoords.long,
              },
            },
          },
          {
            geo_distance: {
              distance: searchRadius,
              endLoc_coords: {
                lat: centerCoords.lat,
                lon: centerCoords.long,
              },
            },
          },
          {
            term: {
              'destination.id': destinationId,
            },
          },
        ],
        minimum_should_match: 1,
      },
    })
  }

  if (attractionType) {
    filterConditions.push({
      term: {
        type: attractionType,
      },
    })
  }

  const query = {
    bool: {
      filter: filterConditions,
      must_not: mustNotConditions,
    },
  }

  return {
    _source: {
      includes: ['id'],
    },
    size: limit,
    query,
  }
}
