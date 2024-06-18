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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const checkAttractionAccessCreate_1 = __importDefault(require("./before/checkAttractionAccessCreate"));
const createTripDestinationAttraction_1 = __importDefault(require("./after/createTripDestinationAttraction"));
const createDestinationFromAttraction_1 = __importDefault(require("./createDestinationFromAttraction"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const constants_1 = require("../../utils/constants");
const uuid_1 = require("uuid");
const getTimezoneFromCoords_1 = require("../../utils/getTimezoneFromCoords");
const createGooglePlaceFromDetails_1 = __importDefault(require("./createGooglePlaceFromDetails"));
const beforeHooks = [checkAttractionAccessCreate_1.default];
const afterHooks = [createTripDestinationAttraction_1.default];
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
// For creating User Created Cards, which should only have one location, comprised of the same startLoc and endLoc. If these assumptions change, this function will need to be updated.
const createUserAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
    const validLocations = filteredLocations;
    const firstLocation = validLocations[0];
    const { city, state, country, continent, coords, timezone } = firstLocation.startLoc;
    const inputDestinationId = event.arguments.input.destinationId;
    let destinationPromise = Promise.resolve(undefined);
    if (!inputDestinationId) {
        // occurs when attraction created outside of trip and no Trava/My destination within 50 miles
        // create new destination from what we know about the attraction's location
        destinationPromise = (0, createDestinationFromAttraction_1.default)({
            city: city || '',
            state: state || '',
            country: country || '',
            continent: continent || '',
            authorId: event.identity.sub || '',
            attractionCoords: coords,
        });
    }
    // create googlePlace
    const googlePlacePromise = (0, createGooglePlaceFromDetails_1.default)({ location: firstLocation.startLoc });
    // wait for destination and googlePlace to be created
    const [destination, googlePlace] = yield Promise.all([destinationPromise, googlePlacePromise]);
    // add id to each location, as well as location.startLoc and location.endLoc
    const locationWithId = {
        id: (0, uuid_1.v4)(),
        displayOrder: 1,
        startLoc: {
            id: (0, uuid_1.v4)(),
            googlePlaceId: googlePlace.id,
            timezone: timezone || (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(coords),
        },
        endLoc: {
            id: (0, uuid_1.v4)(),
            googlePlaceId: googlePlace.id,
            timezone: timezone || (0, getTimezoneFromCoords_1.getTimezoneFromCoords)(coords),
        },
    };
    const finalDestinationId = inputDestinationId || (destination === null || destination === void 0 ? void 0 : destination.id) || constants_1.OTHER_DESTINATION_ID; // fallback to setting attraction.destinationId to 'Other'
    const createAttractionArguments = {
        input: Object.assign(Object.assign({}, event.arguments.input), { authorId: event.identity.sub, authorType: API_1.AUTHOR_TYPE.USER, destinationId: finalDestinationId, bucketListCount: 0, tripId: undefined, locations: [locationWithId] }),
    };
    const attraction = yield _privateCreateAttraction(createAttractionArguments);
    if (!attraction) {
        throw new Error('Failed to create attraction');
    }
    /**
     * sync after
     */
    for (const hook of afterHooks) {
        console.log(`Running after hook: "${hook.name}"`);
        yield hook(event, attraction);
    }
    return attraction;
});
exports.default = createUserAttraction;
