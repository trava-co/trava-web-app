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
const lambda_1 = require("shared-types/graphql/lambda");
const createQueryObjects_1 = require("../../utils/createQueryObjects");
const createStatsOpenSearchQuery_1 = require("../../utils/createStatsOpenSearchQuery");
const getItinerarySearchAttraction_1 = require("../../utils/getItinerarySearchAttraction");
const addToItinerarySearch = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    console.log('addToItinerarySearch');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('not authorized');
    }
    const userId = event.identity.sub;
    const { tripId, destinationId, searchString, attractionType, attractionCategories, attractionCuisine, insideBoundingBox, outsideBoundingBox, centerCoords, destinationDates, selectedAttractionId, attractionVotingResults, excludeAttractionIds, } = event.arguments.input;
    let searchStringEmbeddingPromise;
    if (searchString) {
        searchStringEmbeddingPromise = (0, getOpenAIEmbedding_1.default)(searchString);
    }
    // get user, deck attractions, and trip plan
    const lambdaGetUserAndDeckAttractionsAndTripPlanResponsePromise = ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetUserAndDeckAttractionsAndTripPlan,
        variables: {
            userId,
            tripId,
            destinationId,
            type: attractionType,
        },
    });
    // create attractionVotingResultsDict for efficient lookup of voting record
    const attractionVotingResultsDict = attractionVotingResults === null || attractionVotingResults === void 0 ? void 0 : attractionVotingResults.reduce((dict, result) => {
        dict[result.attractionId] = result.votingResults;
        return dict;
    }, {});
    // await resolution of searchStringEmbeddingPromise and lambdaGetUserAndDeckAttractionsResponse
    const [searchStringEmbedding, lambdaGetUserAndDeckAttractionsResponse] = yield Promise.all([
        searchStringEmbeddingPromise,
        lambdaGetUserAndDeckAttractionsAndTripPlanResponsePromise,
    ]);
    const user = (_a = lambdaGetUserAndDeckAttractionsResponse === null || lambdaGetUserAndDeckAttractionsResponse === void 0 ? void 0 : lambdaGetUserAndDeckAttractionsResponse.data) === null || _a === void 0 ? void 0 : _a.getUser;
    const userTrip = (_d = (_c = (_b = user === null || user === void 0 ? void 0 : user.userTrips) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.trip;
    const tripDestination = (_f = (_e = userTrip === null || userTrip === void 0 ? void 0 : userTrip.tripDestinations) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f[0];
    const tripPlan = tripDestination === null || tripDestination === void 0 ? void 0 : tripDestination.tripPlan;
    const bucketListedAttractionIds = (_l = (_k = (_j = (_h = (_g = user === null || user === void 0 ? void 0 : user.bucketList) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h.filter) === null || _j === void 0 ? void 0 : _j.call(_h, (el) => { var _a; return !((_a = el === null || el === void 0 ? void 0 : el.attraction) === null || _a === void 0 ? void 0 : _a.deletedAt); })) === null || _k === void 0 ? void 0 : _k.map((el) => el === null || el === void 0 ? void 0 : el.attractionId)) !== null && _l !== void 0 ? _l : [];
    const attractionIdsOnItinerary = (tripPlan || []).flatMap((tripPlanDays) => tripPlanDays === null || tripPlanDays === void 0 ? void 0 : tripPlanDays.tripPlanDayItems.map((tripPlanDayItem) => tripPlanDayItem === null || tripPlanDayItem === void 0 ? void 0 : tripPlanDayItem.attractionId));
    let selectedAttractionPromise;
    if (selectedAttractionId && !(excludeAttractionIds === null || excludeAttractionIds === void 0 ? void 0 : excludeAttractionIds.includes(selectedAttractionId))) {
        // get this specific attraction
        selectedAttractionPromise = (0, getItinerarySearchAttraction_1.getItinerarySearchAttraction)({
            attractionId: selectedAttractionId,
            centerCoords,
            destinationDates,
            inMyBucketList: bucketListedAttractionIds.includes(selectedAttractionId),
            onItinerary: attractionIdsOnItinerary.includes(selectedAttractionId),
            votingResults: attractionVotingResultsDict === null || attractionVotingResultsDict === void 0 ? void 0 : attractionVotingResultsDict[selectedAttractionId],
        });
    }
    const attractionsOpenSearchQuery = createSearchAttractionsOpenSearchQuery({
        searchStringEmbedding,
        attractionType,
        attractionCategories,
        attractionCuisine,
        centerCoords,
        insideBoundingBox,
        outsideBoundingBox,
        destinationDates,
        userId,
        bucketListedAttractionIds,
        attractionIdsOnItinerary,
        attractionVotingResultsDict,
        excludeAttractionIds,
    });
    const statsQuery = searchString ? (0, createStatsOpenSearchQuery_1.createStatsOpenSearchQuery)({ searchStringEmbedding }) : undefined;
    const msearchQueryParts = [
        (0, createQueryObjects_1.createQueryObjects)(attractionsOpenSearchQuery),
        statsQuery ? (0, createQueryObjects_1.createQueryObjects)(statsQuery) : '',
    ];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponse = yield ApiClient_1.default.get().openSearchMSearch('attraction', msearchQuery);
    let responseIndex = 0;
    // @ts-ignore
    const attractionsOpenSearchResponse = msearchResponse.responses[responseIndex++];
    // @ts-ignore
    const statsResponse = searchString ? msearchResponse.responses[responseIndex++] : null;
    const numberOfAttractions = attractionsOpenSearchResponse.hits.total.value;
    console.log(`numberOfAttractions: ${numberOfAttractions}`);
    // when we have many results, we should be more lenient with the relevance threshold, as dumb results will be buried deeper in the list
    const Z_SCORE_THRESHOLD_NEARBY = numberOfAttractions < 50 ? 1.25 : 1;
    const relevanceThreshold = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD_NEARBY * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const getSearchItem = (hit) => {
        var _a, _b, _c, _d;
        const { _source, fields, sort } = hit;
        const useFields = searchStringEmbedding;
        // sort conditions
        // if useFields, then we're relying on the script field, otherwise we're relying on the sort value
        const onItinerary = useFields ? fields === null || fields === void 0 ? void 0 : fields.onItinerary[0] : sort === null || sort === void 0 ? void 0 : sort[0];
        const inSeason = useFields ? fields === null || fields === void 0 ? void 0 : fields.inSeason[0] : sort === null || sort === void 0 ? void 0 : sort[1];
        const inMyBucketList = useFields ? fields === null || fields === void 0 ? void 0 : fields.inMyBucketList[0] : sort === null || sort === void 0 ? void 0 : sort[4];
        const distance = useFields ? fields === null || fields === void 0 ? void 0 : fields.min_distance[0] : sort === null || sort === void 0 ? void 0 : sort[(sort === null || sort === void 0 ? void 0 : sort.length) - 1];
        const yesVotes = (_a = fields === null || fields === void 0 ? void 0 : fields.yesVotes[0]) !== null && _a !== void 0 ? _a : 0;
        const noVotes = (_b = fields === null || fields === void 0 ? void 0 : fields.noVotes[0]) !== null && _b !== void 0 ? _b : 0;
        return {
            __typename: 'ItinerarySearchAttractionItem',
            id: _source.id,
            name: _source.name,
            locations: _source.locations,
            isTravaCreated: _source.isTravaCreated,
            images: _source.images,
            attractionCategories: _source.attractionCategories,
            attractionCuisine: _source.attractionCuisine,
            author: (_d = (((_c = _source.author) === null || _c === void 0 ? void 0 : _c.id) && {
                __typename: 'SearchAttractionAuthorItem',
                id: _source.author.id,
                username: _source.author.username,
            })) !== null && _d !== void 0 ? _d : null,
            bucketListCount: _source.bucketListCount,
            duration: _source.duration,
            type: _source.type,
            recommendationBadges: _source.recommendationBadges,
            distance,
            inSeason,
            inMyBucketList,
            onItinerary,
            yesVotes,
            noVotes,
        };
    };
    // @ts-ignore
    let attractions = attractionsOpenSearchResponse.hits.hits
        .filter((item) => !relevanceThreshold || item._score >= relevanceThreshold)
        .map(getSearchItem);
    console.log(`numberOfAttractions: ${numberOfAttractions}`);
    console.log(`attractions.length: ${attractions.length}`);
    console.log(`nextPageExists: ${numberOfAttractions > attractions.length}`);
    const nextPageExists = attractions.length > 0 && numberOfAttractions > attractions.length;
    const selectedAttraction = selectedAttractionPromise ? yield selectedAttractionPromise : null;
    if (selectedAttraction) {
        // Remove selectedAttraction from attractions if it exists
        attractions = attractions.filter((attraction) => attraction.id !== selectedAttraction.id);
        // Prepend selectedAttraction to the start of attractions
        attractions.unshift(selectedAttraction);
    }
    return {
        __typename: 'AddToItinerarySearchResponse',
        attractions,
        nextPageExists,
    };
});
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
];
const createScriptFields = (params, justVotes) => {
    const votes = {
        yesVotes: {
            script: {
                lang: 'painless',
                source: "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].yesVotes : 0.0",
                params: {
                    attractionVotingResultsDict: params.attractionVotingResultsDict,
                },
            },
        },
        noVotes: {
            script: {
                lang: 'painless',
                source: "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].noVotes : 0.0",
                params: {
                    attractionVotingResultsDict: params.attractionVotingResultsDict,
                },
            },
        },
    };
    if (justVotes) {
        return {
            script_fields: votes,
        };
    }
    return {
        script_fields: Object.assign({ min_distance: {
                script: {
                    lang: 'painless',
                    source: "double haversineDistance(double lat1, double lon1, double lat2, double lon2) { double R = 6371e3; double phi1 = Math.toRadians(lat1); double phi2 = Math.toRadians(lat2); double deltaPhi = Math.toRadians(lat2 - lat1); double deltaLambda = Math.toRadians(lon2 - lon1); double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2); double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; } double minDistance = Double.MAX_VALUE; for (def loc : doc['startLoc_coords']) { double curDistance = haversineDistance(params.lat, params.lon, loc.lat, loc.lon); minDistance = Math.min(minDistance, curDistance); } return minDistance / 1609.34;",
                    params: {
                        lat: params.centerCoords.lat,
                        lon: params.centerCoords.long,
                    },
                },
            }, inSeason: {
                script: {
                    lang: 'painless',
                    source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
                    params: {
                        destination_start_date: params.destinationDates[0],
                        destination_end_date: params.destinationDates[1],
                    },
                },
            }, isMyCard: {
                script: {
                    lang: 'painless',
                    source: "doc['author.id'].size() == 0 ? 0.0 : (doc['author.id'].value == params.userId ? 1.0 : 0.0)",
                    params: {
                        userId: params.userId,
                    },
                },
            }, inMyBucketList: {
                script: {
                    lang: 'painless',
                    source: "params.bucketListedAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0",
                    params: {
                        bucketListedAttractionIds: params.bucketListedAttractionIds,
                    },
                },
            }, onItinerary: {
                script: {
                    lang: 'painless',
                    source: "params.attractionIdsOnItinerary.contains(doc['id'].value) ? 1.0 : 0.0",
                    params: {
                        attractionIdsOnItinerary: params.attractionIdsOnItinerary,
                    },
                },
            } }, votes),
    };
};
const createSearchAttractionsOpenSearchQuery = (params) => {
    const { searchStringEmbedding, attractionType, attractionCategories, attractionCuisine, insideBoundingBox, outsideBoundingBox, centerCoords, destinationDates, userId, bucketListedAttractionIds, attractionIdsOnItinerary, attractionVotingResultsDict, excludeAttractionIds, pageSize = 25, } = params;
    const mustNotConditions = [
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
    ];
    const filterConditions = [
        {
            // should either be public, or be authored by the user
            bool: {
                should: [
                    {
                        term: {
                            privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
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
    ];
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
    });
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
                        source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
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
                        source: "params.attractionVotingResultsDict != null && params.attractionVotingResultsDict.containsKey(doc['id'].value) ? params.attractionVotingResultsDict[doc['id'].value].yesVotes - params.attractionVotingResultsDict[doc['id'].value].noVotes : 0.0",
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
        ]; // sort by onItinerary, inSeason, netVotingScore, myCards, inMyBucketList, rank, bucketListCount, distance
    return Object.assign({ _source: {
            includes: includedFields,
        }, size: pageSize, query,
        sort }, (searchStringEmbedding ? createScriptFields(params, false) : createScriptFields(params, true)));
};
exports.default = addToItinerarySearch;
