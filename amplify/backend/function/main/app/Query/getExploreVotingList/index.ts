import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CoordsInput,
  GetExploreVotingListQueryVariables,
  GetExploreVotingListResponse,
  ATTRACTION_TYPE,
  ATTRACTION_CATEGORY_TYPE,
  ATTRACTION_CUISINE_TYPE,
  LambdaPrivateListUserAttractionsQueryVariables,
  LambdaPrivateListUserAttractionsQuery,
  LambdaListAttractionSwipesByTripByDestinationQueryVariables,
  LambdaListAttractionSwipesByTripByDestinationQuery,
  ATTRACTION_PRIVACY,
  DistanceType,
  AttractionSwipeResult,
  ExploreVotingListItem,
  ExploreVotingListSwipe,
  BADGES,
  AttractionSwipe,
  AUTHOR_TYPE,
  UserAttraction,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getOpenAIEmbedding from '../../utils/getOpenAIEmbedding'
import { createQueryObjects } from '../../utils/createQueryObjects'
import { createStatsOpenSearchQuery } from '../../utils/createStatsOpenSearchQuery'
import {
  lambdaListAttractionSwipesByTripByDestination,
  lambdaPrivateListUserAttractions,
} from 'shared-types/graphql/lambda'
import { getExploreVotingListItem } from '../../utils/getExploreVotingListItem'
import getAllPaginatedData from '../../utils/getAllPaginatedData'

const getExploreVotingList: AppSyncResolverHandler<
  GetExploreVotingListQueryVariables,
  GetExploreVotingListResponse
