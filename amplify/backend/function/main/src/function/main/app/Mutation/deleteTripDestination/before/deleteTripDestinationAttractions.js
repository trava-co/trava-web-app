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
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const mutations_1 = require("shared-types/graphql/mutations");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const getTripDestinationAttractions_1 = __importDefault(require("../../../utils/getTripDestinationAttractions"));
const CHUNK_SIZE = 10;
const deleteTripDestinationAttractions = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { tripId, destinationId } = event.arguments.input;
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('should not happen');
    }
    const tripDestinationAttractionsToRemove = yield (0, getTripDestinationAttractions_1.default)({
        tripId,
        destinationId,
        userId: event.identity.sub,
    });
    const promises = tripDestinationAttractionsToRemove.map((attractionId) => {
        return ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateDeleteTripDestinationAttraction,
            variables: {
                input: {
                    attractionId,
                    tripId,
                    destinationId,
                },
            },
        });
    });
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return null;
});
exports.default = deleteTripDestinationAttractions;
