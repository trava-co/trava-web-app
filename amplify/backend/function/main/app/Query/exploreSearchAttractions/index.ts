import { AppSyncResolverHandler } from 'aws-lambda'
import {
  BoundingBoxInput,
  CoordsInput,
  ExploreSearchAttractionsQueryVariables,
  ExploreSearchAttractionsResponse,
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

const exploreSearchAttractions: AppSyncResolverHandler<
  ExploreSearchAttractionsQueryVariables,
  ExploreSearchAttractionsResponse
> = async (event) => {
  console.log('exploreSearchAttractions')

  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const {
    searchString,
    attractionType,
    attractionCategories,
    attractionCuisine,
    insideBoundingBox,
    outsideBoundingBox,
    centerCoords,
    sortByDistance,
    excludeAttractionIds,
    selectedAttractionId,
  } = event.arguments.input

  let selectedAttractionPromise: Promise<ExploreSearchAttractionItem> | undefined

  if (selectedAttractionId && !excludeAttractionIds?.includes(selectedAttractionId)) {
    // get this specific attraction
    selectedAttractionPromise = getExploreSearchAttraction({
      attractionId: selectedAttractionId,
      centerCoords,
    })
  }

  let searchStringEmbedding: number[] | undefined

  if (searchString) {
    searchStringEmbedding = await getOpenAIEmbedding(searchString)
  }

  const attractionsOpenSearchQuery = createOpenSearchQuery({
    searchStringEmbedding,
    attractionType,
    attractionCategories,
    attractionCuisine,
    insideBoundingBox,
    outsideBoundingBox,
    centerCoords,
    sortByDistance,
    excludeAttractionIds,
  })

  const statsQuery = searchString ? createStatsOpenSearchQuery({ searchStringEmbedding }) : undefined

  const msearchQueryParts = [
    createQueryObjects(attractionsOpenSearchQuery),
    statsQuery ? createQueryObjects(statsQuery) : '',
  ]

  const msearchQuery = msearchQueryParts.join('')

  // @ts-ignore
  const msearchResponse = await ApiClient.get().openSearchMSearch('attraction', msearchQuery)

  let responseIndex = 0
  // @ts-ignore
  const attractionsOpenSearchResponse = msearchResponse.responses[responseIndex++]
  // @ts-ignore
  const statsResponse = searchString ? msearchResponse.responses[responseIndex++] : null

  const numberOfAttractions = attractionsOpenSearchResponse.hits.total.value
  console.log(`numberOfAttractions: ${numberOfAttractions}`)

  // when we have many results, we should be more lenient with the relevance threshold, as dumb results will be buried deeper in the list
  const Z_SCORE_THRESHOLD_NEARBY = numberOfAttractions < 50 ? 1.25 : 1

  const relevanceThreshold = statsResponse
    ? statsResponse.aggregations.score_stats.avg +
      Z_SCORE_THRESHOLD_NEARBY * statsResponse.aggregations.score_stats.std_deviation
    : undefined

  const getSearchAttractionItem = (hit: any): ExploreSearchAttractionItem => {
    const { _source, fields, sort } = hit
    return {
      __typename: 'ExploreSearchAttractionItem',
      id: _source.id,
      name: _source.name,
      locations: _source.locations,
      distance: centerCoords
        ? searchStringEmbedding || !sortByDistance
          ? fields?.min_distance[0]
          : sort?.[0]
        : undefined, // if we have a searchString or !sortByDistance, then we're relying on the script field, otherwise we're relying on the sort value
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
      type: _source.type,
      recommendationBadges: _source.recommendationBadges,
    }
  }

  // @ts-ignore
  let attractions = attractionsOpenSearchResponse.hits.hits
    .filter((item: any) => !relevanceThreshold || item._score >= relevanceThreshold)
    .map(getSearchAttractionItem) as ExploreSearchAttractionItem[]

  console.log(`numberOfAttractions: ${numberOfAttractions}`)
  console.log(`attractions.length: ${attractions.length}`)
  console.log(`nextPageExists: ${numberOfAttractions > attractions.length}`)

  const nextPageExists = attractions.length > 0 && numberOfAttractions > attractions.length

  const selectedAttraction = selectedAttractionPromise ? await selectedAttractionPromise : null

  if (selectedAttraction) {
    // we must ensure that the selected attraction is the first item in the list. OpenSearch may not have indexed it yet, so we use a db query to get it
    // Remove selectedAttraction from attractions if it exists
    attractions = attractions.filter((attraction) => attraction.id !== selectedAttraction.id)

    // Prepend selectedAttraction to the start of attractions
    attractions.unshift(selectedAttraction)
  }

  return {
    __typename: 'ExploreSearchAttractionsResponse',
    attractions,
    nextPageExists,
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
  'recommendationBadges',
]

const createOpenSearchQuery = ({
  searchStringEmbedding,
  attractionType,
  attractionCategories,
  attractionCuisine,
  centerCoords,
  sortByDistance,
  insideBoundingBox,
  outsideBoundingBox, // if not provided, then further away query is not constrained to a max distance
  excludeAttractionIds,
  pageSize = 25,
}: {
  searchStringEmbedding: number[] | undefined
  attractionType?: ATTRACTION_TYPE | null
  attractionCategories?: (ATTRACTION_CATEGORY_TYPE | null)[] | null | undefined
  attractionCuisine?: (ATTRACTION_CUISINE_TYPE | null)[] | null | undefined
  centerCoords?: CoordsInput | null
  sortByDistance: boolean
  insideBoundingBox?: BoundingBoxInput | null | undefined
  outsideBoundingBox?: BoundingBoxInput | null | undefined
  excludeAttractionIds: Array<string | null> | null | undefined
  pageSize?: number | null | undefined
}) => {
  const mustNotConditions: any[] = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
    // cannot be one of the excludeAttractionIds
    {
      terms: {
        id: excludeAttractionIds,
      },
    },
  ]

  const filterConditions: any[] = [
    {
      term: {
        privacy: 'PUBLIC',
      },
    },
    // ensure attraction has at least one valid location (not deleted, not CLOSED_PERMANENTLY)
    {
      exists: {
        field: 'startLoc_coords',
      },
    },
    {
      exists: {
        field: 'endLoc_coords',
      },
    },
  ]

  if (insideBoundingBox) {
    // push to filterConditions the insideBoundingBox condition
    filterConditions.push({
      geo_bounding_box: {
        startLoc_coords: {
          top_left: {
            lat: insideBoundingBox.topLeftCoords.lat,
            lon: insideBoundingBox.topLeftCoords.long,
          },
          bottom_right: {
            lat: insideBoundingBox.bottomRightCoords.lat,
            lon: insideBoundingBox.bottomRightCoords.long,
          },
        },
      },
    })
  }

  // if outsideBoundingBox exists, push to mustNotConditions the outsideBoundingBox condition
  if (outsideBoundingBox) {
    mustNotConditions.push({
      geo_bounding_box: {
        startLoc_coords: {
          top_left: {
            lat: outsideBoundingBox.topLeftCoords.lat,
            lon: outsideBoundingBox.topLeftCoords.long,
          },
          bottom_right: {
            lat: outsideBoundingBox.bottomRightCoords.lat,
            lon: outsideBoundingBox.bottomRightCoords.long,
          },
        },
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
    : centerCoords && sortByDistance
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
            mode: 'min',
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
    size: pageSize,
    query,
    sort,
    // use the sort value instead of redundantly computing this script field if possible
    script_fields:
      (searchStringEmbedding || !sortByDistance) && centerCoords
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

export default exploreSearchAttractions
