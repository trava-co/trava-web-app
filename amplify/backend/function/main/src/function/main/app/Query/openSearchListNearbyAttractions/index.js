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
const get_seasons_objects_from_strings_1 = require("./utils/get-seasons-objects-from-strings");
const openSearchListNearbyAttractions = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('openSearchListNearbyAttractions start');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { centerCoords, radius } = event.arguments.input;
    const nearbyPublicAttractionsQuery = createOpenSearchQuery(centerCoords, radius);
    const nearbyTravaAttractionsOpenSearchResponse = yield ApiClient_1.default.get().openSearchFetch('attraction', nearbyPublicAttractionsQuery);
    const nearbyTravaAttractions = [];
    // @ts-ignore
    nearbyTravaAttractionsOpenSearchResponse.hits.hits.forEach((hit) => {
        const { _source } = hit;
        const attraction = Object.assign({ __typename: 'OpenSearchListAttractionItem', id: _source.id, name: _source.name, type: _source.type, bestVisited: _source.bestVisited, duration: _source.duration, attractionCategories: _source.attractionCategories, attractionCuisine: _source.attractionCuisine, locations: _source.locations, isTravaCreated: _source.isTravaCreated, authorType: _source.authorType, deletedAt: _source.deletedAt }, (_source.seasons && {
            seasons: (0, get_seasons_objects_from_strings_1.getSeasonsObjectsFromStrings)(_source.seasons),
        }));
        nearbyTravaAttractions.push(attraction);
    });
    return {
        __typename: 'OpenSearchListNearbyAttractionsResponse',
        attractions: nearbyTravaAttractions,
    };
});
// get all public cards that are 1) not deleted and 2) within 15 miles of centerCoords
const createOpenSearchQuery = (centerCoords, range) => {
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
        {
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
                'cost',
                'privacy',
                'destinationId',
                'createdAt',
                'costNote',
                'costType',
                'reservation',
                'rank',
                'attractionTargetGroups',
                'costCurrency',
                'updatedAt',
                'bucketListCount',
                'tags',
                'description',
                'startLoc_coords',
                'endLoc_coords',
            ],
        },
        size: 500,
        query,
    };
};
exports.default = openSearchListNearbyAttractions;
