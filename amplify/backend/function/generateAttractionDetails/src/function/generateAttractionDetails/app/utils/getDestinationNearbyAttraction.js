"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinationNearbyAttraction = void 0;
const ApiClient_1 = __importDefault(require("./ApiClient"));
const mutations_1 = require("shared-types/graphql/mutations");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const constants_1 = require("./constants");
const getSSMVariable_1 = require("./getSSMVariable");
const google = new google_maps_services_js_1.Client({});
const locationRestrictionInMeters = 50 * 1609.34; // 50 miles
const removeSpecialCharacters = (str) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ');
async function _privateCreateDestination(createDestinationMutationVariables) {
    const input = { ...createDestinationMutationVariables.input, label: 'Destination' };
    const res = await ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: mutations_1.privateCreateDestination,
        variables: { input },
    });
    // TODO unified error handler
    if (res.errors?.length) {
        // TODO handle error message parsing:
        throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
    }
    return res.data.privateCreateDestination;
}
const getDestinationNearbyAttraction = async ({ city, state, country, continent, attractionCoords, }) => {
    // 1. Query opensearch index for destinations within 50 miles of attraction coords
    console.log("first, let's try to find an existing destination within 50 miles of the attraction coords");
    const travaDestinationNearestAttractionQuery = createOpenSearchQuery({ coords: attractionCoords });
    const travaDestinationNearestAttractionResponse = await ApiClient_1.default.get().openSearchFetch('destination', travaDestinationNearestAttractionQuery);
    // @ts-ignore
    if (travaDestinationNearestAttractionResponse.hits.hits.length) {
        // @ts-ignore
        console.log(`destination found: ${travaDestinationNearestAttractionResponse.hits.hits[0]._source.id}`);
        // @ts-ignore
        return travaDestinationNearestAttractionResponse.hits.hits[0]._source.id;
    }
    console.log(`no destination found within 50 miles of attraction coords, so let's create one`);
    // 2. If no results, query google for the destination and create it
    const searchName = `${city}, ${state}, ${country}`;
    // get google maps key from ssm
    const googleMapsKey = await (0, getSSMVariable_1.getSSMVariable)('GOOGLE_MAPS_API_KEY');
    // get google place info
    const googleResponse = await google.findPlaceFromText({
        params: {
            input: removeSpecialCharacters(searchName),
            fields: ['place_id', 'name', 'geometry'],
            key: googleMapsKey,
            inputtype: google_maps_services_js_1.PlaceInputType.textQuery,
            ...(attractionCoords && {
                locationbias: `circle:${locationRestrictionInMeters}@${attractionCoords.lat},${attractionCoords.long}`,
            }),
        },
    });
    const googleResponseData = googleResponse.data;
    const firstCandidate = googleResponseData?.candidates?.[0];
    console.log(`firstCandidate: ${JSON.stringify(firstCandidate, null, 2)}`);
    if (!firstCandidate || !firstCandidate.place_id || !firstCandidate.geometry?.location) {
        return constants_1.OTHER_DESTINATION_ID;
    }
    // create new destination
    const newDestination = await _privateCreateDestination({
        input: {
            name: firstCandidate.name,
            coords: {
                long: firstCandidate.geometry.location.lng,
                lat: firstCandidate.geometry.location.lat,
            },
            isTravaCreated: 1,
            googlePlaceId: firstCandidate.place_id,
            state,
            country,
            continent,
            featured: false, // featured destination is set by computeNearbyAttractionsForDestinations script
        },
    });
    if (!newDestination) {
        console.error('Error creating destination');
        return constants_1.OTHER_DESTINATION_ID;
    }
    return newDestination.id;
};
exports.getDestinationNearbyAttraction = getDestinationNearbyAttraction;
const createOpenSearchQuery = ({ coords }) => {
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
    const filterConditions = [
        {
            term: {
                isTravaCreated: true,
            },
        },
        {
            geo_distance: {
                distance: '50mi',
                coords: {
                    lat: coords.lat,
                    lon: coords.long,
                },
            },
        },
    ];
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
    // sort by distance to location
    const sort = [
        {
            _geo_distance: {
                coords: {
                    lat: coords.lat,
                    lon: coords.long,
                },
                order: 'asc',
                unit: 'mi',
                distance_type: 'arc',
                mode: 'min',
            },
        },
    ];
    return {
        _source: {
            includes: ['id', 'name'],
        },
        size: 1,
        query,
        sort,
    };
};
