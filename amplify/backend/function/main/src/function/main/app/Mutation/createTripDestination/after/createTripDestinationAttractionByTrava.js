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
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const CHUNK_SIZE = 10;
const NON_VOTING_DECK_ATTRACTIONS_RANGE = '15mi';
const createTripDestinationAttractionByTrava = (event, destinationCoords, destinationId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('createTripDestinationAttractionByTrava start');
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    // if user (sub) belongs to tripId - can create (example: add destination)
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_ATTRACTION_MESSAGE);
    }
    if (!destinationId) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_ATTRACTION_MESSAGE);
    }
    const nearbyTravaAttractionsQuery = createOpenSearchQuery(destinationCoords, event.arguments.input.destinationId);
    const nearbyTravaAttractionsResponse = yield ApiClient_1.default.get()
        .useIamAuth()
        .openSearchFetch('attraction', nearbyTravaAttractionsQuery);
    // @ts-ignore
    const nearbyTravaAttractionsIds = nearbyTravaAttractionsResponse.hits.hits.map((hit) => hit._source.id);
    const promises = nearbyTravaAttractionsIds.map((attractionId) => {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateCreateTripDestinationAttraction,
            variables: {
                input: {
                    isTravaCreated: 1,
                    attractionId,
                    tripId: event.arguments.input.tripId,
                    destinationId,
                },
            },
        });
    });
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return null;
});
// import all trava created cards with authorType admin that are 1) not deleted, and 2) either within 15 mi of destination or tagged to the destination
const createOpenSearchQuery = (centerCoords, destinationId) => {
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
                isTravaCreated: 1,
            },
        },
        {
            term: {
                authorType: API_1.AUTHOR_TYPE.ADMIN,
            },
        },
        {
            bool: {
                should: [
                    {
                        geo_distance: {
                            distance: NON_VOTING_DECK_ATTRACTIONS_RANGE,
                            startLoc_coords: {
                                lat: centerCoords.lat,
                                lon: centerCoords.long,
                            },
                        },
                    },
                    {
                        geo_distance: {
                            distance: NON_VOTING_DECK_ATTRACTIONS_RANGE,
                            endLoc_coords: {
                                lat: centerCoords.lat,
                                lon: centerCoords.long,
                            },
                        },
                    },
                    {
                        term: {
                            'destination.id': destinationId,
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
    ];
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
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
                'deletedAt',
                'isTravaCreated',
                'bucketListCount',
                'locations',
                'tags',
                'type',
                'description',
                'name',
                'locations',
                'startLoc_coords',
                'endLoc_coords',
            ],
        },
        size: 500,
        query,
    };
};
exports.default = createTripDestinationAttractionByTrava;
