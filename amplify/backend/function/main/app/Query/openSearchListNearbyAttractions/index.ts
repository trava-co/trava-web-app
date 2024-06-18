import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CoordsInput,
  OpenSearchListNearbyAttractionsQueryVariables,
  OpenSearchListNearbyAttractionsResponse,
  OpenSearchListAttractionItem,
  ATTRACTION_PRIVACY,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { getSeasonsObjectsFromStrings } from './utils/get-seasons-objects-from-strings'

const openSearchListNearbyAttractions: AppSyncResolverHandler<
  OpenSearchListNearbyAttractionsQueryVariables,
  OpenSearchListNearbyAttractionsResponse
> = async (event) => {
  console.log('openSearchListNearbyAttractions start')
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const { centerCoords, radius } = event.arguments.input

  const nearbyPublicAttractionsQuery = createOpenSearchQuery(centerCoords, radius)

  const nearbyTravaAttractionsOpenSearchResponse = await ApiClient.get().openSearchFetch(
    'attraction',
    nearbyPublicAttractionsQuery,
  )

  const nearbyTravaAttractions: OpenSearchListAttractionItem[] = []

  // @ts-ignore
  nearbyTravaAttractionsOpenSearchResponse.hits.hits.forEach((hit) => {
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

    nearbyTravaAttractions.push(attraction)
  })

  return {
    __typename: 'OpenSearchListNearbyAttractionsResponse',
    attractions: nearbyTravaAttractions,
  }
}

// get all public cards that are 1) not deleted and 2) within 15 miles of centerCoords
const createOpenSearchQuery = (centerCoords: CoordsInput, range: number) => {
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
      excludes: [
        'embedding',
        'cost',
        'privacy',
        'destinationId',
        'createdAt',
        'costNote',
        'costType',
        'reservation',
        'rank',
        'attractionTargetGroups',
        'costCurrency',
        'updatedAt',
        'bucketListCount',
        'tags',
        'description',
        'startLoc_coords',
        'endLoc_coords',
      ],
    },
    size: 500,
    query,
  }
}

export default openSearchListNearbyAttractions