> = async (event) => {
  console.log('getExploreVotingList')

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('Unauthorized')
  }

  const userId = event.identity.sub
  // console.log(`userId: ${userId}`)

  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const {
    tripId,
    destinationId,
    destinationCoords,
    searchString,
    attractionType,
    attractionCategories,
    attractionCuisine,
    distanceType,
    destinationDates,
    excludeAttractionIds,
    isViewingMyRecentVotes,
    selectedAttractionId,
    pageSize,
  } = event.arguments.input

  let searchStringEmbeddingPromise: Promise<number[]> | undefined = undefined

  if (searchString) {
    searchStringEmbeddingPromise = getOpenAIEmbedding(searchString)
  }

  const userBucketListsPromise = getCurrentUsersBucketLists({ userId })

  // query to get all swipes for this tripId and destinationId
  const attractionSwipesForTripDestinationPromise = getAttractionSwipes({ tripId, destinationId })

  // wait for all three parallel queries to finish
  const [searchStringEmbedding, userBucketLists, attractionSwipesForTripDestination] = await Promise.all([
    searchStringEmbeddingPromise,
    userBucketListsPromise,
    attractionSwipesForTripDestinationPromise,
  ])

  // determine array of attractionIds w/ >=1 right swipe, determine array of attractionIds user has voted on, determine bucketListedAttractionIds, determine numRightSwipesDictionary, and destinationDates

  const bucketListedAttractionIds = userBucketLists.map((item) => item?.attractionId)

  const currentUserAttractionSwipes = attractionSwipesForTripDestination.filter(
    (item) => item && item.userId === userId,
  ) as AttractionSwipe[]

  // console.log(`currentUserAttractionSwipes: ${JSON.stringify(currentUserAttractionSwipes, null, 2)}`)

  const numRightSwipesDictionary: Record<string, number> = {}

  attractionSwipesForTripDestination.forEach((item) => {
    if (item?.swipe === AttractionSwipeResult.LIKE) {
      numRightSwipesDictionary[item.attractionId] = (numRightSwipesDictionary[item.attractionId] ?? 0) + 1
    }
  })

  // console.log(`numRightSwipesDictionary: ${JSON.stringify(numRightSwipesDictionary, null, 2)}`)

  // query opensearch
  const attractionsQuery = createSearchAttractionsOpenSearchQuery({
    searchStringEmbedding,
    attractionType,
    attractionCategories,
    attractionCuisine,
    centerCoords: destinationCoords,
    distanceType,
    bucketListedAttractionIds,
    currentUserAttractionSwipes,
    numRightSwipesDictionary,
    destinationId,
    destinationDates,
    excludeAttractionIds,
    isViewingMyRecentVotes,
  })

  const statsQuery = searchString ? createStatsOpenSearchQuery({ searchStringEmbedding }) : undefined

  const msearchQueryParts = [createQueryObjects(attractionsQuery), statsQuery ? createQueryObjects(statsQuery) : '']

  const msearchQuery = msearchQueryParts.join('')

  // @ts-ignore
  const msearchResponsePromise = ApiClient.get().openSearchMSearch('attraction', msearchQuery)

  const attractionIdToSwipesDictionary: Record<string, ExploreVotingListSwipe[]> = {}

  attractionSwipesForTripDestination.forEach((item) => {
    if (item) {
      const swipes = attractionIdToSwipesDictionary[item.attractionId] ?? []
      swipes.push({
        __typename: 'ExploreVotingListSwipe',
        result: item.swipe,
        createdAt: item.createdAt,
        authorAvatar: item.user?.avatar,
        authorId: item.userId,
      })
      attractionIdToSwipesDictionary[item.attractionId] = swipes
    }
  })

  let selectedAttractionPromise: Promise<ExploreVotingListItem> | undefined

  if (selectedAttractionId && !excludeAttractionIds?.includes(selectedAttractionId)) {
    // get this specific attraction
    selectedAttractionPromise = getExploreVotingListItem({
      attractionId: selectedAttractionId,
      destinationDates,
      inMyBucketList: bucketListedAttractionIds?.includes(selectedAttractionId) ?? false,
      swipes: attractionIdToSwipesDictionary[selectedAttractionId] ?? [],
    })
  }

  const msearchResponse = await msearchResponsePromise

  // console.log(`msearchResponse: ${JSON.stringify(msearchResponse, null, 2)}`)

  let responseIndex = 0
  // @ts-ignore
  const attractionsOpenSearchResponse = msearchResponse.responses[responseIndex++]
  // @ts-ignore
  const statsResponse = searchString ? msearchResponse.responses[responseIndex++] : null

  // console.log(`attractionsOpenSearchResponse: ${JSON.stringify(attractionsOpenSearchResponse, null, 2)}`)

  // console.log(`statsResponse: ${JSON.stringify(statsResponse, null, 2)}`)

  const numberOfAttractions = attractionsOpenSearchResponse.hits.total.value

  const Z_SCORE_THRESHOLD = 1.5

  const relevanceThreshold = statsResponse
    ? statsResponse.aggregations.score_stats.avg +
      Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
    : undefined

  const getSearchAttractionItem = (hit: any): ExploreVotingListItem => {
    const { _source, fields, sort } = hit

    const useFields = searchStringEmbedding || isViewingMyRecentVotes

    const inSeason = destinationDates?.length ? (useFields ? fields?.inSeason?.[0] : sort?.[0]) : true // if we don't have destinationDates, then we don't need to filter by season
    const inMyBucketList = useFields ? fields?.inMyBucketList?.[0] : destinationDates?.length ? sort?.[2] : sort?.[1]

    return {
      __typename: 'ExploreVotingListItem',
      attractionCategories: _source.attractionCategories,
      attractionCuisine: _source.attractionCuisine,
      cost: _source.cost,
      descriptionShort: _source.descriptionShort,
      id: _source.id,
      image: _source.images?.[0],
      inSeason,
      inMyBucketList,
      name: _source.name,
      rating: _source.locations[0].startLoc.googlePlace?.data?.rating,
      recommendationBadges: _source.recommendationBadges,
      swipes: attractionIdToSwipesDictionary[_source.id] ?? [],
      type: _source.type,
    }
  }

  // @ts-ignore
  let attractions = (attractionsOpenSearchResponse.hits.hits as any[])
    .filter((item: any) => (Boolean(item) && !relevanceThreshold) || item._score >= relevanceThreshold)
    .map(getSearchAttractionItem) as ExploreVotingListItem[]

  console.log(
    `numberOfAttractions: ${numberOfAttractions}, attractions.length: ${attractions.length}, nextPageExists: ${
      numberOfAttractions > attractions.length
    }`,
  )

  const nextPageExists = attractions.length > 0 && numberOfAttractions > attractions.length

  const selectedAttraction = selectedAttractionPromise ? await selectedAttractionPromise : null

  if (selectedAttraction) {
    // Remove selectedAttraction from attractions if it exists
    attractions = attractions.filter((attraction) => attraction.id !== selectedAttraction.id)

    // Prepend selectedAttraction to the start of attractions
    attractions.unshift(selectedAttraction)
  }

  return {
    __typename: 'GetExploreVotingListResponse',
    attractions,
    nextPageExists,
    votedOnAttractionIds: currentUserAttractionSwipes.map((item) => item?.attractionId),
  }
}

