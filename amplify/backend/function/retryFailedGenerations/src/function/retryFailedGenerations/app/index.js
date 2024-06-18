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
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const updateAttraction_1 = require("./utils/updateAttraction");
const startGetAttractionPhotos_1 = require("./utils/startGetAttractionPhotos");
const startGenerateAttractionDetails_1 = require("./utils/startGenerateAttractionDetails");
const failureCountLimit = 3;
// this lambda is triggered every 15 minutes, and retriggers attractions with failed generations and fewer than 3 failures
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('retryFailedGenerations triggered');
    ApiClient_1.default.get().useIamAuth();
    // get all attractions that have failed generations from opensearch
    const getPhotosQuery = createOpenSearchQuery({ generationStep: API_1.GenerationStep.GET_PHOTOS });
    const getDetailsQuery = createOpenSearchQuery({ generationStep: API_1.GenerationStep.GET_DETAILS });
    const getPhotosPromise = ApiClient_1.default.get().openSearchFetch('attraction', getPhotosQuery);
    const getDetailsPromise = ApiClient_1.default.get().openSearchFetch('attraction', getDetailsQuery);
    const [getPhotosResponse, getDetailsResponse] = yield Promise.all([getPhotosPromise, getDetailsPromise]);
    // @ts-ignore
    const failedPhotosAttractions = getPhotosResponse.hits.hits.map((hit) => hit._source);
    console.log(`found ${failedPhotosAttractions.length} attractions with failed or pending getPhotos generations`);
    // @ts-ignore
    const failedDetailsAttractions = getDetailsResponse.hits.hits.map((hit) => hit._source);
    console.log(`found ${failedDetailsAttractions.length} attractions with failed or pending getDetails generations`);
    // for each of the failedPhotosAttractions, retrigger the getPhotos mutation by setting generationStatus to PENDING via appsync
    const failedPhotosPromises = failedPhotosAttractions.map((attraction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const input = {
            id: attraction.id,
            generation: Object.assign(Object.assign({}, attraction.generation), { status: API_1.Status.PENDING, lastUpdatedAt: new Date().toISOString() }),
        };
        const updatedAttraction = yield updateAttraction_1.updateAttraction({
            input,
        });
        const getPhotosInput = {
            input: {
                attractionId: attraction.id,
                photos: (_c = (_b = (_a = updatedAttraction === null || updatedAttraction === void 0 ? void 0 : updatedAttraction.locations) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.startLoc.googlePlace.data.photos) !== null && _c !== void 0 ? _c : [],
            },
        };
        return startGetAttractionPhotos_1.startGetAttractionPhotos({
            queryVariables: getPhotosInput,
            failureCount: (_d = attraction.generation.failureCount) !== null && _d !== void 0 ? _d : 0,
        });
    }));
    // for each of the failedDetailsAttractions, retrigger the getDetails mutation by setting generationStatus to PENDING
    const failedDetailsPromises = failedDetailsAttractions.map((attraction) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const input = {
            id: attraction.id,
            generation: Object.assign(Object.assign({}, attraction.generation), { status: API_1.Status.PENDING, lastUpdatedAt: new Date().toISOString() }),
        };
        console.log(`retriggering getDetails for attraction with input: ${JSON.stringify(input, null, 2)}`);
        yield updateAttraction_1.updateAttraction({
            input,
        });
        return startGenerateAttractionDetails_1.startGenerateAttractionDetails({
            attractionId: attraction.id,
            failureCount: (_e = attraction.generation.failureCount) !== null && _e !== void 0 ? _e : 0,
        });
    }));
    yield Promise.allSettled([...failedPhotosPromises, ...failedDetailsPromises]);
    console.log(`finished processing ${failedPhotosAttractions.length} attractions with failed getPhotos generations and ${failedDetailsAttractions.length} attractions with failed getDetails generations`);
});
exports.handler = handler;
const createOpenSearchQuery = ({ generationStep }) => {
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    const filterConditions = [
        {
            term: {
                'generation.step': generationStep,
            },
        },
        {
            bool: {
                should: [
                    {
                        term: {
                            'generation.status': API_1.Status.FAILED,
                        },
                    },
                    {
                        term: {
                            'generation.status': API_1.Status.PENDING,
                        },
                    },
                    {
                        bool: {
                            must: [
                                {
                                    term: {
                                        'generation.status': API_1.Status.IN_PROGRESS,
                                    },
                                },
                                {
                                    range: {
                                        'generation.lastUpdatedAt': {
                                            lt: tenMinutesAgo,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
        {
            range: {
                'generation.failureCount': {
                    lt: failureCountLimit,
                },
            },
        },
    ];
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
    return {
        _source: {
            includes: ['id', 'generation'],
        },
        size: 50,
        query,
    };
};
const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
