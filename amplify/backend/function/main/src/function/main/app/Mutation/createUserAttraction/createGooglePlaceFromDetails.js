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
const mutations_1 = require("shared-types/graphql/mutations");
const queries_1 = require("shared-types/graphql/queries");
const now = new Date().toISOString();
/** Creates a GooglePlace from provided details, without querying the Google API */
const createGooglePlaceFromDetails = (googlePlaceInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { location } = googlePlaceInfo;
    const { googlePlaceId, coords, city, state, country, continent, name, formattedAddress, googlePlacePageLink, websiteLink, phone, hours, businessStatus, googleRating, } = location;
    const input = {
        id: googlePlaceId,
        data: {
            coords,
            city,
            state,
            country,
            continent,
            name,
            formattedAddress,
            googlePlacePageLink,
            websiteLink,
            phone,
            hours,
            businessStatus,
            rating: googleRating,
        },
        isValid: 1,
        dataLastCheckedAt: now,
        dataLastUpdatedAt: now,
    };
    const cleanedInput = Object.fromEntries(Object.entries(input).filter(([key, value]) => value !== null && value !== undefined));
    let result;
    try {
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: mutations_1.privateCreateGooglePlace,
            variables: { input: cleanedInput },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            const errorMessage = `Error creating google place entry in GooglePlace table for googlePlaceId: ${googlePlaceId}. ${res.errors.map((error) => error.message)}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        result = res.data.privateCreateGooglePlace;
    }
    catch (err) {
        console.log('Checking if GooglePlace already exists in GooglePlace table');
        // it's possible that the GooglePlace already exists from a previous attraction creation, so if we can get it, we'll return it
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: queries_1.getGooglePlace,
            variables: { id: googlePlaceId },
        });
        // TODO unified error handler
        if ((_b = res.errors) === null || _b === void 0 ? void 0 : _b.length) {
            // TODO handle error message parsing:
            const errorMessage = `Error getting google place from GooglePlace table for googlePlaceId: ${googlePlaceId}. ${res.errors.map((error) => error.message)}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        console.log('GooglePlace already exists in GooglePlace table');
        result = res.data.getGooglePlace;
    }
    return result;
});
exports.default = createGooglePlaceFromDetails;
