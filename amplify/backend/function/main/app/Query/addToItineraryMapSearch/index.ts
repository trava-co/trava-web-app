import { AppSyncResolverHandler } from 'aws-lambda'
import {
  BoundingBoxInput,
  CoordsInput,
  AddToItineraryMapSearchQueryVariables,
  AddToItineraryMapSearchResponse,
  ATTRACTION_TYPE,
  ATTRACTION_CATEGORY_TYPE,
  ATTRACTION_CUISINE_TYPE,
  LambdaGetUserAndDeckAttractionsAndTripPlanQuery,
  LambdaGetUserAndDeckAttractionsAndTripPlanQueryVariables,
  ATTRACTION_PRIVACY,
  VotingResultsInput,
  ItinerarySearchAttractionItem,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getOpenAIEmbedding from '../../utils/getOpenAIEmbedding'
import { lambdaGetUserAndDeckAttractionsAndTripPlan } from 'shared-types/graphql/lambda'
import { createQueryObjects } from '../../utils/createQueryObjects'
import { createStatsOpenSearchQuery } from '../../utils/createStatsOpenSearchQuery'
import { getItinerarySearchAttraction } from '../../utils/getItinerarySearchAttraction'

const addToItineraryMapSearch: AppSyncResolverHandler<
  AddToItineraryMapSearchQueryVariables,
  AddToItineraryMapSearchResponse
> = async (event) => {
  console.log('addToItineraryMapSearch')
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('not authorized')
  }

  const userId = event.identity.sub

  const {
    tripId,
    destinationId,
    searchString,
    attractionType,
    attractionCategories,
    attractionCuisine,
    boundingBox,
    centerCoords,
    destinationDates,
    selectedAttractionId,
    attractionVotingResults,
  } = event.arguments.input

  let searchStringEmbeddingPromise: Promise<number[]> | undefined

  if (searchString) {
    searchStringEmbeddingPromise = getOpenAIEmbedding(searchString)
  }

  // get user, deck attractions, and trip plan
  const lambdaGetUserAndDeckAttractionsAndTripPlanResponsePromise = ApiClient.get().apiFetch<
    LambdaGetUserAndDeckAttractionsAndTripPlanQueryVariables,
    LambdaGetUserAndDeckAttractionsAndTripPlanQuery
  >({
    query: lambdaGetUserAndDeckAttractionsAndTripPlan,
    variables: {
      userId,
      tripId,
      destinationId,
      type: attractionType,
    },
  })

  // create attractionVotingResultsDict for efficient lookup of voting record
  const attractionVotingResultsDict = attractionVotingResults?.reduce((dict, result) => {
    dict[result.attractionId] = result.votingResults
    return dict
  }, {} as AttractionVotingResultsDict)

  // await resolution of searchStringEmbeddingPromise and lambdaGetUserAndDeckAttractionsResponse
  const [searchStringEmbedding, lambdaGetUserAndDeckAttractionsResponse] = await Promise.all([
    searchStringEmbeddingPromise,
    lambdaGetUserAndDeckAttractionsAndTripPlanResponsePromise,
  ])

  const user = lambdaGetUserAndDeckAttractionsResponse?.data?.getUser
  const userTrip = user?.userTrips?.items?.[0]?.trip
  const tripDestination = userTrip?.tripDestinations?.items?.[0]
  const tripPlan = tripDestination?.tripPlan

  const bucketListedAttractionIds =
    user?.bucketList?.items?.filter?.((el) => !el?.attraction?.deletedAt)?.map((el) => el?.attractionId) ?? []
  const attractionIdsOnItinerary = (tripPlan || []).flatMap((tripPlanDays) =>
    tripPlanDays?.tripPlanDayItems.map((tripPlanDayItem) => tripPlanDayItem?.attractionId),
  )

  if (selectedAttractionId) {
    // get this specific attraction
    const attraction = await getItinerarySearchAttraction({
      attractionId: selectedAttractionId,
      centerCoords,
      destinationDates,
      inMyBucketList: bucketListedAttractionIds.includes(selectedAttractionId),
      onItinerary: attractionIdsOnItinerary.includes(selectedAttractionId),
      votingResults: attractionVotingResultsDict?.[selectedAttractionId],
    })

    return {
      __typename: 'AddToItineraryMapSearchResponse',
      attractions: [attraction],
    }
  }

  let openSearchQuery

  // searching for attractions
  openSearchQuery = createSearchAttractionsOpenSearchQuery({
    searchStringEmbedding,
    attractionType,
    attractionCategories,
    attractionCuisine,
    centerCoords,
    boundingBox,
    destinationDates,
    userId,
    bucketListedAttractionIds,
    attractionIdsOnItinerary,
    attractionVotingResultsDict,
  })

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

  const getSearchItem = (hit: any): ItinerarySearchAttractionItem => {
    const { _source, fields, sort } = hit

    const useFields = selectedAttractionId || searchStringEmbedding

    // sort conditions
    // if useFields, then we're relying on the script field, otherwise we're relying on the sort value
    const onItinerary = useFields ? fields?.onItinerary[0] : sort?.[0]
    const inSeason = useFields ? fields?.inSeason[0] : sort?.[1]
    const inMyBucketList = useFields ? fields?.inMyBucketList[0] : sort?.[4]
    const distance = useFields ? fields?.min_distance[0] : sort?.[sort?.length - 1]

    const yesVotes = fields?.yesVotes[0] ?? 0
    const noVotes = fields?.noVotes[0] ?? 0

    return {
      __typename: 'ItinerarySearchAttractionItem',
      id: _source.id,
      name: _source.name,
      locations: _source.locations,
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
      distance,
      inSeason,
      inMyBucketList,
      onItinerary,
      yesVotes,
      noVotes,
    }
  }

  const attractions = openSearchQueryResponse.hits.hits
    .filter(
      (item: any, index: number) => !!selectedAttractionId || !relevanceThreshold || item._score >= relevanceThreshold,
    )
    .map(getSearchItem)

  return {
    __typename: 'AddToItineraryMapSearchResponse',
    attractions,
  }
}

