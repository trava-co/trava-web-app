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
Object.defineProperty(exports, "__esModule", { value: true });
const getGooglePlaceDetails_1 = require("../../utils/getGooglePlaceDetails");
const getTimezoneFromCoords_1 = require("../../utils/getTimezoneFromCoords");
const googleGetPlaceDetails = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('googleGetPlaceDetails');
    /**
     * Main query
     */
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { placeId } = event.arguments.input;
    // todo: https://travausa.atlassian.net/browse/TRV-955 deviceLanguage does not map to the google api, so we need to create a custom mapping at some point
    if (!placeId)
        throw new Error('invalid arguments');
    const placeData = yield (0, getGooglePlaceDetails_1.getGooglePlaceDetails)({ placeId });
    // TODO: migrate this to simply return the placeData object. many frontend changes will be required.
    // https://travausa.atlassian.net/browse/TRV-1326
    let response = {
        __typename: 'GoogleGetPlaceDetailsResult',
        placeName: placeData.name,
        location: Object.assign({ __typename: 'Location', city: placeData.city, state: placeData.state, country: placeData.country, continent: placeData.continent, googlePlaceId: placeId, formattedAddress: placeData.formattedAddress, googlePlacePageLink: placeData.googlePlacePageLink, websiteLink: placeData.websiteLink, phone: placeData.phone, businessStatus: placeData.businessStatus, timezone: (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(placeData.coords), 
            // add __typename to nested objects
            coords: Object.assign(Object.assign({}, placeData.coords), { __typename: 'Coords' }), googleRating: Object.assign(Object.assign({}, placeData.rating), { __typename: 'Rating' }) }, (placeData.hours && {
            hours: Object.assign(Object.assign({}, placeData.hours), { __typename: 'Hours', periods: (_b = (_a = placeData.hours) === null || _a === void 0 ? void 0 : _a.periods) === null || _b === void 0 ? void 0 : _b.map((period) => (Object.assign({ __typename: 'Period', open: Object.assign({ __typename: 'OpenCloseTime' }, period.open) }, (period.close && {
                    close: Object.assign({ __typename: 'OpenCloseTime' }, period.close),
                })))) }),
        })),
    };
    return response;
    /**
     * after hooks
     */
    // none
});
exports.default = googleGetPlaceDetails;
