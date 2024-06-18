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
const createSearchAttractionsOpenSearchQuery = ({ searchStringEmbedding, attractionType, attractionCategories, attractionCuisine, nearbyBoundingBox, furtherAwayBoundingBox, centerCoords, searchNearCenterCoords, destinationDates, userId, bucketListedAttractionIds, deckAttractionIds, }) => {
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    const filterConditions = [
        {
            term: {
                type: attractionType,
            },
        },
        {
            // should either be public, or be authored by the user, or be in the deck
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
                    {
                        terms: {
                            id: deckAttractionIds,
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
    ];
    if (searchNearCenterCoords) {
        // searching near centerCoords
        filterConditions.push({
            geo_bounding_box: {
                startLoc_coords: {
                    top_left: {
                        lat: nearbyBoundingBox.topLeftCoords.lat,
                        lon: nearbyBoundingBox.topLeftCoords.long,
                    },
                    bottom_right: {
                        lat: nearbyBoundingBox.bottomRightCoords.lat,
                        lon: nearbyBoundingBox.bottomRightCoords.long,
                    },
                },
            },
        });
    }
    else if (furtherAwayBoundingBox) {
        // searching further away from centerCoords
        // must not be in nearbyBoundingBox, but must be in furtherAwayBoundingBox
        mustNotConditions.push({
            geo_bounding_box: {
                startLoc_coords: {
                    top_left: {
                        lat: nearbyBoundingBox.topLeftCoords.lat,
                        lon: nearbyBoundingBox.topLeftCoords.long,
                    },
                    bottom_right: {
                        lat: nearbyBoundingBox.bottomRightCoords.lat,
                        lon: nearbyBoundingBox.bottomRightCoords.long,
                    },
                },
            },
        });
        filterConditions.push({
            geo_bounding_box: {
                startLoc_coords: {
                    top_left: {
                        lat: furtherAwayBoundingBox.topLeftCoords.lat,
                        lon: furtherAwayBoundingBox.topLeftCoords.long,
                    },
                    bottom_right: {
                        lat: furtherAwayBoundingBox.bottomRightCoords.lat,
                        lon: furtherAwayBoundingBox.bottomRightCoords.long,
                    },
                },
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
                // inVotingDeck
                _script: {
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: "(params.deckAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0)",
                        params: {
                            deckAttractionIds,
                        },
                    },
                    order: 'asc',
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
        ]; // sort by inSeason, myCards, rank, bucketListCount, distance
    if (!searchStringEmbedding && destinationDates && destinationDates.length > 0) {
        // insert it after inVotingDeck
        // @ts-ignore - this is an array, so we can use splice
        sort.splice(1, 0, {
            // inSeason
            _script: {
                type: 'number',
                script: {
                    lang: 'painless',
                    source: "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
                    params: {
                        // @ts-ignore
                        destination_start_date: destinationDates[0],
                        destination_end_date: destinationDates[1],
                    },
                },
                order: 'desc',
            },
        });
    }
    return {
        _source: {
            excludes: [
                'embedding',
                'seasons',
                'cost',
                'privacy',
                'destinationId',
                'createdAt',
                'bestVisited',
                'costNote',
                'costType',
                'reservation',
                'rank',
                'attractionTargetGroups',
                'costCurrency',
                'updatedAt',
            ],
        },
        size: 250,
        query,
        sort,
        // if we don't have a searchString, then we can use the returned sort value instead of redundantly computing this script field
        script_fields: searchStringEmbedding
            ? {
                min_distance: {
                    script: {
                        lang: 'painless',
                        source: "double haversineDistance(double lat1, double lon1, double lat2, double lon2) { double R = 6371e3; double phi1 = Math.toRadians(lat1); double phi2 = Math.toRadians(lat2); double deltaPhi = Math.toRadians(lat2 - lat1); double deltaLambda = Math.toRadians(lon2 - lon1); double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2); double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; } double minDistance = Double.MAX_VALUE; for (def loc : doc['startLoc_coords']) { double curDistance = haversineDistance(params.lat, params.lon, loc.lat, loc.lon); minDistance = Math.min(minDistance, curDistance); } return minDistance / 1609.34;",
                        params: {
                            lat: centerCoords.lat,
                            lon: centerCoords.long,
                        },
                    },
                },
                isMyCard: {
                    script: {
                        lang: 'painless',
                        source: "doc['author.id'].size() == 0 ? 0.0 : (doc['author.id'].value == params.userId ? 1.0 : 0.0)",
                        params: {
                            userId,
                        },
                    },
                },
                inMyBucketList: {
                    script: {
                        lang: 'painless',
                        source: "params.bucketListedAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0",
                        params: {
                            bucketListedAttractionIds,
                        },
                    },
                },
                inVotingDeck: {
                    script: {
                        lang: 'painless',
                        source: "params.deckAttractionIds.contains(doc['id'].value) ? 1.0 : 0.0",
                        params: {
                            deckAttractionIds,
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
const addToVotingDeckSearch = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    console.log('addToVotingDeckSearch');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('not authorized');
    }
    const userId = event.identity.sub;
    const { tripId, destinationId, searchString, attractionType, attractionCategories, attractionCuisine, nearbyBoundingBox, furtherAwayBoundingBox, centerCoords, destinationDates, } = event.arguments.input;
    let searchStringEmbeddingPromise;
    if (searchString) {
        searchStringEmbeddingPromise = (0, getOpenAIEmbedding_1.default)(searchString);
    }
    // get user and deck attractions
    const lambdaGetUserAndDeckAttractionsResponsePromise = ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetUserAndDeckAttractions,
        variables: {
            userId,
            tripId,
            destinationId,
            type: attractionType,
        },
    });
    // await resolution of searchStringEmbeddingPromise and lambdaGetUserAndDeckAttractionsResponse
    const [searchStringEmbedding, lambdaGetUserAndDeckAttractionsResponse] = yield Promise.all([
        searchStringEmbeddingPromise,
        lambdaGetUserAndDeckAttractionsResponsePromise,
    ]);
    const bucketListedAttractionIds = (_g = (_f = (_e = (_d = (_c = (_b = (_a = lambdaGetUserAndDeckAttractionsResponse === null || lambdaGetUserAndDeckAttractionsResponse === void 0 ? void 0 : lambdaGetUserAndDeckAttractionsResponse.data) === null || _a === void 0 ? void 0 : _a.getUser) === null || _b === void 0 ? void 0 : _b.bucketList) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.filter) === null || _e === void 0 ? void 0 : _e.call(_d, (el) => { var _a; return !((_a = el === null || el === void 0 ? void 0 : el.attraction) === null || _a === void 0 ? void 0 : _a.deletedAt); })) === null || _f === void 0 ? void 0 : _f.map((el) => el === null || el === void 0 ? void 0 : el.attractionId)) !== null && _g !== void 0 ? _g : [];
    const deckAttractionIds = (_u = (_t = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = lambdaGetUserAndDeckAttractionsResponse === null || lambdaGetUserAndDeckAttractionsResponse === void 0 ? void 0 : lambdaGetUserAndDeckAttractionsResponse.data) === null || _h === void 0 ? void 0 : _h.getUser) === null || _j === void 0 ? void 0 : _j.userTrips) === null || _k === void 0 ? void 0 : _k.items) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.trip) === null || _o === void 0 ? void 0 : _o.tripDestinations) === null || _p === void 0 ? void 0 : _p.items) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.tripDestinationAttractions) === null || _s === void 0 ? void 0 : _s.items) === null || _t === void 0 ? void 0 : _t.map((el) => el === null || el === void 0 ? void 0 : el.attractionId)) !== null && _u !== void 0 ? _u : [];
    // searching for attractions
    const nearbyOpenSearchQuery = createSearchAttractionsOpenSearchQuery({
        searchStringEmbedding,
        attractionType,
        attractionCategories,
        attractionCuisine,
        centerCoords,
        nearbyBoundingBox,
        destinationDates,
        userId,
        bucketListedAttractionIds,
        deckAttractionIds,
        searchNearCenterCoords: true,
    });
    const furtherAwayOpenSearchQuery = createSearchAttractionsOpenSearchQuery({
        searchStringEmbedding,
        attractionType,
        attractionCategories,
        attractionCuisine,
        centerCoords,
        nearbyBoundingBox,
        furtherAwayBoundingBox,
        destinationDates,
        userId,
        bucketListedAttractionIds,
        deckAttractionIds,
        searchNearCenterCoords: false,
    });
    const statsQuery = searchString ? (0, createStatsOpenSearchQuery_1.createStatsOpenSearchQuery)({ searchStringEmbedding }) : undefined;
    const msearchQueryParts = [
        (0, createQueryObjects_1.createQueryObjects)(nearbyOpenSearchQuery),
        (0, createQueryObjects_1.createQueryObjects)(furtherAwayOpenSearchQuery),
        statsQuery ? (0, createQueryObjects_1.createQueryObjects)(statsQuery) : '',
    ];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponse = yield ApiClient_1.default.get().openSearchMSearch('attraction', msearchQuery);
    let responseIndex = 0;
    // @ts-ignore
    const nearbyOpenSearchResponse = msearchResponse.responses[responseIndex++];
    // @ts-ignore
    const furtherAwayOpenSearchResponse = centerCoords ? msearchResponse.responses[responseIndex++] : null;
    // @ts-ignore
    const statsResponse = searchString ? msearchResponse.responses[responseIndex++] : null;
    const numberOfNearbyAttractions = nearbyOpenSearchResponse.hits.total.value;
    // when we have many results, we should be more lenient with the relevance threshold, as dumb results will be buried deeper in the list
    const Z_SCORE_THRESHOLD_NEARBY = numberOfNearbyAttractions < 50 ? 1.25 : 1;
    const Z_SCORE_THRESHOLD_FURTHER_AWAY = 1.5;
    const relevanceThresholdNearby = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD_NEARBY * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const relevanceThresholdFurtherAway = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD_FURTHER_AWAY * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const getAddToVotingDeckSearchItem = (hit) => {
        var _a, _b;
        const { _source, fields, sort } = hit;
        const useFields = searchStringEmbedding;
        // sort conditions
        // if we have a searchString, then we're relying on the script field, otherwise we're relying on the sort value
        const inVotingDeck = useFields ? fields === null || fields === void 0 ? void 0 : fields.inVotingDeck[0] : sort === null || sort === void 0 ? void 0 : sort[0];
        const inSeason = destinationDates ? (useFields ? fields === null || fields === void 0 ? void 0 : fields.inSeason[0] : sort === null || sort === void 0 ? void 0 : sort[1]) : true; // if we don't have destinationDates, then we don't need to filter by season
        const inMyBucketList = useFields ? fields === null || fields === void 0 ? void 0 : fields.inMyBucketList[0] : destinationDates ? sort === null || sort === void 0 ? void 0 : sort[3] : sort === null || sort === void 0 ? void 0 : sort[2];
        const distance = useFields ? fields === null || fields === void 0 ? void 0 : fields.min_distance[0] : sort === null || sort === void 0 ? void 0 : sort[(sort === null || sort === void 0 ? void 0 : sort.length) - 1];
        return {
            __typename: 'VotingDeckSearchAttractionItem',
            id: _source.id,
            name: _source.name,
            locations: _source.locations,
            isTravaCreated: _source.isTravaCreated,
            images: _source.images,
            attractionCategories: _source.attractionCategories,
            attractionCuisine: _source.attractionCuisine,
            author: (_b = (((_a = _source.author) === null || _a === void 0 ? void 0 : _a.id) && {
                __typename: 'SearchAttractionAuthorItem',
                id: _source.author.id,
                username: _source.author.username,
            })) !== null && _b !== void 0 ? _b : null,
            bucketListCount: _source.bucketListCount,
            duration: _source.duration,
            type: _source.type,
            distance,
            inSeason,
            inMyBucketList,
            inVotingDeck,
            recommendationBadges: _source.recommendationBadges,
        };
    };
    // @ts-ignore
    const nearby = nearbyOpenSearchResponse.hits.hits
        .filter((item, index) => !relevanceThresholdNearby || item._score >= relevanceThresholdNearby)
        .map(getAddToVotingDeckSearchItem);
    // @ts-ignore
    const furtherAway = furtherAwayOpenSearchResponse.hits.hits
        .filter((item, index) => !relevanceThresholdFurtherAway || item._score >= relevanceThresholdFurtherAway)
        .map(getAddToVotingDeckSearchItem);
    return {
        __typename: 'AddToVotingDeckSearchResponse',
        nearby,
        furtherAway,
    };
});
exports.default = addToVotingDeckSearch;
