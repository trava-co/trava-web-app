"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAttractionLocationsToSearchLocations = void 0;
function transformAttractionLocationsToSearchLocations(locations) {
    return (locations !== null && locations !== void 0 ? locations : [])
        .filter((location) => Boolean(location))
        .map((location) => {
        return {
            __typename: 'SearchStartEndLocation',
            id: location.id,
            startLoc: transformLocation(location.startLoc),
            endLoc: transformLocation(location.endLoc),
        };
    });
}
exports.transformAttractionLocationsToSearchLocations = transformAttractionLocationsToSearchLocations;
function transformLocation(location) {
    return {
        __typename: 'SearchLocation',
        id: location.id,
        googlePlaceId: location.googlePlaceId,
        googlePlace: {
            __typename: 'SearchGooglePlace',
            data: {
                __typename: 'SearchGooglePlaceData',
                coords: location.googlePlace.data.coords,
                name: location.googlePlace.data.name,
                city: location.googlePlace.data.city,
                formattedAddress: location.googlePlace.data.formattedAddress,
                businessStatus: location.googlePlace.data.businessStatus,
                rating: location.googlePlace.data.rating,
                hours: location.googlePlace.data.hours,
            },
        },
    };
}
