"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const getOpenAIEmbedding_1 = __importDefault(require("../../utils/getOpenAIEmbedding"));
const createQueryObjects_1 = require("../../utils/createQueryObjects");
const createStatsOpenSearchQuery_1 = require("../../utils/createStatsOpenSearchQuery");
const lambda_1 = require("shared-types/graphql/lambda");
const getExploreVotingListItem_1 = require("../../utils/getExploreVotingListItem");
const getExploreVotingList = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log('getExploreVotingList');
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('Unauthorized');
    }
    const userId = event.identity.sub;
    // console.log(`userId: ${userId}`)
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { tripId, destinationId, destinationCoords, searchString, attractionType, attractionCategories, attractionCuisine, distanceType, destinationDates, excludeAttractionIds, isViewingMyRecentVotes, selectedAttractionId, pageSize, } = event.arguments.input;
    let searchStringEmbeddingPromise = undefined;
    if (searchString) {
        searchStringEmbeddingPromise = (0, getOpenAIEmbedding_1.default)(searchString);
    }
    // query userAttraction by userId to get user's bucket list
    const userBucketListsPromise = ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateListUserAttractions,
        variables: {
            userId,
        },
    });
    // query listAttractionSwipesByTripByDestination to get all attractionIds that the user has voted on
    const listAttractionSwipesByTripByDestinationPromise = ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaListAttractionSwipesByTripByDestination,
        variables: {
            tripId,
            destinationId: {
                eq: destinationId,
            },
            limit: 500,
        },
    });
    // wait for all three parallel queries to finish
    const [searchStringEmbedding, userBucketLists, attractionSwipesByTripByDestination] = yield Promise.all([
        searchStringEmbeddingPromise,
        userBucketListsPromise,
        listAttractionSwipesByTripByDestinationPromise,
    ]);
    // determine array of attractionIds w/ >=1 right swipe, determine array of attractionIds user has voted on, determine bucketListedAttractionIds, determine numRightSwipesDictionary, and destinationDates
    const bucketListedAttractionIds = (_a = userBucketLists.data.privateListUserAttractions) === null || _a === void 0 ? void 0 : _a.items.map((item) => item === null || item === void 0 ? void 0 : item.attractionId);
    const currentUserAttractionSwipes = ((_c = (_b = attractionSwipesByTripByDestination.data.listAttractionSwipesByTripByDestination) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : []).filter((item) => item && item.userId === userId);
    // console.log(`currentUserAttractionSwipes: ${JSON.stringify(currentUserAttractionSwipes, null, 2)}`)
    const numRightSwipesDictionary = {};
    (_d = attractionSwipesByTripByDestination.data.listAttractionSwipesByTripByDestination) === null || _d === void 0 ? void 0 : _d.items.forEach((item) => {
        var _a;
        if ((item === null || item === void 0 ? void 0 : item.swipe) === API_1.AttractionSwipeResult.LIKE) {
            numRightSwipesDictionary[item.attractionId] = ((_a = numRightSwipesDictionary[item.attractionId]) !== null && _a !== void 0 ? _a : 0) + 1;
        }
    });
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
    });
    const statsQuery = searchString ? (0, createStatsOpenSearchQuery_1.createStatsOpenSearchQuery)({ searchStringEmbedding }) : undefined;
    const msearchQueryParts = [(0, createQueryObjects_1.createQueryObjects)(attractionsQuery), statsQuery ? (0, createQueryObjects_1.createQueryObjects)(statsQuery) : ''];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponsePromise = ApiClient_1.default.get().openSearchMSearch('attraction', msearchQuery);
    const attractionIdToSwipesDictionary = {};
    (_e = attractionSwipesByTripByDestination.data.listAttractionSwipesByTripByDestination) === null || _e === void 0 ? void 0 : _e.items.forEach((item) => {
        var _a, _b;
        if (item) {
            const swipes = (_a = attractionIdToSwipesDictionary[item.attractionId]) !== null && _a !== void 0 ? _a : [];
            swipes.push({
                __typename: 'ExploreVotingListSwipe',
                result: item.swipe,
                createdAt: item.createdAt,
                authorAvatar: (_b = item.user) === null || _b === void 0 ? void 0 : _b.avatar,
                authorId: item.userId,
            });
            attractionIdToSwipesDictionary[item.attractionId] = swipes;
        }
    });
    let selectedAttractionPromise;
    if (selectedAttractionId && !(excludeAttractionIds === null || excludeAttractionIds === void 0 ? void 0 : excludeAttractionIds.includes(selectedAttractionId))) {
        // get this specific attraction
        selectedAttractionPromise = (0, getExploreVotingListItem_1.getExploreVotingListItem)({
            attractionId: selectedAttractionId,
            destinationDates,
            inMyBucketList: (_f = bucketListedAttractionIds === null || bucketListedAttractionIds === void 0 ? void 0 : bucketListedAttractionIds.includes(selectedAttractionId)) !== null && _f !== void 0 ? _f : false,
            swipes: (_g = attractionIdToSwipesDictionary[selectedAttractionId]) !== null && _g !== void 0 ? _g : [],
        });
    }
    const msearchResponse = yield msearchResponsePromise;
    // console.log(`msearchResponse: ${JSON.stringify(msearchResponse, null, 2)}`)
    let responseIndex = 0;
    // @ts-ignore
    const attractionsOpenSearchResponse = msearchResponse.responses[responseIndex++];
    // @ts-ignore
    const statsResponse = searchString ? msearchResponse.responses[responseIndex++] : null;
    // console.log(`attractionsOpenSearchResponse: ${JSON.stringify(attractionsOpenSearchResponse, null, 2)}`)
    // console.log(`statsResponse: ${JSON.stringify(statsResponse, null, 2)}`)
    const numberOfAttractions = attractionsOpenSearchResponse.hits.total.value;
    const Z_SCORE_THRESHOLD = 1.5;
    const relevanceThreshold = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const getSearchAttractionItem = (hit) => {
        var _a, _b, _c, _d, _e, _f;
        const { _source, fields, sort } = hit;
        const useFields = searchStringEmbedding || isViewingMyRecentVotes;
        const inSeason = (destinationDates === null || destinationDates === void 0 ? void 0 : destinationDates.length) ? (useFields ? (_a = fields === null || fields === void 0 ? void 0 : fields.inSeason) === null || _a === void 0 ? void 0 : _a[0] : sort === null || sort === void 0 ? void 0 : sort[0]) : true; // if we don't have destinationDates, then we don't need to filter by season
        const inMyBucketList = useFields ? (_b = fields === null || fields === void 0 ? void 0 : fields.inMyBucketList) === null || _b === void 0 ? void 0 : _b[0] : (destinationDates === null || destinationDates === void 0 ? void 0 : destinationDates.length) ? sort === null || sort === void 0 ? void 0 : sort[2] : sort === null || sort === void 0 ? void 0 : sort[1];
        return {
            __typename: 'ExploreVotingListItem',
            attractionCategories: _source.attractionCategories,
            attractionCuisine: _source.attractionCuisine,
            cost: _source.cost,
            descriptionShort: _source.descriptionShort,
            id: _source.id,
            image: (_c = _source.images) === null || _c === void 0 ? void 0 : _c[0],
            inSeason,
            inMyBucketList,
            name: _source.name,
            rating: (_e = (_d = _source.locations[0].startLoc.googlePlace) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.rating,
            recommendationBadges: _source.recommendationBadges,
            swipes: (_f = attractionIdToSwipesDictionary[_source.id]) !== null && _f !== void 0 ? _f : [],
            type: _source.type,
        };
    };
    // @ts-ignore
    let attractions = attractionsOpenSearchResponse.hits.hits
        .filter((item) => (Boolean(item) && !relevanceThreshold) || item._score >= relevanceThreshold)
        .map(getSearchAttractionItem);
    console.log(`numberOfAttractions: ${numberOfAttractions}, attractions.length: ${attractions.length}, nextPageExists: ${numberOfAttractions > attractions.length}`);
    const nextPageExists = attractions.length > 0 && numberOfAttractions > attractions.length;
    const selectedAttraction = selectedAttractionPromise ? yield selectedAttractionPromise : null;
    if (selectedAttraction) {
        // Remove selectedAttraction from attractions if it exists
        attractions = attractions.filter((attraction) => attraction.id !== selectedAttraction.id);
        // Prepend selectedAttraction to the start of attractions
        attractions.unshift(selectedAttraction);
    }
    return {
        __typename: 'GetExploreVotingListResponse',
        attractions,
        nextPageExists,
        votedOnAttractionIds: currentUserAttractionSwipes.map((item) => item === null || item === void 0 ? void 0 : item.attractionId),
    };
});
const createSearchAttractionsOpenSearchQuery = ({ searchStringEmbedding, attractionType, attractionCategories, attractionCuisine, centerCoords, distanceType, destinationDates, bucketListedAttractionIds, currentUserAttractionSwipes, numRightSwipesDictionary, destinationId, excludeAttractionIds, isViewingMyRecentVotes, pageSize = 25, }) => {
    const hasRightSwipesAttractionIds = Object.keys(numRightSwipesDictionary);
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    if (excludeAttractionIds === null || excludeAttractionIds === void 0 ? void 0 : excludeAttractionIds.length) {
        // cannot be one of the excludeAttractionIds
        mustNotConditions.push({
            terms: {
                id: excludeAttractionIds,
            },
        });
    }
    const searchNearby = distanceType === API_1.DistanceType.NEARBY;
    const searchFurtherAway = distanceType === API_1.DistanceType.FARTHER_AWAY;
    const filterConditions = [
        {
            term: {
                privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
            },
        },
    ];
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
            });
        }
        else if (searchFurtherAway) {
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
            });
        }
    }
    const votedOnAttractionIds = currentUserAttractionSwipes.map((item) => item === null || item === void 0 ? void 0 : item.attractionId);
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
        });
    }
    else if (!searchStringEmbedding && (votedOnAttractionIds === null || votedOnAttractionIds === void 0 ? void 0 : votedOnAttractionIds.length)) {
        // console.log('inside searchstringembedding and votedonattractionids')
        // add must not condition that attraction has not been voted on
        mustNotConditions.push({
            terms: {
                id: votedOnAttractionIds,
            },
        });
    }
    if (attractionType) {
        filterConditions.push({
            term: {
                type: attractionType,
            },
        });
    }
    if (attractionCategories) {
        filterConditions.push({
            terms: {
                attractionCategories,
            },
        });
    }
    if (attractionCuisine) {
        filterConditions.push({
            terms: {
                attractionCuisine,
            },
        });
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
        };
    let sort = [];
    if (searchStringEmbedding) {
        sort = {}; // sort by similarity/relevance
    }
    else if (isViewingMyRecentVotes) {
        // console.log('isViewingMyRecentVotes')
        // Map currentUserAttractionSwipes to a dictionary
        const attractionIdLastSwipedAt = {};
        currentUserAttractionSwipes.forEach((swipe) => {
            if (swipe && swipe.attractionId && swipe.updatedAt) {
                // Convert updatedAt to epoch milliseconds
                attractionIdLastSwipedAt[swipe.attractionId] = new Date(swipe.updatedAt).getTime();
            }
        });
        sort = [
            {
                _script: {
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: "params.attractionIdLastSwipedAt.containsKey(doc['id'].value) ? params.attractionIdLastSwipedAt[doc['id'].value] : 0",
                        params: {
                            attractionIdLastSwipedAt,
                        },
                    },
                    order: 'desc',
                },
            },
        ];
    }
    else {
        // Initialize with inSeason if destinationDates are available
        if (destinationDates && destinationDates.length > 0) {
            sort.push({
                // inSeason
                _script: {
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
                        params: {
                            destination_start_date: destinationDates[0],
                            destination_end_date: destinationDates[1],
                        },
                    },
                    order: 'desc',
                },
            });
        }
        sort.push({
            // number of right swipes in group
            _script: {
                type: 'number',
                script: {
                    lang: 'painless',
                    source: "params.numRightSwipesDictionary.containsKey(doc['id'].value) ? params.numRightSwipesDictionary[doc['id'].value] : 0",
                    params: {
                        numRightSwipesDictionary,
                    },
                },
                order: 'desc',
            },
        }, {
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
                    source: "if (doc.containsKey('recommendationBadges') && !doc['recommendationBadges'].empty) { return doc['recommendationBadges'].contains(params.travasChoiceBadge) ? 1 : 0; } else { return 0; }",
                    params: {
                        travasChoiceBadge: API_1.BADGES.TRAVAS_CHOICE,
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
                        isAuthorTypeAdmin: API_1.AUTHOR_TYPE.ADMIN,
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
                    source: "double score = 0; double count = 0; if (doc['locations.startLoc.googlePlace.data.rating.score'].size() > 0 && doc['locations.startLoc.googlePlace.data.rating.count'].size() > 0) { score = doc['locations.startLoc.googlePlace.data.rating.score'].value; count = doc['locations.startLoc.googlePlace.data.rating.count'].value; } double weightedScore = score + (count < 100 ? -0.15 : count < 250 ? -0.05 : count < 1000 ? 0 : count < 5000 ? 0.05 : 0.15); return weightedScore;",
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
                    source: "if (doc['locations.startLoc.googlePlace.data.rating.count'].size() > 0) { return doc['locations.startLoc.googlePlace.data.rating.count'].value; } else { return 0; }",
                },
                order: 'desc',
            },
        });
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
        script_fields: searchStringEmbedding || isViewingMyRecentVotes
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
                inSeason: destinationDates && destinationDates.length > 0
                    ? {
                        script: {
                            lang: 'painless',
                            source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
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
    };
};
function createGeoDistanceCondition(distance, coordsInput) {
    const coords = {
        lat: coordsInput.lat,
        lon: coordsInput.long,
    };
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
    ];
}
exports.default = getExploreVotingList;
