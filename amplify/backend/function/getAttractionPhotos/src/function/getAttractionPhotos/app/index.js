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
exports.handler = void 0;
const API_1 = require("shared-types/API");
const getSSMVariable_1 = require("./utils/getSSMVariable");
const getGooglePhoto_1 = require("./utils/getGooglePhoto");
const updateAttraction_1 = require("./utils/updateAttraction");
const startGenerateAttractionDetails_1 = require("./utils/startGenerateAttractionDetails");
const env_names_to_config_1 = require("./utils/env-names-to-config");
const getAttraction_1 = require("./utils/getAttraction");
const OTHER_DESTINATION_ID = '7cd39ab7-f703-45a0-8d4d-3732410f711f';
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { attractionId, photos } = event.arguments.input;
    console.log(`starting getAttractionPhotos with attraction id ${attractionId}`);
    const numPhotos = photos === null || photos === void 0 ? void 0 : photos.length;
    const destinationId = OTHER_DESTINATION_ID;
    // start fetch of google maps key
    const googleMapsKeyPromise = getSSMVariable_1.getSSMVariable('GOOGLE_MAPS_API_KEY');
    try {
        // attempt to update attraction status to IN_PROGRESS. If fails, log error and return false.
        // don't want to throw error & set FAILED status just because another fn is currently processing this attraction
        yield updateAttraction_1.updateAttractionStatusToInProgress({ attractionId });
    }
    catch (error) {
        console.error(`Attraction ${attractionId} is not in the GET_PHOTOS step or status is not PENDING. Error: ${error === null || error === void 0 ? void 0 : error.message}`);
        if (error.code === 'TransactionCanceledException') {
            console.error(`Cancellation reasons: ${JSON.stringify(error.CancellationReasons)}`);
        }
        return false;
    }
    // now that we have the attraction and have set status to IN_PROGRESS, we can attempt to get photos
    try {
        let images = [];
        console.log(`Getting ${numPhotos} photos for attraction ${attractionId}`);
        if (numPhotos) {
            // get bucket name from env
            const env = process.env.ENV;
            if (!env)
                throw new Error('ENV not set');
            const parsedEnv = env.toUpperCase();
            const envConfig = env_names_to_config_1.envNamesToConfig[parsedEnv];
            const STORAGE_BUCKETNAME = envConfig.bucketName;
            // if photos, getGooglePhoto for first 3
            const photosToGet = (_a = photos === null || photos === void 0 ? void 0 : photos.slice(0, 3)) !== null && _a !== void 0 ? _a : [];
            const GOOGLE_MAPS_KEY = yield googleMapsKeyPromise;
            const photoPromises = photosToGet.map((photo, i) => getGooglePhoto_1.getGooglePhoto(Object.assign(Object.assign({}, photo), { destinationId,
                attractionId, order: i + 1, GOOGLE_MAPS_KEY,
                STORAGE_BUCKETNAME })));
            images = yield Promise.all(photoPromises);
        }
        console.log('about to update attraction');
        // need to call appsync updateAttraction mutation to trigger subscription
        yield updateAttraction_1.updateAttraction({
            input: {
                id: attractionId,
                images: (images === null || images === void 0 ? void 0 : images.length) ? images : null,
                generation: {
                    step: API_1.GenerationStep.GET_DETAILS,
                    status: API_1.Status.PENDING,
                    failureCount: 0,
                    lastUpdatedAt: new Date().toISOString(),
                },
            },
        });
        console.log('Updated attraction');
    }
    catch (error) {
        // if there was a failure while getting the photos, update the attraction with the failure
        // first, fetch the attraction
        const attraction = yield getAttraction_1.getAttractionWithDynamoDbClient({ attractionId });
        yield updateAttraction_1.updateAttractionWithFailure({
            attractionId,
            failureCount: (_c = (_b = attraction === null || attraction === void 0 ? void 0 : attraction.generation) === null || _b === void 0 ? void 0 : _b.failureCount) !== null && _c !== void 0 ? _c : undefined,
            step: API_1.GenerationStep.GET_PHOTOS,
            errorMessage: error === null || error === void 0 ? void 0 : error.message,
        }).catch((error) => console.error(error));
        return false;
    }
    try {
        // start the generateAttractionDetails function
        yield startGenerateAttractionDetails_1.startGenerateAttractionDetails(attractionId);
        return true;
    }
    catch (error) {
        // if there was a failure while starting the generateAttractionDetails function, update the attraction with the failure
        console.error('Error calling startGenerateAttractionDetails:', error);
        yield updateAttraction_1.updateAttractionWithFailure({
            attractionId,
            step: API_1.GenerationStep.GET_DETAILS,
            errorMessage: error === null || error === void 0 ? void 0 : error.message,
        }).catch((error) => console.error(error));
        return false;
    }
});
exports.handler = handler;
