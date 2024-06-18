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
const mapBoxGetPlaces = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('mapBoxGetPlaces');
    /**
     * Main query
     */
    const token = yield (0, getSSMVariable_1.getSSMVariable)('MAPBOX_TOKEN');
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    const { location, language, bounds, types, limit } = event.arguments.input;
    if (!location || !types)
        throw new Error('invalid arguments');
    const res = (yield axios_1.default.get(encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${removeSpecialCharacters(location)}.json`), {
        params: {
            access_token: token,
            types,
            limit: limit !== null && limit !== void 0 ? limit : 5,
            language,
            autocomplete: 'true',
            bbox: bounds === null || bounds === void 0 ? void 0 : bounds.join(','),
        },
    })).data;
    if (!('features' in res))
        return [];
    const result = res.features.map((feature) => {
        var _a, _b, _c, _d;
        const location = {};
        location.street = feature.properties.address;
        location.city = (_a = feature.context.find((ctx) => ctx.id.indexOf('place') > -1)) === null || _a === void 0 ? void 0 : _a.text;
        location.state = (_b = feature.context.find((ctx) => ctx.id.indexOf('region') > -1 || ctx.id.indexOf('locality') > -1)) === null || _b === void 0 ? void 0 : _b.text;
        location.postCode = (_c = feature.context.find((ctx) => ctx.id.indexOf('postcode') > -1)) === null || _c === void 0 ? void 0 : _c.text;
        location.coords = {
            __typename: 'Coords',
            lat: feature.geometry.coordinates[1],
            long: feature.geometry.coordinates[0],
        };
        location.country = (_d = feature.context.find((ctx) => ctx.id.indexOf('country') > -1)) === null || _d === void 0 ? void 0 : _d.text;
        return {
            location,
            placeName: feature.text,
        };
    });
    /**
     * after hooks
     */
    // none
    return result;
});
exports.default = mapBoxGetPlaces;
