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
exports.handler = void 0;
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const getAllDestinations_1 = __importDefault(require("./utils/getAllDestinations"));
const mutations_1 = require("shared-types/graphql/mutations");
const getLastUpdateParity_1 = __importDefault(require("./utils/getLastUpdateParity"));
const createUpdate_1 = __importDefault(require("./utils/createUpdate"));
const NEARBY_THRESHOLD = 15; // miles
const ATTRACTIONS_LIMIT_PER_QUERY = 1000;
// this lambda is triggered every 4 hours, and computes the number of nearby public attractions for each destination
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    ApiClient_1.default.get().useIamAuth();
    const destinations = yield getAllDestinations_1.default();
    const numDestinations = destinations.length;
    const lastUpdate = yield getLastUpdateParity_1.default();
    const lastUpdateParity = lastUpdate === null || lastUpdate === void 0 ? void 0 : lastUpdate.parityLastProcessed;
    // if lastUpdateParity is odd or falsy, then iterate through even indices
    let parityToUpdateForThisRun = lastUpdateParity === API_1.Parity.EVEN ? API_1.Parity.ODD : API_1.Parity.EVEN;
    console.log(`Processing ${parityToUpdateForThisRun}s during this run.`);
    let startIndex = 0;
    if (parityToUpdateForThisRun === API_1.Parity.ODD) {
        startIndex = 1;
    }
    let successCount = 0;
    let failureCount = 0;
    // for each destination, we need to compute the number of nearby public do/eat, and trava do/eat
    for (let i = startIndex; i < numDestinations; i += 2) {
        try {
            const destination = destinations[i];
            function getOpenSearchQueryPromise({ attractionType, createdByTravaAdminOnly, }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const query = createOpenSearchQuery({
                        attractionType,
                        createdByTravaAdminOnly,
                        centerCoords: destination.coords,
                        range: NEARBY_THRESHOLD,
                        limit: ATTRACTIONS_LIMIT_PER_QUERY,
                        destinationId: destination.id,
                    });
                    return ApiClient_1.default.get().openSearchFetch('attraction', query);
                });
            }
            const publicDoCountPromise = getOpenSearchQueryPromise({
                attractionType: API_1.ATTRACTION_TYPE.DO,
                createdByTravaAdminOnly: false,
            });
            const publicEatCountPromise = getOpenSearchQueryPromise({
                attractionType: API_1.ATTRACTION_TYPE.EAT,
                createdByTravaAdminOnly: false,
            });
            const travaDoCountPromise = getOpenSearchQueryPromise({
                attractionType: API_1.ATTRACTION_TYPE.DO,
                createdByTravaAdminOnly: true,
            });
            const travaEatCountPromise = getOpenSearchQueryPromise({
                attractionType: API_1.ATTRACTION_TYPE.EAT,
                createdByTravaAdminOnly: true,
            });
            // compute the number of nearby public experiences and nearby trava public experiences
            const [publicDoCountResult, publicEatCountResult, travaDoCountResult, travaEatCountResult] = yield Promise.all([
                publicDoCountPromise,
                publicEatCountPromise,
                travaDoCountPromise,
                travaEatCountPromise,
            ]);
            // @ts-ignore
            const publicDoCount = publicDoCountResult.hits.total.value;
            // @ts-ignore
            const publicEatCount = publicEatCountResult.hits.total.value;
            // @ts-ignore
            const travaDoCount = travaDoCountResult.hits.total.value;
            // @ts-ignore
            const travaEatCount = travaEatCountResult.hits.total.value;
            // Update the destination with the actual counts
            yield ApiClient_1.default.get().apiFetch({
                query: mutations_1.updateDestination,
                variables: {
                    input: {
                        id: destination.id,
                        nearbyThingsToDoCount: publicDoCount,
                        nearbyPlacesToEatCount: publicEatCount,
                        nearbyTravaThingsToDoCount: travaDoCount,
                        nearbyTravaPlacesToEatCount: travaEatCount,
                        featured: travaDoCount >= 25 && travaEatCount >= 10,
                    },
                },
            });
            successCount++;
        }
        catch (e) {
            console.error(e);
            failureCount++;
        }
    }
    yield createUpdate_1.default(parityToUpdateForThisRun);
    console.log(`createDestinationNearbyAttractionsTrigger finished. successCount: ${successCount}, failureCount: ${failureCount}`);
});
exports.handler = handler;
// get all public cards that are 1) not deleted and 2) within 15 miles of centerCoords
const createOpenSearchQuery = ({ attractionType, centerCoords, range, limit, createdByTravaAdminOnly, destinationId, }) => {
    const searchRadius = `${range}mi`;
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
                privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
            },
        },
    ];
    if (createdByTravaAdminOnly) {
        filterConditions.push({
            term: {
                isTravaCreated: 1,
            },
        }, {
            term: {
                authorType: API_1.AUTHOR_TYPE.ADMIN,
            },
        }, {
            term: {
                'destination.id': destinationId,
            },
        });
    }
    else {
        filterConditions.push({
            bool: {
                should: [
                    {
                        geo_distance: {
                            distance: searchRadius,
                            startLoc_coords: {
                                lat: centerCoords.lat,
                                lon: centerCoords.long,
                            },
                        },
                    },
                    {
                        geo_distance: {
                            distance: searchRadius,
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
        });
    }
    if (attractionType) {
        filterConditions.push({
            term: {
                type: attractionType,
            },
        });
    }
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
    return {
        _source: {
            includes: ['id'],
        },
        size: limit,
        query,
    };
};
