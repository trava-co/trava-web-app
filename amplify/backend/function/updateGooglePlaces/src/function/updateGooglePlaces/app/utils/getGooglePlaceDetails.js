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
exports.getGooglePlaceDetails = void 0;
const country_to_continent_map_1 = require("./country-to-continent-map");
const getSSMVariable_1 = require("./getSSMVariable");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const google = new google_maps_services_js_1.Client({});
function getGooglePlaceDetails({ placeId, GOOGLE_MAPS_KEY, }) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let key = GOOGLE_MAPS_KEY;
        if (!key) {
            key = yield getSSMVariable_1.getSSMVariable('GOOGLE_MAPS_API_KEY');
        }
        const { data } = yield google.placeDetails({
            params: {
                place_id: placeId,
                key,
            },
        });
        if (!((_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.address_components) || !((_b = data === null || data === void 0 ? void 0 : data.result) === null || _b === void 0 ? void 0 : _b.geometry))
            throw new Error(`address components or coordinates not found for googlePlaceId: ${placeId}`);
        function findLongName(type) {
            var _a, _b;
            return (_b = (_a = data.result.address_components) === null || _a === void 0 ? void 0 : _a.find((addressField) => addressField.types.includes(type))) === null || _b === void 0 ? void 0 : _b.long_name;
        }
        const locationTypes = [
            'locality',
            'postal_town',
            'administrative_area_level_3',
            'sublocality',
            'neighborhood',
            'natural_feature',
            'administrative_area_level_2', // e.g., San Diego County
        ];
        const city = locationTypes.map(findLongName).find((name) => name) || '';
        const state = ((_c = data.result.address_components.find((addressField) => addressField.types.includes('administrative_area_level_1'))) === null || _c === void 0 ? void 0 : _c.long_name) || '';
        const countryData = data.result.address_components.find((addressField) => addressField.types.includes('country'));
        const country = (countryData === null || countryData === void 0 ? void 0 : countryData.long_name) || '';
        const continent = (countryData === null || countryData === void 0 ? void 0 : countryData.short_name) ? country_to_continent_map_1.countryToContinentMap[countryData === null || countryData === void 0 ? void 0 : countryData.short_name] || '' : '';
        // following is used to classify type & bestVisited for auto-create-card
        // it exists, but the type hasn't been updated to reflect it
        const serviceKeys = [
            'serves_breakfast',
            'serves_brunch',
            'serves_lunch',
            'serves_dinner',
            'dine_in',
            'takeout',
            'delivery',
            'servesBeer',
            'servesWine',
            'servesVegetarianFood',
        ];
        let hasService = false;
        const mealServices = {};
        for (const key of serviceKeys) {
            if (data.result[key]) {
                hasService = true;
                // Convert the key to camelCase
                const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                mealServices[camelCaseKey] = data.result[key];
            }
        }
        const { opening_hours, rating, user_ratings_total, photos, 
        // @ts-ignore
        reservable, price_level, reviews, editorial_summary, } = data.result;
        const parsedReviews = reviews === null || reviews === void 0 ? void 0 : reviews.map((review) => ({
            authorName: review.author_name,
            authorUrl: review.author_url,
            language: review.language,
            // @ts-ignore
            originalLanguage: review.original_language,
            profilePhotoUrl: review.profile_photo_url,
            rating: review.rating,
            relativeTimeDescription: review.relative_time_description,
            text: review.text,
            time: String(review.time),
            // @ts-ignore
            translated: review.translated,
        }));
        let placeData = {
            name: data.result.name || '',
            coords: {
                lat: data.result.geometry.location.lat,
                long: data.result.geometry.location.lng,
            },
            city,
            state,
            country,
            continent,
            formattedAddress: data.result.formatted_address,
            googlePlacePageLink: data.result.url,
            websiteLink: data.result.website,
            phone: data.result.international_phone_number,
            businessStatus: data.result.business_status,
            mealServices: hasService ? mealServices : undefined,
            hours: opening_hours
                ? {
                    weekdayText: opening_hours.weekday_text,
                    periods: opening_hours.periods,
                }
                : undefined,
            rating: rating
                ? {
                    score: rating,
                    count: user_ratings_total,
                }
                : undefined,
            photos: photos || undefined,
            reservable: reservable || undefined,
            price: price_level || undefined,
            reviews: parsedReviews || undefined,
            editorialSummary: (editorial_summary === null || editorial_summary === void 0 ? void 0 : editorial_summary.overview) || undefined,
            types: data.result.types,
        };
        // filter out undefined values from root level
        placeData = Object.fromEntries(Object.entries(placeData).filter(([_, v]) => v != null && v !== undefined));
        return placeData;
    });
}
exports.getGooglePlaceDetails = getGooglePlaceDetails;
