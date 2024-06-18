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
const axios_1 = __importDefault(require("axios"));
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const removeSpecialCharacters = (str) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ');
const googleGetPlaces = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('googleGetPlaces');
    /**
     * Main query
     */
    const token = yield (0, getSSMVariable_1.getSSMVariable)('GOOGLE_MAPS_API_KEY');
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { input, location, radius, strictbounds, language, types } = event.arguments.input;
    // todo: https://travausa.atlassian.net/browse/TRV-955 deviceLanguage does not map to the google api, so we need to create a custom mapping at some point
    if (!input)
        throw new Error('invalid arguments');
    const res = (yield axios_1.default.get(encodeURI(`https://maps.googleapis.com/maps/api/place/autocomplete/json`), {
        params: {
            input: removeSpecialCharacters(input),
            location: location ? `${location === null || location === void 0 ? void 0 : location.latitude},${location === null || location === void 0 ? void 0 : location.longitude}` : undefined,
            radius,
            strictbounds,
            types: types ? types.join('|') : undefined,
            key: token,
        },
    })).data;
    if (!('predictions' in res))
        return [];
    const result = res.predictions.map((prediction) => {
        const location = {};
        location.mainText = prediction.structured_formatting.main_text;
        location.secondaryText = prediction.structured_formatting.secondary_text;
        location.placeId = prediction.place_id;
        location.types = prediction.types;
        return location;
    });
    /**
     * after hooks
     */
    // none
    return result;
});
exports.default = googleGetPlaces;
