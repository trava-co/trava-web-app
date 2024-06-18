"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttractionExistsItem = void 0;
function getAttractionExistsItem({ attraction, coords }) {
    var _a;
    const locations = ((_a = attraction.locations) !== null && _a !== void 0 ? _a : [])
        .filter((location) => Boolean(location))
        .map((location) => {
        return {
            __typename: 'SearchStartEndLocation',
            id: location.id,
            startLoc: {
                __typename: 'SearchLocation',
                id: location.startLoc.id,
                googlePlaceId: location.startLoc.googlePlaceId,
                googlePlace: {
                    __typename: 'SearchGooglePlace',
                    data: {
                        __typename: 'SearchGooglePlaceData',
                        coords: Object.assign({ __typename: 'Coords' }, coords),
                    },
                },
            },
            endLoc: {
                __typename: 'SearchLocation',
                id: location.endLoc.id,
                googlePlaceId: location.endLoc.googlePlaceId,
                googlePlace: {
                    __typename: 'SearchGooglePlace',
                    data: {
                        __typename: 'SearchGooglePlaceData',
                        coords: Object.assign({ __typename: 'Coords' }, coords),
                    },
                },
            },
        };
    });
    return {
        __typename: 'AttractionExistsItem',
        id: attraction.id,
        name: attraction.name,
        locations,
        duration: attraction.duration,
        type: attraction.type,
        attractionCategories: attraction.attractionCategories,
        attractionCuisine: attraction.attractionCuisine,
        bucketListCount: attraction.bucketListCount,
        isTravaCreated: attraction.isTravaCreated,
        deletedAt: attraction.deletedAt,
    };
}
exports.getAttractionExistsItem = getAttractionExistsItem;