const createSearchAttractionsOpenSearchQuery = ({
  searchStringEmbedding,
  attractionType,
  attractionCategories,
  attractionCuisine,
  centerCoords,
  distanceType,
  destinationDates,
  bucketListedAttractionIds,
  currentUserAttractionSwipes,
  numRightSwipesDictionary,
  destinationId,
  excludeAttractionIds,
  isViewingMyRecentVotes,
  pageSize = 25,
}: {
  searchStringEmbedding: number[] | undefined
  attractionType?: ATTRACTION_TYPE | null
  attractionCategories?: (ATTRACTION_CATEGORY_TYPE | null)[] | null | undefined
  attractionCuisine?: (ATTRACTION_CUISINE_TYPE | null)[] | null | undefined
  centerCoords: CoordsInput
  distanceType: DistanceType
  destinationDates: (string | null)[] | null | undefined
  bucketListedAttractionIds: (string | undefined)[] | null | undefined
  currentUserAttractionSwipes: AttractionSwipe[]
  numRightSwipesDictionary: Record<string, number>
  destinationId: string
  excludeAttractionIds: Array<string | null> | null | undefined
  isViewingMyRecentVotes: boolean
  pageSize?: number
}) => {
  const hasRightSwipesAttractionIds = Object.keys(numRightSwipesDictionary)

  const mustNotConditions: any[] = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  if (excludeAttractionIds?.length) {
    // cannot be one of the excludeAttractionIds
    mustNotConditions.push({
      terms: {
        id: excludeAttractionIds,
      },
    })
  }

  const searchNearby = distanceType === DistanceType.NEARBY
  const searchFurtherAway = distanceType === DistanceType.FARTHER_AWAY

  const filterConditions: any[] = [
    {
      term: {
        privacy: ATTRACTION_PRIVACY.PUBLIC,
      },
    },
  ]

  // my recent votes shouldn't have a distance filter
  if (!isViewingMyRecentVotes) {
    if (searchNearby) {
      // startLoc or endLoc should be less than 10mi away or has right swipes
      filterConditions.push({
        bool: {
          should: [
            ...createGeoDistanceCondition(`${searchStringEmbedding ? 25 : 10}mi`, centerCoords),
            {
              terms: {
                id: hasRightSwipesAttractionIds,
              },
            },
          ],
          minimum_should_match: 1,
        },
      })
    } else if (searchFurtherAway) {
      // Exclude attractions that qualify as nearby, and enforce within 25mi
      filterConditions.push({
        bool: {
          must_not: [
            ...createGeoDistanceCondition(`${searchStringEmbedding ? 25 : 10}mi`, centerCoords),
            {
              terms: {
                id: hasRightSwipesAttractionIds,
              },
            },
          ],
          should: [...createGeoDistanceCondition(`${searchStringEmbedding ? 100 : 25}mi`, centerCoords)],
          minimum_should_match: 1,
        },
      })
    }
  }

  const votedOnAttractionIds = currentUserAttractionSwipes.map((item) => item?.attractionId)

  // console.log(`searchStringEmbedding exists: ${!!searchStringEmbedding}`)
  // console.log(`votedOnAttractionIds exists: ${!!votedOnAttractionIds?.length}`)
  // console.log(`voteOnAttractionIds: ${JSON.stringify(votedOnAttractionIds, null, 2)}`)

  if (isViewingMyRecentVotes) {
    // console.log('adding condition that attraction has been voted on for myRecentVotes')
    // add must condition that attraction has been voted on
    filterConditions.push({
      terms: {
        id: votedOnAttractionIds,
      },
    })
  } else if (!searchStringEmbedding && votedOnAttractionIds?.length) {
    // console.log('inside searchstringembedding and votedonattractionids')
    // add must not condition that attraction has not been voted on
    mustNotConditions.push({
      terms: {
        id: votedOnAttractionIds,
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

  let sort: any = []

  if (searchStringEmbedding) {
    sort = {} // sort by similarity/relevance
  } else if (isViewingMyRecentVotes) {
    // console.log('isViewingMyRecentVotes')
    // Map currentUserAttractionSwipes to a dictionary
    const attractionIdLastSwipedAt: Record<string, number> = {}
    currentUserAttractionSwipes.forEach((swipe) => {
      if (swipe && swipe.attractionId && swipe.updatedAt) {
        // Convert updatedAt to epoch milliseconds
        attractionIdLastSwipedAt[swipe.attractionId] = new Date(swipe.updatedAt).getTime()
      }
    })

    sort = [
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source:
              "params.attractionIdLastSwipedAt.containsKey(doc['id'].value) ? params.attractionIdLastSwipedAt[doc['id'].value] : 0",
            params: {
              attractionIdLastSwipedAt,
            },
          },
          order: 'desc',
        },
      },
    ]
  } else {
    // Initialize with inSeason if destinationDates are available
    if (destinationDates && destinationDates.length > 0) {
      sort.push({
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
      })
    }

    sort.push(
      {
        // number of right swipes in group
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source:
              "params.numRightSwipesDictionary.containsKey(doc['id'].value) ? params.numRightSwipesDictionary[doc['id'].value] : 0",
            params: {
              numRightSwipesDictionary,
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

      // matching destinationId
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source: "doc['destination.id'].value == params.destinationId ? 1 : 0",
            params: {
              destinationId,
            },
          },
          order: 'desc',
        },
      },
      // travas choice
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source:
              "if (doc.containsKey('recommendationBadges') && !doc['recommendationBadges'].empty) { return doc['recommendationBadges'].contains(params.travasChoiceBadge) ? 1 : 0; } else { return 0; }",
            params: {
              travasChoiceBadge: BADGES.TRAVAS_CHOICE,
            },
          },
          order: 'desc',
        },
      },
      // authorType is AUTHOR_TYPE.ADMIN > AUTHOR_TYPE.USER
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source: "doc['authorType'].value == params.isAuthorTypeAdmin ? 1 : 0",
            params: {
              isAuthorTypeAdmin: AUTHOR_TYPE.ADMIN,
            },
          },
          order: 'desc',
        },
      },
      // rank
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source: "doc['rank'].size() > 0 ? doc['rank'].value : 999",
          },
          order: 'asc',
        },
      },
      // weighted rating score
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source:
              "double score = 0; double count = 0; if (doc['locations.startLoc.googlePlace.data.rating.score'].size() > 0 && doc['locations.startLoc.googlePlace.data.rating.count'].size() > 0) { score = doc['locations.startLoc.googlePlace.data.rating.score'].value; count = doc['locations.startLoc.googlePlace.data.rating.count'].value; } double weightedScore = score + (count < 100 ? -0.15 : count < 250 ? -0.05 : count < 1000 ? 0 : count < 5000 ? 0.05 : 0.15); return weightedScore;",
          },
          order: 'desc',
        },
      },
      // number of bucket lists
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source: "doc['bucketListCount'].value",
          },
          order: 'desc',
        },
      },
      // number of ratings
      {
        _script: {
          type: 'number',
          script: {
            lang: 'painless',
            source:
              "if (doc['locations.startLoc.googlePlace.data.rating.count'].size() > 0) { return doc['locations.startLoc.googlePlace.data.rating.count'].value; } else { return 0; }",
          },
          order: 'desc',
        },
      },
    )
  }

  // console.log(`sort: ${JSON.stringify(sort, null, 2)}`)

  return {
    _source: {
      includes: [
        'name',
        'attractionCategories',
        'attractionCuisine',
        'cost',
        'descriptionShort',
        'id',
        'images',
        'name',
        'locations',
        'recommendationBadges',
        'type',
        'rank',
      ],
    },
    size: pageSize,
    query,
    sort,
    // if we have a searchString or are viewing recent votes, then our sort value won't contain fields we must return (bucket list, in season, etc.), so we must compute within the script_fields
    script_fields:
      searchStringEmbedding || isViewingMyRecentVotes
        ? {
            inMyBucketList: {
              script: {
                lang: 'painless',
                source: "params.bucketListedAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0",
                params: {
                  bucketListedAttractionIds,
                },
              },
            },
            inSeason:
              destinationDates && destinationDates.length > 0
                ? {
                    script: {
                      lang: 'painless',
                      source:
                        "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
                      params: {
                        // @ts-ignore
                        destination_start_date: destinationDates[0],
                        destination_end_date: destinationDates[1],
                      },
                    },
                  }
                : undefined,
          }
        : undefined,
  }
}

