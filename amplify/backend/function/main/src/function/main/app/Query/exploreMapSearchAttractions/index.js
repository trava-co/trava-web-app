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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const getOpenAIEmbedding_1 = __importDefault(require("../../utils/getOpenAIEmbedding"));
const createQueryObjects_1 = require("../../utils/createQueryObjects");
const createStatsOpenSearchQuery_1 = require("../../utils/createStatsOpenSearchQuery");
const getExploreSearchAttraction_1 = require("../../utils/getExploreSearchAttraction");
const exploreMapSearchAttractions = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('exploreMapSearchAttractions');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { searchString, attractionType, attractionCategories, attractionCuisine, boundingBox, centerCoords, selectedAttractionId, sortByDistance, } = event.arguments.input;
    if (selectedAttractionId) {
        // get this specific attraction
        const attraction = yield (0, getExploreSearchAttraction_1.getExploreSearchAttraction)({
            attractionId: selectedAttractionId,
            centerCoords,
        });
        return {
            __typename: 'ExploreMapSearchAttractionsResponse',
            attractions: [attraction],
        };
    }
    let searchStringEmbedding;
    if (searchString) {
        searchStringEmbedding = yield (0, getOpenAIEmbedding_1.default)(searchString);
    }
    let openSearchQuery;
    if (selectedAttractionId) {
        // get this specific attraction
        openSearchQuery = createGetAttractionOpenSearchQuery({
            attractionId: selectedAttractionId,
            centerCoords,
        });
    }
    else {
        openSearchQuery = createOpenSearchQuery({
            searchStringEmbedding,
            attractionType,
            attractionCategories,
            attractionCuisine,
            centerCoords,
            boundingBox,
            sortByDistance,
        });
    }
    const statsQuery = searchString ? (0, createStatsOpenSearchQuery_1.createStatsOpenSearchQuery)({ searchStringEmbedding }) : undefined;
    const msearchQueryParts = [(0, createQueryObjects_1.createQueryObjects)(openSearchQuery), statsQuery ? (0, createQueryObjects_1.createQueryObjects)(statsQuery) : ''];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponse = yield ApiClient_1.default.get().openSearchMSearch('attraction', msearchQuery);
    // @ts-ignore
    const [openSearchQueryResponse, statsResponse] = msearchResponse.responses || [];
    const numberOfNearbyAttractions = openSearchQueryResponse.hits.total.value;
    // when we have many results, we should be more lenient with the relevance threshold, as dumb results will be buried deeper in the list
    const Z_SCORE_THRESHOLD = numberOfNearbyAttractions < 50 ? 1.25 : 1;
    const relevanceThreshold = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const getSearchAttractionItem = (hit) => {
        var _a, _b;
        const { _source, fields, sort } = hit;
        const useFields = selectedAttractionId || searchStringEmbedding || !sortByDistance;
        // sort conditions
        // if useFields, then we're relying on the script field, otherwise we're relying on the sort value
        const distance = useFields ? fields === null || fields === void 0 ? void 0 : fields.min_distance[0] : sort === null || sort === void 0 ? void 0 : sort[0]; // if we have a searchString, then we're relying on the script field, otherwise we're relying on the sort value
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
            author: (_b = (((_a = _source.author) === null || _a === void 0 ? void 0 : _a.id) && {
                __typename: 'SearchAttractionAuthorItem',
                id: _source.author.id,
                username: _source.author.username,
            })) !== null && _b !== void 0 ? _b : null,
            bucketListCount: _source.bucketListCount,
            duration: _source.duration,
            type: _source.type,
        };
    };
    // @ts-ignore
    const attractions = openSearchQueryResponse.hits.hits
        .filter((item, index) => !!selectedAttractionId || !relevanceThreshold || item._score >= relevanceThreshold)
        .map(getSearchAttractionItem);
    return {
        __typename: 'ExploreMapSearchAttractionsResponse',
        attractions,
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
];
const createGetAttractionOpenSearchQuery = ({ attractionId, centerCoords, }) => {
    const query = {
        bool: {
            filter: {
                term: {
                    id: attractionId,
                },
            },
        },
    };
    return {
        _source: {
            includes: includedFields,
        },
        query,
        script_fields: {
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
        },
    };
};
const createOpenSearchQuery = ({ searchStringEmbedding, attractionType, attractionCategories, attractionCuisine, boundingBox, centerCoords, sortByDistance, }) => {
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
    ];
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
                attractionCategories: attractionCategories,
            },
        });
    }
    if (attractionCuisine) {
        filterConditions.push({
            terms: {
                attractionCuisine: attractionCuisine,
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
            ];
    return {
        _source: {
            includes: includedFields,
        },
        size: 50,
        query,
        sort,
        // if we don't have a searchString, then we're sorting by distance, so we can use the returned sort value instead of redundantly computing this script field
        script_fields: searchStringEmbedding || !sortByDistance
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
            }
            : undefined,
    };
};
exports.default = exploreMapSearchAttractions;
