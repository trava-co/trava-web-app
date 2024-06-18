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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const checkForExistingCards_1 = require("../../utils/checkForExistingCards");
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const constants_1 = require("../../utils/constants");
const retryWithExponentialBackoff_1 = require("../../utils/retryWithExponentialBackoff");
const getGooglePlaceDetails_1 = require("../../utils/getGooglePlaceDetails");
const getInputToCreateGooglePlace_1 = require("./utils/getInputToCreateGooglePlace");
const getInputToCreateAttraction_1 = require("./utils/getInputToCreateAttraction");
const dbClient_1 = __importDefault(require("../../utils/dbClient"));
const getInputToTransaction_1 = require("./utils/getInputToTransaction");
const getAttractionExistsItem_1 = require("./utils/getAttractionExistsItem");
const startGetAttractionPhotos_1 = require("../../utils/startGetAttractionPhotos");
// For creating User Created Cards, which should only have one location, comprised of the same startLoc and endLoc. If these assumptions change, this function will need to be updated.
const createAttractionFromPlaceId = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    console.log(`Running createAttractionFromPlaceId lambda resolver with event arguments input: ${JSON.stringify(event.arguments.input, null, 2)}`);
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE);
    }
    const { googlePlaceId, destinationDates, authorType, recommendationBadges } = event.arguments.input;
    let destinationId = constants_1.OTHER_DESTINATION_ID;
    const googleMapsKeyPromise = (0, getSSMVariable_1.getSSMVariable)('GOOGLE_MAPS_API_KEY'); // start fetch in background
    let GOOGLE_MAPS_KEY;
    /* Step 0: Check if googlePlace and an existing attraction for the google place already exists */
    const { existingGooglePlace, existingAttractions } = yield (0, checkForExistingCards_1.checkForExistingCards)({
        googlePlaceId,
        userId: event.identity.sub,
        destinationDates: destinationDates !== null && destinationDates !== void 0 ? destinationDates : undefined,
    });
    // if an existing attraction already exists, then return it
    if (existingAttractions === null || existingAttractions === void 0 ? void 0 : existingAttractions.length) {
        console.log('Attraction exists, returning existing attraction');
        return {
            __typename: 'CreateAttractionFromPlaceIdResponse',
            existingAttractions: existingAttractions,
            createdAttraction: null,
        };
    }
    // attraction doesn't already exist, so we need to create it
    /* Step 1: Get data from Google Place necessary to create attraction & prepare input to create google place if it doesn't already exist */
    let businessDataToCreateAttraction;
    let newGooglePlace;
    let createGooglePlaceInput;
    let existingGooglePlacePhotos;
    if (existingGooglePlace) {
        // there's an existing google place, so we don't need to fetch it from google places api
        // prepare the business data necessary to create the attraction
        businessDataToCreateAttraction = {
            googlePlaceId: existingGooglePlace.id,
            name: existingGooglePlace.data.name,
            coords: existingGooglePlace.data.coords,
            mealServices: existingGooglePlace.data.mealServices,
            hours: existingGooglePlace.data.hours,
            editorialSummary: existingGooglePlace.data.editorialSummary,
        };
        existingGooglePlacePhotos =
            (_b = (_a = existingGooglePlace.data.photos) === null || _a === void 0 ? void 0 : _a.filter((photo) => Boolean(photo)).map((photo) => {
                const { __typename } = photo, photoWithoutTypename = __rest(photo, ["__typename"]);
                return photoWithoutTypename;
            })) !== null && _b !== void 0 ? _b : undefined;
    }
    else {
        // no existing google place, so we must fetch it from google places api
        GOOGLE_MAPS_KEY = yield googleMapsKeyPromise;
        try {
            newGooglePlace = (yield (0, retryWithExponentialBackoff_1.retryWithExponentialBackoff)({
                func: () => (0, getGooglePlaceDetails_1.getGooglePlaceDetails)({ placeId: googlePlaceId, GOOGLE_MAPS_KEY }),
            }));
            if (!newGooglePlace)
                throw new Error('newGooglePlace is falsy');
            // no existing google place, so prepare the googlePlace input to create one
            createGooglePlaceInput = (0, getInputToCreateGooglePlace_1.getInputToCreateGooglePlace)({
                googlePlaceId,
                googlePlaceData: newGooglePlace,
            });
            // prepare the business data necessary to create the attraction
            businessDataToCreateAttraction = {
                googlePlaceId,
                name: newGooglePlace.name,
                coords: newGooglePlace.coords,
                mealServices: newGooglePlace.mealServices,
                hours: newGooglePlace.hours,
                editorialSummary: newGooglePlace.editorialSummary,
            };
        }
        catch (error) {
            throw new Error(`Error getting google place details from google places api. ${error}`);
        }
    }
    /* Step 2: Prepare input to create attraction */
    // use the relevant google place data to classify the attraction & prepare the input to create the attraction
    const createAttractionInput = (0, getInputToCreateAttraction_1.getInputToCreateAttraction)({
        destinationId,
        business: businessDataToCreateAttraction,
        authorType,
        authorId: event.identity.sub,
        recommendationBadges,
    });
    /* Step 3: Perform transaction to create attraction, google place */
    // parallelize the following 2 in a dynamodb transaction:
    // 1. create google place entry if it doesn't exist
    // 2. create attraction
    // if any of the above fail, then the transaction will rollback
    const transaction = (0, getInputToTransaction_1.getInputToTransaction)({
        createAttractionInput,
        createGooglePlaceInput,
    });
    // perform transaction
    try {
        yield dbClient_1.default.transactWrite(transaction).promise();
    }
    catch (error) {
        console.error('Transaction failed:', error);
        throw new Error('Transaction failed: ' + (error === null || error === void 0 ? void 0 : error.message));
    }
    /* Step 4: call getAttractionPhotos to start that async process */
    const getPhotosInput = {
        input: {
            attractionId: createAttractionInput.id,
            photos: (_e = (_d = (_c = createGooglePlaceInput === null || createGooglePlaceInput === void 0 ? void 0 : createGooglePlaceInput.data) === null || _c === void 0 ? void 0 : _c.photos) !== null && _d !== void 0 ? _d : existingGooglePlacePhotos) !== null && _e !== void 0 ? _e : [],
        },
    };
    yield (0, startGetAttractionPhotos_1.startGetAttractionPhotos)({
        queryVariables: getPhotosInput,
        failureCount: 0,
        shouldThrowIfError: true,
        withDynamoDbClient: true,
    });
    /* Step 5: Return createdAttraction as type AttractionExistsItem */
    const createdAttraction = (0, getAttractionExistsItem_1.getAttractionExistsItem)({
        attraction: createAttractionInput,
        coords: businessDataToCreateAttraction.coords,
    });
    return {
        __typename: 'CreateAttractionFromPlaceIdResponse',
        existingAttractions: null,
        createdAttraction,
    };
});
exports.default = createAttractionFromPlaceId;