function createGeoDistanceCondition(distance: string, coordsInput: CoordsInput) {
  const coords = {
    lat: coordsInput.lat,
    lon: coordsInput.long,
  }

  return [
    {
      geo_distance: {
        distance,
        startLoc_coords: coords,
      },
    },
    {
      geo_distance: {
        distance,
        endLoc_coords: coords,
      },
    },
  ]
}

async function getCurrentUsersBucketLists({ userId }: { userId: string }) {
  const bucketLists: Pick<UserAttraction, 'userId' | 'attractionId' | 'authorId' | 'createdAt' | 'updatedAt'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      // query userAttraction by userId to get user's bucket list
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListUserAttractionsQueryVariables,
        LambdaPrivateListUserAttractionsQuery
      >({
        query: lambdaPrivateListUserAttractions,
        variables: {
          userId,
          limit: 500,
          nextToken,
        },
      })

      return {
        nextToken: res.data.privateListUserAttractions?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.privateListUserAttractions?.items.forEach((item) => {
        if (item) bucketLists.push(item)
      })
    },
  )

  return bucketLists
}

async function getAttractionSwipes({ tripId, destinationId }: { tripId: string; destinationId: string }) {
  const attractionSwipes: Pick<AttractionSwipe, 'userId' | 'attractionId' | 'swipe' | 'createdAt' | 'user'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
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
          nextToken,
        },
      })

      return {
        nextToken: res.data.listAttractionSwipesByTripByDestination?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.listAttractionSwipesByTripByDestination?.items.forEach((item) => {
        if (item) attractionSwipes.push(item)
      })
    },
  )

  return attractionSwipes
}

export default getExploreVotingList
