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
const exploreSearchAttractions = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('exploreSearchAttractions');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { searchString, attractionType, attractionCategories, attractionCuisine, insideBoundingBox, outsideBoundingBox, centerCoords, sortByDistance, excludeAttractionIds, selectedAttractionId, } = event.arguments.input;
    let selectedAttractionPromise;
    if (selectedAttractionId && !(excludeAttractionIds === null || excludeAttractionIds === void 0 ? void 0 : excludeAttractionIds.includes(selectedAttractionId))) {
        // get this specific attraction
        selectedAttractionPromise = (0, getExploreSearchAttraction_1.getExploreSearchAttraction)({
            attractionId: selectedAttractionId,
            centerCoords,
        });
    }
    let searchStringEmbedding;
    if (searchString) {
        searchStringEmbedding = yield (0, getOpenAIEmbedding_1.default)(searchString);
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
    const getSearchAttractionItem = (hit) => {
        var _a, _b;
        const { _source, fields, sort } = hit;
        return {
            __typename: 'ExploreSearchAttractionItem',
            id: _source.id,
            name: _source.name,
            locations: _source.locations,
            distance: centerCoords
                ? searchStringEmbedding || !sortByDistance
                    ? fields === null || fields === void 0 ? void 0 : fields.min_distance[0]
                    : sort === null || sort === void 0 ? void 0 : sort[0]
                : undefined,
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
            type: _source.type,
            recommendationBadges: _source.recommendationBadges,
        };
    };
    // @ts-ignore
    let attractions = attractionsOpenSearchResponse.hits.hits
        .filter((item) => !relevanceThreshold || item._score >= relevanceThreshold)
        .map(getSearchAttractionItem);
    console.log(`numberOfAttractions: ${numberOfAttractions}`);
    console.log(`attractions.length: ${attractions.length}`);
    console.log(`nextPageExists: ${numberOfAttractions > attractions.length}`);
    const nextPageExists = attractions.length > 0 && numberOfAttractions > attractions.length;
    const selectedAttraction = selectedAttractionPromise ? yield selectedAttractionPromise : null;
    if (selectedAttraction) {
        // we must ensure that the selected attraction is the first item in the list. OpenSearch may not have indexed it yet, so we use a db query to get it
        // Remove selectedAttraction from attractions if it exists
        attractions = attractions.filter((attraction) => attraction.id !== selectedAttraction.id);
        // Prepend selectedAttraction to the start of attractions
        attractions.unshift(selectedAttraction);
    }
    return {
        __typename: 'ExploreSearchAttractionsResponse',
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
const createOpenSearchQuery = ({ searchStringEmbedding, attractionType, attractionCategories, attractionCuisine, centerCoords, sortByDistance, insideBoundingBox, outsideBoundingBox, // if not provided, then further away query is not constrained to a max distance
excludeAttractionIds, pageSize = 25, }) => {
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
    ];
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
        });
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
            ];
    return {
        _source: {
            includes: includedFields,
        },
        size: pageSize,
        query,
        sort,
        // use the sort value instead of redundantly computing this script field if possible
        script_fields: (searchStringEmbedding || !sortByDistance) && centerCoords
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
exports.default = exploreSearchAttractions;
