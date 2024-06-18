import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CoordsInput,
  GetAttractionsForSchedulerQueryVariables,
  GetAttractionsForSchedulerResponse,
  OpenSearchListAttractionItem,
  ATTRACTION_PRIVACY,
  LambdaListAttractionSwipesByTripByDestinationQueryVariables,
  LambdaListAttractionSwipesByTripByDestinationQuery,
  AttractionSwipeResult,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { getSeasonsObjectsFromStrings } from './utils/get-seasons-objects-from-strings'
import { lambdaListAttractionSwipesByTripByDestination } from 'shared-types/graphql/lambda'

const getAttractionsForScheduler: AppSyncResolverHandler<
  GetAttractionsForSchedulerQueryVariables,
  GetAttractionsForSchedulerResponse
> = async (event) => {
  console.log('getAttractionsForScheduler start')
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const { centerCoords, radius, tripId, destinationId } = event.arguments.input

  // query attractionSwipesByTripByDestination to get all attractionIds that the user has voted on
  const attractionSwipesByTripByDestination = await ApiClient.get().apiFetch<
    LambdaListAttractionSwipesByTripByDestinationQueryVariables,
    LambdaListAttractionSwipesByTripByDestinationQuery
  >({
    query: lambdaListAttractionSwipesByTripByDestination,
    variables: {
      tripId,
      destinationId: {
        eq: destinationId,
      },
      limit: 500,
    },
  })

  // assemble list of attractionIds with right swipes
  const rightSwipesSet: Set<string> = new Set()

  attractionSwipesByTripByDestination.data.listAttractionSwipesByTripByDestination?.items.forEach((item) => {
    if (item?.swipe === AttractionSwipeResult.LIKE) {
      rightSwipesSet.add(item.attractionId)
    }
  })

  const attractionIdsWithRightSwipes = Array.from(rightSwipesSet)

  const attractionsForSchedulerQuery = createOpenSearchQuery(
    destinationId,
    centerCoords,
    radius,
    attractionIdsWithRightSwipes,
  )

  const attractionsForSchedulerResponse = await ApiClient.get().openSearchFetch(
    'attraction',
    attractionsForSchedulerQuery,
  )

  const attractionsForScheduler: OpenSearchListAttractionItem[] = []

  // @ts-ignore
  attractionsForSchedulerResponse.hits.hits.forEach((hit) => {
    const { _source } = hit
    const attraction: OpenSearchListAttractionItem = {
      __typename: 'OpenSearchListAttractionItem',
      id: _source.id,
      name: _source.name,
      type: _source.type,
      bestVisited: _source.bestVisited,
      duration: _source.duration,
      attractionCategories: _source.attractionCategories,
      attractionCuisine: _source.attractionCuisine,
      locations: _source.locations,
      isTravaCreated: _source.isTravaCreated,
      authorType: _source.authorType,
      deletedAt: _source.deletedAt,
      ...(_source.seasons && {
        seasons: getSeasonsObjectsFromStrings(_source.seasons),
      }),
    }

    attractionsForScheduler.push(attraction)
  })

  return {
    __typename: 'GetAttractionsForSchedulerResponse',
    attractions: attractionsForScheduler,
  }
}

// get all public cards that are 1) not deleted and 2) within 15 miles of centerCoords
const createOpenSearchQuery = (
  destinationId: string,
  centerCoords: CoordsInput,
  range: number,
  attractionIdsWithRightSwipes: string[],
) => {
  const searchRadius = `${range}mi`
  const mustNotConditions = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions = [
    {
      term: {
        privacy: ATTRACTION_PRIVACY.PUBLIC,
      },
    },
    {
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
          {
            terms: {
              id: attractionIdsWithRightSwipes,
            },
          },
        ],
        minimum_should_match: 1,
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
      includes: [
        'id',
        'name',
        'type',
        'bestVisited',
        'duration',
        'attractionCategories',
        'attractionCuisine',
        'locations',
        'seasons',
        'isTravaCreated',
        'authorType',
        'deletedAt',
      ],
    },
    size: 500,
    query,
  }
}

export default getAttractionsForScheduler
