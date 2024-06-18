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
const getAttractionsToTagToPost = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('User is not authorized');
    }
    ApiClient_1.default.get().useIamAuth();
    const { searchString, radius, destinationCoords } = event.arguments.input;
    let searchStringEmbedding;
    if (searchString) {
        searchStringEmbedding = yield (0, getOpenAIEmbedding_1.default)(searchString);
    }
    const openSearchQuery = createOpenSearchQuery({
        searchStringEmbedding,
        radius,
        destinationCoords,
        authorId: event.identity.sub,
    });
    const statsQuery = searchString ? (0, createStatsOpenSearchQuery_1.createStatsOpenSearchQuery)({ searchStringEmbedding }) : undefined;
    const msearchQueryParts = [(0, createQueryObjects_1.createQueryObjects)(openSearchQuery), statsQuery ? (0, createQueryObjects_1.createQueryObjects)(statsQuery) : ''];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponse = yield ApiClient_1.default.get().openSearchMSearch('attraction', msearchQuery);
    // @ts-ignore
    const [openSearchQueryResponse, statsResponse] = msearchResponse.responses || [];
    const Z_SCORE_THRESHOLD = 1.25;
    const relevanceThreshold = statsResponse
        ? statsResponse.aggregations.score_stats.avg +
            Z_SCORE_THRESHOLD * statsResponse.aggregations.score_stats.std_deviation
        : undefined;
    const getTagToPostItem = (hit) => {
        const { _source: source } = hit;
        const attraction = {
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
        };
        return attraction;
    };
    const attractions = openSearchQueryResponse.hits.hits
        .filter((item) => !relevanceThreshold || item._score >= relevanceThreshold)
        .map(getTagToPostItem);
    return {
        __typename: 'GetAttractionsToTagToPostResponse',
        attractions,
    };
});
const createOpenSearchQuery = ({ searchStringEmbedding, radius, destinationCoords, authorId, }) => {
    const searchRadius = `${radius}mi`;
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    const filterConditions = [
        {
            // either should be public or should be created by me
            bool: {
                should: [
                    {
                        term: {
                            privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
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
    ];
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
        });
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
            ];
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
    };
};
exports.default = getAttractionsToTagToPost;
