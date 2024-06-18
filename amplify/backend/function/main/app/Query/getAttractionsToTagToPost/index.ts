import { AppSyncResolverHandler } from 'aws-lambda'
import {
  GetAttractionsToTagToPostResponse,
  GetAttractionsToTagToPostQueryVariables,
  ATTRACTION_PRIVACY,
  CoordsInput,
  AttractionToTagToPostItem,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getOpenAIEmbedding from '../../utils/getOpenAIEmbedding'
import { createQueryObjects } from '../../utils/createQueryObjects'
import { createStatsOpenSearchQuery } from '../../utils/createStatsOpenSearchQuery'

const getAttractionsToTagToPost: AppSyncResolverHandler<
  GetAttractionsToTagToPostQueryVariables,
  GetAttractionsToTagToPostResponse
> = async (event) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('User is not authorized')
  }

  ApiClient.get().useIamAuth()

  const { searchString, radius, destinationCoords } = event.arguments.input

  let searchStringEmbedding: number[] | undefined

  if (searchString) {
    searchStringEmbedding = await getOpenAIEmbedding(searchString)
  }

  const openSearchQuery = createOpenSearchQuery({
    searchStringEmbedding,
    radius,
    destinationCoords,
    authorId: event.identity.sub,
  })

  const statsQuery = searchString ? createStatsOpenSearchQuery({ searchStringEmbedding }) : undefined

  const msearchQueryParts = [createQueryObjects(openSearchQuery), statsQuery ? createQueryObjects(statsQuery) : '']

  const msearchQuery = msearchQueryParts.join('')

  // @ts-ignore
  const msearchResponse = await ApiClient.get().openSearchMSearch('attraction', msearchQuery)

  // @ts-ignore
  const [openSearchQueryResponse, statsResponse] = msearchResponse.responses || []

  const Z_SCORE_THRESHOLD = 1.25

  const relevanceThreshold = statsResponse
    ? statsResponse.aggregations.score_stats.avg +
      Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
    : undefined

  const getTagToPostItem = (hit: any): AttractionToTagToPostItem => {
    const { _source: source } = hit

    const attraction: AttractionToTagToPostItem = {
      __typename: 'AttractionToTagToPostItem',
      id: source.id,
      name: source.name,
      destinationName: source.destination.name,
      attractionCategories: source.attractionCategories,
      bucketListCount: source.bucketListCount,
      type: source.type,
      author: source.author,
      images: source.images,
      isTravaCreated: source.isTravaCreated,
    }

    return attraction
  }

  const attractions = openSearchQueryResponse.hits.hits
    .filter((item: any) => !relevanceThreshold || item._score >= relevanceThreshold)
    .map(getTagToPostItem)

  return {
    __typename: 'GetAttractionsToTagToPostResponse',
    attractions,
  }
}

const createOpenSearchQuery = ({
  searchStringEmbedding,
  radius,
  destinationCoords,
  authorId,
}: {
  searchStringEmbedding: number[] | undefined
  radius?: number | null
  destinationCoords?: CoordsInput | null
  authorId: string
}) => {
  const searchRadius = `${radius}mi`
  const mustNotConditions = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions: any[] = [
    {
      // either should be public or should be created by me
      bool: {
        should: [
          {
            term: {
              privacy: ATTRACTION_PRIVACY.PUBLIC,
            },
          },
          {
            term: {
              'author.id': authorId,
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
  ]

  if (radius && destinationCoords) {
    filterConditions.push({
      bool: {
        should: [
          {
            geo_distance: {
              distance: searchRadius,
              startLoc_coords: {
                lat: destinationCoords.lat,
                lon: destinationCoords.long,
              },
            },
          },
          {
            geo_distance: {
              distance: searchRadius,
              endLoc_coords: {
                lat: destinationCoords.lat,
                lon: destinationCoords.long,
              },
            },
          },
        ],
        minimum_should_match: 1,
      },
    })
  }

  const sort = searchStringEmbedding
    ? {} // sort by similarity/relevance
    : destinationCoords
    ? [
        {
          _geo_distance: {
            startLoc_coords: {
              lat: destinationCoords.lat,
              lon: destinationCoords.long,
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

  return {
    _source: {
      includes: [
        'id',
        'name',
        'destination',
        'attractionCategories',
        'bucketListCount',
        'type',
        'author',
        'images',
        'isTravaCreated',
      ],
    },
    size: 100,
    query,
    sort,
  }
}

export default getAttractionsToTagToPost
