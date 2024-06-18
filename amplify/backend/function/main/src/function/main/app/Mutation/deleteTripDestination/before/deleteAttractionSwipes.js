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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const getTripDestinationAttractionSwipes_1 = __importDefault(require("../../../utils/getTripDestinationAttractionSwipes"));
const CHUNK_SIZE = 10;
const deleteAttractionSwipes = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { tripId, destinationId } = event.arguments.input;
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!event.identity || !('sub' in event.identity)) {
        throw new Error('should not happen');
    }
    // used only to get to the swipes the current userTrip has access to
    const userId = event.identity.sub;
    const attractionSwipesToRemove = yield (0, getTripDestinationAttractionSwipes_1.default)({ tripId, userId, destinationId });
    const deleteAttractionSwipeInputs = attractionSwipesToRemove === null || attractionSwipesToRemove === void 0 ? void 0 : attractionSwipesToRemove.filter((attractionSwipe) => !!attractionSwipe).map((attractionSwipe) => ({
        attractionId: attractionSwipe.attractionId,
        tripId,
        userId: attractionSwipe.userId,
    }));
    const promises = deleteAttractionSwipeInputs === null || deleteAttractionSwipeInputs === void 0 ? void 0 : deleteAttractionSwipeInputs.map((input) => {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateDeleteAttractionSwipe,
            variables: {
                input,
            },
        });
    });
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return null;
});
exports.default = deleteAttractionSwipes;
