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
const mutations_1 = require("shared-types/graphql/mutations");
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const checkTripDestinationAttractionsUpdate_1 = __importDefault(require("./before/checkTripDestinationAttractionsUpdate"));
const CHUNK_SIZE = 10;
const beforeHooks = [checkTripDestinationAttractionsUpdate_1.default];
const updateTripDestinationAttractions = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('updateTripDestinationAttractions');
    for (const hook of beforeHooks) {
        console.log(`Running before hook: "${hook.name}"`);
        yield hook(event);
    }
    const promises = event.arguments.input.attractions.map((attraction) => ApiClient_1.default.get().apiFetch({
        query: mutations_1.privateUpdateTripDestinationAttraction,
        variables: {
            input: {
                attractionId: attraction.attractionId,
                tripId: event.arguments.input.tripId,
                destinationId: event.arguments.input.destinationId,
                manuallyAddedToTrip: true,
            },
        },
    }));
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return null;
});
exports.default = updateTripDestinationAttractions;