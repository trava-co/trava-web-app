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
const API_1 = require("shared-types/API");
const checkAttractionAccessUpdate_1 = __importDefault(require("./before/checkAttractionAccessUpdate"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getTimezoneFromCoords_1 = require("../../utils/getTimezoneFromCoords");
const putGooglePlaceEntry_1 = __importDefault(require("../../utils/putGooglePlaceEntry"));
const updateAttraction_1 = require("../../utils/updateAttraction");
const startGetAttractionPhotos_1 = require("../../utils/startGetAttractionPhotos");
const startGenerateAttractionDetails_1 = require("../../utils/startGenerateAttractionDetails");
const beforeHooks = [checkAttractionAccessUpdate_1.default];
const adminUpdateAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    var _a, _b, _c, _d, _e, _f, _g, _h;
    for (const hook of beforeHooks) {
        yield hook(event);
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE);
    }
    const { locations } = event.arguments.input;
    const filteredLocations = locations === null || locations === void 0 ? void 0 : locations.filter(Boolean);
    if (!(filteredLocations === null || filteredLocations === void 0 ? void 0 : filteredLocations.length)) {
        throw new Error('No location provided');
    }
    // create a dictionary composed of googlePlaceIds and coords
    let placeDictionary = {};
    // create GooglePlaces for each googlePlaceId
    for (const location of filteredLocations) {
        if ((_a = location === null || location === void 0 ? void 0 : location.startLoc) === null || _a === void 0 ? void 0 : _a.googlePlaceId) {
            let coords = placeDictionary[location.startLoc.googlePlaceId];
            if (!coords) {
                const googlePlace = yield (0, putGooglePlaceEntry_1.default)({
                    googlePlaceId: location.startLoc.googlePlaceId,
                });
                coords = googlePlace.data.coords;
                placeDictionary[location.startLoc.googlePlaceId] = coords;
            }
            location.startLoc.timezone = (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(coords);
        }
        if ((_b = location === null || location === void 0 ? void 0 : location.endLoc) === null || _b === void 0 ? void 0 : _b.googlePlaceId) {
            let coords = placeDictionary[location.endLoc.googlePlaceId];
            if (!coords) {
                const googlePlace = yield (0, putGooglePlaceEntry_1.default)({
                    googlePlaceId: location.endLoc.googlePlaceId,
                });
                coords = googlePlace.data.coords;
                placeDictionary[location.endLoc.googlePlaceId] = coords;
            }
            location.endLoc.timezone = (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(coords);
        }
    }
    const updateAttractionArguments = Object.assign(Object.assign({}, event.arguments.input), { locations: filteredLocations });
    const attraction = yield (0, updateAttraction_1.updateAttraction)(updateAttractionArguments);
    if (!attraction) {
        throw new Error('Failed to update attraction');
    }
    // if generation is in step PENDING, invoke the generation function
    if (((_c = attraction.generation) === null || _c === void 0 ? void 0 : _c.status) === API_1.Status.PENDING) {
        if (attraction.generation.step === API_1.GenerationStep.GET_PHOTOS) {
            const getPhotosInput = {
                input: {
                    attractionId: attraction.id,
                    photos: (_f = (_e = (_d = attraction === null || attraction === void 0 ? void 0 : attraction.locations) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.startLoc.googlePlace.data.photos) !== null && _f !== void 0 ? _f : [],
                },
            };
            yield (0, startGetAttractionPhotos_1.startGetAttractionPhotos)({
                queryVariables: getPhotosInput,
                failureCount: (_g = attraction.generation.failureCount) !== null && _g !== void 0 ? _g : 0,
                shouldThrowIfError: false,
                withDynamoDbClient: false,
            });
        }
        else if (attraction.generation.step === API_1.GenerationStep.GET_DETAILS) {
            yield (0, startGenerateAttractionDetails_1.startGenerateAttractionDetails)({
                attractionId: attraction.id,
                failureCount: (_h = attraction.generation.failureCount) !== null && _h !== void 0 ? _h : 0,
                shouldThrowIfError: false,
                withDynamoDbClient: false,
            });
        }
    }
    return attraction;
});
exports.default = adminUpdateAttraction;
