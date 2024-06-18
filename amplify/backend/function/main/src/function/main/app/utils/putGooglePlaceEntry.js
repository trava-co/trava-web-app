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
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const retryWithExponentialBackoff_1 = require("./retryWithExponentialBackoff");
const getGooglePlaceDetails_1 = require("./getGooglePlaceDetails");
const now = new Date().toISOString();
const putGooglePlaceEntry = ({ googlePlaceId, GOOGLE_MAPS_KEY, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // it's possible that the GooglePlace already exists from a previous attraction creation, so if we can get it, we'll return it
    let getPlaceResult;
    try {
        getPlaceResult = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaGetGooglePlace,
            variables: { id: googlePlaceId },
        });
    }
    catch (error) {
        throw new Error(`Encountered error when querying GooglePlace table for google place id ${googlePlaceId}. Error: ${error}`);
    }
    if ((_a = getPlaceResult.data) === null || _a === void 0 ? void 0 : _a.getGooglePlace) {
        console.log(`google place already exists for googlePlaceId: ${googlePlaceId}`);
        return getPlaceResult.data.getGooglePlace;
    }
    console.log(`google place does NOT exist for googlePlaceId: ${googlePlaceId}`);
    // else, query google for the place details
    let googlePlaceData;
    try {
        googlePlaceData = yield (0, retryWithExponentialBackoff_1.retryWithExponentialBackoff)({
            func: () => (0, getGooglePlaceDetails_1.getGooglePlaceDetails)({ placeId: googlePlaceId, GOOGLE_MAPS_KEY }),
        });
    }
    catch (error) {
        throw new Error(`Error getting google place details from google places api. ${error}`);
    }
    const input = {
        id: googlePlaceId,
        data: googlePlaceData,
        isValid: 1,
        consecutiveFailedRequests: 0,
        dataLastCheckedAt: now,
        dataLastUpdatedAt: now,
    };
    let createPlaceResult;
    try {
        createPlaceResult = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateCreateGooglePlace,
            variables: { input },
        });
    }
    catch (error) {
        throw new Error(`Error creating google place for googlePlaceId: ${googlePlaceId}. ${error}`);
    }
    // if axios successfully communicates with graphql api, but graphql api returns an error, it will be in the errors field
    // TODO unified error handler
    const result = (_b = createPlaceResult.data) === null || _b === void 0 ? void 0 : _b.privateCreateGooglePlace;
    if (((_c = createPlaceResult.errors) === null || _c === void 0 ? void 0 : _c.length) || !result) {
        // TODO handle error message parsing:
        throw new Error(`Error creating google place for googlePlaceId: ${googlePlaceId} ${createPlaceResult.errors.map((error) => error.message)}`);
    }
    return result;
});
exports.default = putGooglePlaceEntry;
