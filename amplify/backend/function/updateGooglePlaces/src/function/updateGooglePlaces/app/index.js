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
exports.handler = void 0;
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const getGooglePlaceDetails_1 = require("./utils/getGooglePlaceDetails");
const retryWithExponentialBackoff_1 = require("./utils/retryWithExponentialBackoff");
const sendSlackMessage_1 = require("./utils/sendSlackMessage");
const getAllPaginatedData_1 = __importDefault(require("./utils/getAllPaginatedData"));
const getSSMVariable_1 = require("./utils/getSSMVariable");
// this lambda is triggered every day at 7am UTC
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // only run this function in production
    if (((_a = process.env.ENV) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== API_1.BACKEND_ENV_NAME.PROD.toLowerCase()) {
        console.log('updateGooglePlaces not running in non-prod environment');
        return;
    }
    console.log('updateGooglePlaces started');
    ApiClient_1.default.get().useIamAuth();
    const key = yield getSSMVariable_1.getSSMVariable('GOOGLE_MAPS_API_KEY');
    // 1. fetch all googlePlaces, oldest first
    const googlePlacesOldestFirst = yield fetchGooglePlacesByOldestFirst();
    const existingGooglePlacesCount = googlePlacesOldestFirst === null || googlePlacesOldestFirst === void 0 ? void 0 : googlePlacesOldestFirst.length;
    console.log(`total GooglePlaces: ${existingGooglePlacesCount}`);
    // if there are no google places, return
    if (!existingGooglePlacesCount) {
        throw new Error('no google places found');
    }
    // every day, process 1/45 of the oldest google places
    const proportionToProcess = 1 / 45;
    // identify the oldest set of google places to process
    const batchSize = Math.ceil(existingGooglePlacesCount * proportionToProcess);
    const itemsToProcess = googlePlacesOldestFirst.slice(0, batchSize);
    console.log(`in tonight's batch, processing ${batchSize} items`);
    const placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded = [];
    const placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed = [];
    const placeIdsFailedFetchFromGoogleAndUpdateSucceeded = [];
    const placeIdsFailedFetchFromGoogleAndUpdateFailed = [];
    // 2. for each google place, query Google Places API and update the google place with the new data
    for (let i = 0; i < itemsToProcess.length; i++) {
        const place = itemsToProcess[i];
        console.log(`\n **************** \n processing google place id: ${place.id}`);
        const now = new Date().toISOString();
        let newGooglePlace;
        try {
            newGooglePlace = yield retryWithExponentialBackoff_1.retryWithExponentialBackoff({
                func: () => getGooglePlaceDetails_1.getGooglePlaceDetails({ placeId: place.id, GOOGLE_MAPS_KEY: key }),
                maxRetries: 1,
            });
        }
        catch (error) {
            error.message = `\n Error fetching google place for googlePlaceId: ${place.id} from Google API. ${error.message}`;
            console.warn(error);
            // update google place data, incrementing consecutiveFailedRequests
            const newConsecutiveFailedRequests = ((_b = place.consecutiveFailedRequests) !== null && _b !== void 0 ? _b : 0) + 1;
            const input = {
                id: place.id,
                consecutiveFailedRequests: newConsecutiveFailedRequests,
                // if there have been 2 consecutive failed requests, mark the google place as invalid to avoid future requests
                isValid: newConsecutiveFailedRequests < 2 ? 1 : 0,
                dataLastCheckedAt: now,
            };
            try {
                yield updateGooglePlace(input);
                placeIdsFailedFetchFromGoogleAndUpdateSucceeded.push(place.id);
            }
            catch (error) {
                placeIdsFailedFetchFromGoogleAndUpdateFailed.push(place.id);
                console.warn(error);
            }
            continue;
        }
        const input = {
            id: place.id,
            data: newGooglePlace,
            consecutiveFailedRequests: 0,
            isValid: 1,
            dataLastCheckedAt: now,
            dataLastUpdatedAt: now,
        };
        try {
            yield updateGooglePlace(input);
            placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.push(place.id);
            console.log(`successfully updated google place id: ${place.id}`);
        }
        catch (error) {
            placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.push(place.id);
            console.warn(error);
        }
    }
    // 3. log the results
    console.log(`\n\n******\n\n${batchSize} items fetched from GooglePlaces table for updating:`);
    console.log(`\n\n******\n\n${placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.length} google places successfully fetched & updated GooglePlaces table:`);
    placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.forEach((placeId) => console.log(placeId));
    console.log(`\n\n******\n\n ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.length} google places successfully fetched but failed to update GooglePlaces table:`);
    placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.forEach((placeId) => console.log(placeId));
    console.log(`\n\n******\n\n${placeIdsFailedFetchFromGoogleAndUpdateSucceeded.length} google places failed to fetch but successfully updated GooglePlaces table:`);
    placeIdsFailedFetchFromGoogleAndUpdateSucceeded.forEach((placeId) => console.log(placeId));
    console.log(`\n\n******\n\n${placeIdsFailedFetchFromGoogleAndUpdateFailed.length} google places failed to fetch & failed to update GooglePlaces table:`);
    placeIdsFailedFetchFromGoogleAndUpdateFailed.forEach((placeId) => console.log(placeId));
    // these place ids need to be checked manually and potentially updated manually
    const placeIdsFailedFetchFromGoogle = [
        ...placeIdsFailedFetchFromGoogleAndUpdateSucceeded,
        ...placeIdsFailedFetchFromGoogleAndUpdateFailed,
    ];
    // 4. send slack message with results
    const messageParts = [
        'Google Places Nightly Update:',
        `- Total items processed: ${batchSize}`,
        `- Google fetch succeeded, Trava update succeeded: ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateSucceeded.length}`,
        `- Google fetch succeeded, Trava update failed: ${placeIdsSuccessfullyFetchedFromGoogleAndUpdateFailed.length}`,
        `- Google fetch failed, Trava update succeeded: ${placeIdsFailedFetchFromGoogleAndUpdateSucceeded.length}`,
        `- Google fetch failed, Trava update failed: ${placeIdsFailedFetchFromGoogleAndUpdateFailed.length}`,
    ];
    placeIdsFailedFetchFromGoogle.length > 0 &&
        messageParts.push('\nSee attached CSV for IDs that failed to fetch from Google.');
    const message = messageParts.join('\n');
    yield sendSlackMessage_1.sendSlackMessage(message, placeIdsFailedFetchFromGoogle);
});
exports.handler = handler;
const fetchGooglePlacesByOldestFirst = () => __awaiter(void 0, void 0, void 0, function* () {
    const googlePlaces = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f;
        const result = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGooglePlacesByIsValidByDataLastCheckedAt,
            variables: {
                isValid: 1,
                limit: 1000,
                sortDirection: API_1.ModelSortDirection.ASC,
                nextToken,
            },
        });
        return {
            nextToken: (_d = (_c = result.data) === null || _c === void 0 ? void 0 : _c.googlePlacesByIsValidByDataLastCheckedAt) === null || _d === void 0 ? void 0 : _d.nextToken,
            data: (_f = (_e = result.data) === null || _e === void 0 ? void 0 : _e.googlePlacesByIsValidByDataLastCheckedAt) === null || _f === void 0 ? void 0 : _f.items,
        };
    }), (data) => {
        if (!data)
            return;
        data.forEach((item) => {
            if (!item)
                return;
            googlePlaces.push(item);
        });
    });
    return googlePlaces;
});
// get the attraction ids associated with this googlePlaceId, and update these attractions to trigger update to OpenSearch attraction documents
const updateAssociatedAttractions = (googlePlaceId) => __awaiter(void 0, void 0, void 0, function* () {
    // query OpenSearch with googlePlaceId to get the attraction id
    const openSearchQuery = createOpenSearchQuery(googlePlaceId);
    const openSearchResponse = yield ApiClient_1.default.get().openSearchFetch('attraction', openSearchQuery);
    // @ts-ignore
    const matchedAttractionDocs = openSearchResponse.hits.hits;
    // @ts-ignore
    const matchedAttractionIds = matchedAttractionDocs.map((doc) => doc._source.id);
    if ((matchedAttractionIds === null || matchedAttractionIds === void 0 ? void 0 : matchedAttractionIds.length) > 0) {
        console.log(`matched attractionIds: ${matchedAttractionIds}`);
    }
    else {
        console.log(`no attractions matched for googlePlaceId: ${googlePlaceId}`);
        // TODO: think about deleting this googleplace if there are no attractions associated with it
    }
    // for each of these attractionIds, update the attraction's updatedAt field to trigger update to OpenSearch attraction docs with this googlePlaceId
    for (const matchedAttractionId of matchedAttractionIds) {
        console.log(`updating attraction id: ${matchedAttractionId}`);
        yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateAttraction,
            variables: {
                input: {
                    id: matchedAttractionId,
                    updatedAt: new Date().toISOString(),
                },
            },
        });
    }
});
const updateGooglePlace = (updateGooglePlaceInput) => __awaiter(void 0, void 0, void 0, function* () {
    yield ApiClient_1.default.get()
        .apiFetch({
        query: lambda_1.lambdaPrivateUpdateGooglePlace,
        variables: { input: updateGooglePlaceInput },
    })
        .catch((error) => {
        error.message = `\n Error updating GooglePlace table for googlePlaceId: ${updateGooglePlaceInput.id}. ${error.message}`;
        throw error;
    });
    yield updateAssociatedAttractions(updateGooglePlaceInput.id).catch((error) => {
        error.message = `\n Error updating associated attractions for googlePlaceId: ${updateGooglePlaceInput.id}. ${error.message}`;
        throw error;
    });
});
const createOpenSearchQuery = (googlePlaceId) => {
    const filterConditions = [
        {
            term: {
                googlePlaceIds: googlePlaceId,
            },
        },
    ];
    const query = {
        bool: {
            filter: filterConditions,
        },
    };
    return {
        _source: {
            includes: ['id'],
        },
        size: 50,
        query,
    };
};
