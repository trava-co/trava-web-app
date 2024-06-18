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
const lambda_1 = require("shared-types/graphql/lambda");
const checkAttractionAccessCreate_1 = __importDefault(require("./before/checkAttractionAccessCreate"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getTimezoneFromCoords_1 = require("../../utils/getTimezoneFromCoords");
const putGooglePlaceEntry_1 = __importDefault(require("../../utils/putGooglePlaceEntry"));
const beforeHooks = [checkAttractionAccessCreate_1.default];
function _privateCreateAttraction(createAttractionMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCustomPrivateCreateAttraction,
            variables: {
                input: createAttractionMutationVariables.input,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateAttraction;
    });
}
const adminCreateAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`Running resolver: "adminCreateAttraction"`);
    /**
     * before hooks
     */
    for (const hook of beforeHooks) {
        console.log(`Running before hook: "${hook.name}"`);
        yield hook(event);
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE);
    }
    const { locations } = event.arguments.input;
    const filteredLocations = locations === null || locations === void 0 ? void 0 : locations.filter(Boolean);
    if (!(filteredLocations === null || filteredLocations === void 0 ? void 0 : filteredLocations.length)) {
        throw new Error('No location provided');
    }
    // create a dictionary composed of googlePlaceIds and coords to reduce checks to GooglePlace table
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
    const createAttractionArguments = {
        input: Object.assign(Object.assign({}, event.arguments.input), { locations: filteredLocations }),
    };
    const attraction = yield _privateCreateAttraction(createAttractionArguments);
    if (!attraction) {
        throw new Error('Failed to create attraction');
    }
    return attraction;
});
exports.default = adminCreateAttraction;