type AttractionVotingResultsDict = { [attractionId: string]: VotingResultsInput }

type ScriptFieldsParams = {
  centerCoords: CoordsInput
  destinationDates: string[]
  userId: string
  bucketListedAttractionIds: (string | undefined)[] | null | undefined
  attractionIdsOnItinerary: (string | undefined)[] | null | undefined
  attractionVotingResultsDict?: AttractionVotingResultsDict | null | undefined
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

const createScriptFields = (params: ScriptFieldsParams, justVotes: boolean) => {
  const votes = {
    yesVotes: {
      script: {
        lang: 'painless',
        source:
          "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].yesVotes : 0.0",
        params: {
          attractionVotingResultsDict: params.attractionVotingResultsDict,
        },
      },
    },
    noVotes: {
      script: {
        lang: 'painless',
        source:
          "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].noVotes : 0.0",
        params: {
          attractionVotingResultsDict: params.attractionVotingResultsDict,
        },
      },
    },
  }

  if (justVotes) {
    return {
      script_fields: votes,
    }
  }

  return {
    script_fields: {
      min_distance: {
        script: {
          lang: 'painless',
          source:
            "double haversineDistance(double lat1, double lon1, double lat2, double lon2) { double R = 6371e3; double phi1 = Math.toRadians(lat1); double phi2 = Math.toRadians(lat2); double deltaPhi = Math.toRadians(lat2 - lat1); double deltaLambda = Math.toRadians(lon2 - lon1); double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2); double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; } double minDistance = Double.MAX_VALUE; for (def loc : doc['startLoc_coords']) { double curDistance = haversineDistance(params.lat, params.lon, loc.lat, loc.lon); minDistance = Math.min(minDistance, curDistance); } return minDistance / 1609.34;",
          params: {
            lat: params.centerCoords.lat,
            lon: params.centerCoords.long,
          },
        },
      },
      inSeason: {
        script: {
          lang: 'painless',
          source:
            "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
          params: {
            destination_start_date: params.destinationDates[0],
            destination_end_date: params.destinationDates[1],
          },
        },
      },
      isMyCard: {
        script: {
          lang: 'painless',
          source: "doc['author.id'].size() == 0 ? 0.0 : (doc['author.id'].value == params.userId ? 1.0 : 0.0)",
          params: {
            userId: params.userId,
          },
        },
      },
      inMyBucketList: {
        script: {
          lang: 'painless',
          source: "params.bucketListedAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0",
          params: {
            bucketListedAttractionIds: params.bucketListedAttractionIds,
          },
        },
      },
      onItinerary: {
        script: {
          lang: 'painless',
          source: "params.attractionIdsOnItinerary.contains(doc['id'].value) ? 1.0 : 0.0",
          params: {
            attractionIdsOnItinerary: params.attractionIdsOnItinerary,
          },
        },
      },
      ...votes,
    },
  }
}

const createSearchAttractionsOpenSearchQuery = (
  params: ScriptFieldsParams & {
    searchStringEmbedding: number[] | undefined
    attractionType?: ATTRACTION_TYPE | null
    attractionCategories?: (ATTRACTION_CATEGORY_TYPE | null)[] | null | undefined
    attractionCuisine?: (ATTRACTION_CUISINE_TYPE | null)[] | null | undefined
    boundingBox: BoundingBoxInput
  },
) => {
  const {
    searchStringEmbedding,
    attractionType,
    attractionCategories,
    attractionCuisine,
    boundingBox,
    centerCoords,
    destinationDates,
    userId,
    bucketListedAttractionIds,
    attractionIdsOnItinerary,
    attractionVotingResultsDict,
  } = params
  const mustNotConditions: any[] = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions: any[] = [
    {
      // should either be public, or be authored by the user
      bool: {
        should: [
          {
            term: {
              privacy: ATTRACTION_PRIVACY.PUBLIC,
            },
          },
          {
            term: {
              'author.id': userId,
            },
          },
        ],
        minimum_should_match: 1,
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
        attractionCategories,
      },
    })
  }

  if (attractionCuisine) {
    filterConditions.push({
      terms: {
        attractionCuisine,
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
    : [
        {
          // onItinerary
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source: "(params.attractionIdsOnItinerary.contains(doc['id'].value) ? 1.0 : 0.0)",
              params: {
                attractionIdsOnItinerary,
              },
            },
            order: 'asc',
          },
        },
        {
          // inSeason
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source:
                "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
              params: {
                destination_start_date: destinationDates[0],
                destination_end_date: destinationDates[1],
              },
            },
            order: 'desc',
          },
        },
        {
          // netVotingScore
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source:
                "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].yesVotes - params.attractionVotingResultsDict[doc['id'].value].noVotes : 0.0",
              params: {
                attractionVotingResultsDict,
              },
            },
            order: 'desc',
          },
        },
        {
          // isMyCard
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source: "doc['author.id'].size() == 0 ? 0.0 : (doc['author.id'].value == params.userId ? 1.0 : 0.0)",
              params: {
                userId,
              },
            },
            order: 'desc',
          },
        },
        {
          // inMyBucketList
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source: "(params.bucketListedAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0)",
              params: {
                bucketListedAttractionIds,
              },
            },
            order: 'desc',
          },
        },
        {
          rank: {
            order: 'asc',
            missing: '_last',
          },
        },
        {
          bucketListCount: {
            order: 'desc',
          },
        },
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
      ] // sort by onItinerary, inSeason, netVotingScore, myCards, inMyBucketList, rank, bucketListCount, distance

  return {
    _source: {
      includes: includedFields,
    },
    size: 250,
    query,
    sort,
    // if we don't have a searchString, then we can use the returned sort value instead of redundantly computing most script fields
    ...(searchStringEmbedding ? createScriptFields(params, false) : createScriptFields(params, true)),
  }
}

export default addToItineraryMapSearch
