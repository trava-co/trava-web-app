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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const constants_1 = require("../../utils/constants");
const createQueryObjects = (query) => {
    if (!query) {
        return '';
    }
    const header = JSON.stringify({});
    const body = JSON.stringify(query);
    return header + '\n' + body + '\n';
};
const createOpenSearchQuery = ({ searchString, centerCoords, featured, authorId, }) => {
    const matchConditions = [];
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
        {
            term: { id: constants_1.OTHER_DESTINATION_ID },
        },
    ];
    const filterConditions = [];
    if (featured) {
        filterConditions.push({
            term: {
                featured: true,
            },
        });
    }
    else {
        filterConditions.push({
            term: {
                featured: false,
            },
        });
    }
    // Require either isTravaCreated or authorId to match
    filterConditions.push({
        bool: {
            should: [{ term: { isTravaCreated: true } }, { term: { authorId: authorId } }],
            minimum_should_match: 1,
        },
    });
    // If there is a search string, use a multi_match query. Else, only return destinations with at least 10 nearby experiences
    if (searchString) {
        matchConditions.push({
            multi_match: {
                query: searchString,
                fields: ['name', 'altName', 'state', 'country', 'continent'],
                type: 'best_fields',
                fuzziness: 'AUTO',
            },
        });
    }
    else {
        filterConditions.push({
            range: {
                nearbyExperiencesCount: {
                    gte: 10,
                },
            },
        });
    }
    const query = searchString
        ? {
            bool: {
                must: matchConditions,
                filter: filterConditions,
                must_not: mustNotConditions,
            },
        }
        : {
            bool: {
                filter: filterConditions,
                must_not: mustNotConditions,
            },
        };
    // if there's a search string, sort by relevance.
    // if no search string: if location provided, sort by distance to location. Else, sort by nearby experiences count.
    const sort = searchString
        ? {}
        : centerCoords
            ? [
                {
                    _geo_distance: {
                        coords: {
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
                    nearbyExperiencesCount: {
                        order: 'desc',
                    },
                },
            ];
    return {
        _source: {
            excludes: [
                'embedding',
                'coverImage',
                'nearbyThingsToDoCount',
                'nearbyPlacesToEatCount',
                'googlePlaceId',
                'label',
                'continent',
                'createdAt',
                'updatedAt',
            ],
        },
        size: 50,
        query,
        sort,
    };
};
const openSearchDestinations = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('openSearchDestinations');
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_SEARCH_DESTINATION_MESSAGE);
    }
    const { searchString, centerCoords } = event.arguments.input;
    const featuredDestinationsQuery = createOpenSearchQuery({
        searchString,
        centerCoords,
        featured: true,
        authorId: event.identity.sub,
    });
    const otherDestinationsQuery = createOpenSearchQuery({
        searchString,
        centerCoords,
        featured: false,
        authorId: event.identity.sub,
    });
    const msearchQueryParts = [createQueryObjects(featuredDestinationsQuery), createQueryObjects(otherDestinationsQuery)];
    const msearchQuery = msearchQueryParts.join('');
    // @ts-ignore
    const msearchResponse = yield ApiClient_1.default.get().openSearchMSearch('destination', msearchQuery);
    // @ts-ignore
    const [featuredDestinationsResponse, otherDestinationsResponse] = msearchResponse.responses || [];
    const getSearchDestinationItem = (hit) => {
        const { _source } = hit;
        return {
            __typename: 'SearchDestinationItem',
            id: _source.id,
            name: _source.name,
            icon: _source.icon,
            coords: { long: _source.coords[0], lat: _source.coords[1], __typename: 'Coords' },
            state: _source.state,
            country: _source.country,
            numberOfExperiences: _source.nearbyExperiencesCount,
        };
    };
    const featured = featuredDestinationsResponse.hits.hits.map(getSearchDestinationItem);
    const other = otherDestinationsResponse.hits.hits.map(getSearchDestinationItem);
    return {
        __typename: 'OpenSearchDestinationsResponse',
        featured,
        other, // populated with destinations with < 10 nearby experiences
    };
});
exports.default = openSearchDestinations;
