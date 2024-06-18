import { AppSyncResolverHandler } from 'aws-lambda'
import {
  BoundingBoxInput,
  CoordsInput,
  ExploreMapSearchAttractionsQueryVariables,
  ExploreMapSearchAttractionsResponse,
  ATTRACTION_TYPE,
  ATTRACTION_CATEGORY_TYPE,
  ATTRACTION_CUISINE_TYPE,
  ExploreSearchAttractionItem,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getOpenAIEmbedding from '../../utils/getOpenAIEmbedding'
import { createQueryObjects } from '../../utils/createQueryObjects'
import { createStatsOpenSearchQuery } from '../../utils/createStatsOpenSearchQuery'
import { getExploreSearchAttraction } from '../../utils/getExploreSearchAttraction'

const exploreMapSearchAttractions: AppSyncResolverHandler<
  ExploreMapSearchAttractionsQueryVariables,
  ExploreMapSearchAttractionsResponse
> = async (event) => {
  console.log('exploreMapSearchAttractions')
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const {
    searchString,
    attractionType,
    attractionCategories,
    attractionCuisine,
    boundingBox,
    centerCoords,
    selectedAttractionId,
    sortByDistance,
  } = event.arguments.input

  if (selectedAttractionId) {
    // get this specific attraction
    const attraction = await getExploreSearchAttraction({
      attractionId: selectedAttractionId,
      centerCoords,
    })

    return {
      __typename: 'ExploreMapSearchAttractionsResponse',
      attractions: [attraction],
    }
  }

  let searchStringEmbedding: number[] | undefined

  if (searchString) {
    searchStringEmbedding = await getOpenAIEmbedding(searchString)
  }

  let openSearchQuery

  if (selectedAttractionId) {
    // get this specific attraction
    openSearchQuery = createGetAttractionOpenSearchQuery({
      attractionId: selectedAttractionId,
      centerCoords,
    })
  } else {
    openSearchQuery = createOpenSearchQuery({
      searchStringEmbedding,
      attractionType,
      attractionCategories,
      attractionCuisine,
      centerCoords,
      boundingBox,
      sortByDistance,
    })
  }

  const statsQuery = searchString ? createStatsOpenSearchQuery({ searchStringEmbedding }) : undefined

  const msearchQueryParts = [createQueryObjects(openSearchQuery), statsQuery ? createQueryObjects(statsQuery) : '']

  const msearchQuery = msearchQueryParts.join('')

  // @ts-ignore
  const msearchResponse = await ApiClient.get().openSearchMSearch('attraction', msearchQuery)
  // @ts-ignore
  const [openSearchQueryResponse, statsResponse] = msearchResponse.responses || []

  const numberOfNearbyAttractions = openSearchQueryResponse.hits.total.value

  // when we have many results, we should be more lenient with the relevance threshold, as dumb results will be buried deeper in the list
  const Z_SCORE_THRESHOLD = numberOfNearbyAttractions < 50 ? 1.25 : 1

  const relevanceThreshold = statsResponse
    ? statsResponse.aggregations.score_stats.avg +
      Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
    : undefined

  const getSearchAttractionItem = (hit: any): ExploreSearchAttractionItem => {
    const { _source, fields, sort } = hit

    const useFields = selectedAttractionId || searchStringEmbedding || !sortByDistance

    // sort conditions
    // if useFields, then we're relying on the script field, otherwise we're relying on the sort value
    const distance = useFields ? fields?.min_distance[0] : sort?.[0] // if we have a searchString, then we're relying on the script field, otherwise we're relying on the sort value

    return {
      __typename: 'ExploreSearchAttractionItem',
      id: _source.id,
      name: _source.name,
      locations: _source.locations,
      distance,
      isTravaCreated: _source.isTravaCreated,
      images: _source.images,
      attractionCategories: _source.attractionCategories,
      attractionCuisine: _source.attractionCuisine,
      author:
        (_source.author?.id && {
          __typename: 'SearchAttractionAuthorItem',
          id: _source.author.id,
          username: _source.author.username,
        }) ??
        null, // if author doesn't exist, return null for the whole field
      bucketListCount: _source.bucketListCount,
      duration: _source.duration,
      type: _source.type,
    }
  }

  // @ts-ignore
  const attractions = openSearchQueryResponse.hits.hits
    .filter(
      (item: any, index: number) => !!selectedAttractionId || !relevanceThreshold || item._score >= relevanceThreshold,
    )
    .map(getSearchAttractionItem)

  return {
    __typename: 'ExploreMapSearchAttractionsResponse',
    attractions,
  }
}

const includedFields = [
  'id',
  'name',
  'locations',
  'isTravaCreated',
  'images',
  'attractionCategories',
  'attractionCuisine',
  'author',
  'bucketListCount',
  'duration',
  'type',
]

const createGetAttractionOpenSearchQuery = ({
  attractionId,
  centerCoords,
}: {
  attractionId: string
  centerCoords: CoordsInput
}) => {
  const query = {
    bool: {
      filter: {
        term: {
          id: attractionId,
        },
      },
    },
  }

  return {
    _source: {
      includes: includedFields,
    },
    query,
    script_fields: {
      min_distance: {
        script: {
          lang: 'painless',
          source:
            "double haversineDistance(double lat1, double lon1, double lat2, double lon2) { double R = 6371e3; double phi1 = Math.toRadians(lat1); double phi2 = Math.toRadians(lat2); double deltaPhi = Math.toRadians(lat2 - lat1); double deltaLambda = Math.toRadians(lon2 - lon1); double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2); double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; } double minDistance = Double.MAX_VALUE; for (def loc : doc['startLoc_coords']) { double curDistance = haversineDistance(params.lat, params.lon, loc.lat, loc.lon); minDistance = Math.min(minDistance, curDistance); } return minDistance / 1609.34;",
          params: {
            lat: centerCoords.lat,
            lon: centerCoords.long,
          },
        },
      },
    },
  }
}

const createOpenSearchQuery = ({
  searchStringEmbedding,
  attractionType,
  attractionCategories,
  attractionCuisine,
  boundingBox,
  centerCoords,
  sortByDistance,
}: {
  searchStringEmbedding: number[] | undefined
  attractionType?: ATTRACTION_TYPE | null
  attractionCategories?: (ATTRACTION_CATEGORY_TYPE | null)[] | null | undefined
  attractionCuisine?: (ATTRACTION_CUISINE_TYPE | null)[] | null | undefined
  boundingBox: BoundingBoxInput
  centerCoords: CoordsInput
  sortByDistance: boolean
}) => {
  const mustNotConditions: any[] = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions: any[] = [
    {
      term: {
        privacy: 'PUBLIC',
      },
    },
    {
      geo_bounding_box: {
        startLoc_coords: {
          top_left: {
            lat: boundingBox.topLeftCoords.lat,
            lon: boundingBox.topLeftCoords.long,
          },
          bottom_right: {
            lat: boundingBox.bottomRightCoords.lat,
            lon: boundingBox.bottomRightCoords.long,
          },
        },
      },
    },
  ]

  if (attractionType) {
    filterConditions.push({
      term: {
        type: attractionType,
      },
    })
  }

  if (attractionCategories) {
    filterConditions.push({
      terms: {
        attractionCategories: attractionCategories,
      },
    })
  }

  if (attractionCuisine) {
    filterConditions.push({
      terms: {
        attractionCuisine: attractionCuisine,
      },
    })
  }

  const query = searchStringEmbedding
    ? {
        script_score: {
          query: {
            bool: {
              filter: filterConditions,
              must_not: mustNotConditions,
            },
          },
          script: {
            lang: 'knn',
            source: 'knn_score',
            params: {
              field: 'embedding',
              query_value: searchStringEmbedding,
              space_type: 'cosinesimil',
            },
          },
        },
      }
    : {
        bool: {
          filter: filterConditions,
          must_not: mustNotConditions,
        },
      }

  const sort = searchStringEmbedding
    ? {} // sort by similarity/relevance
    : sortByDistance
    ? [
        {
          _geo_distance: {
            startLoc_coords: {
              lat: centerCoords.lat,
              lon: centerCoords.long,
            },
            order: 'asc',
            unit: 'mi',
            distance_type: 'arc',
          },
        },
      ]
    : [
        {
          rank: {
            order: 'asc',
          },
        },
        {
          bucketListCount: {
            order: 'desc',
          },
        },
        {
          type: {
            order: 'asc',
          },
        },
      ]

  return {
    _source: {
      includes: includedFields,
    },
    size: 50,
    query,
    sort,
    // if we don't have a searchString, then we're sorting by distance, so we can use the returned sort value instead of redundantly computing this script field
    script_fields:
      searchStringEmbedding || !sortByDistance
        ? {
            min_distance: {
              script: {
                lang: 'painless',
                source:
                  "double haversineDistance(double lat1, double lon1, double lat2, double lon2) { double R = 6371e3; double phi1 = Math.toRadians(lat1); double phi2 = Math.toRadians(lat2); double deltaPhi = Math.toRadians(lat2 - lat1); double deltaLambda = Math.toRadians(lon2 - lon1); double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2); double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; } double minDistance = Double.MAX_VALUE; for (def loc : doc['startLoc_coords']) { double curDistance = haversineDistance(params.lat, params.lon, loc.lat, loc.lon); minDistance = Math.min(minDistance, curDistance); } return minDistance / 1609.34;",
                params: {
                  lat: centerCoords.lat,
                  lon: centerCoords.long,
                },
              },
            },
          }
        : undefined,
  }
}

export default exploreMapSearchAttractions
