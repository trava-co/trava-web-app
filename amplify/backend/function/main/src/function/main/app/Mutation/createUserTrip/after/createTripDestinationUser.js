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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const getTripDestinations_1 = __importDefault(require("../../../utils/getTripDestinations"));
const lambda_1 = require("shared-types/graphql/lambda");
const CHUNK_SIZE = 10;
const createTripDestinationUser = (event, userTrip) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_USER_MESSAGE);
    }
    const tripDestinations = yield (0, getTripDestinations_1.default)({
        tripId: event.arguments.input.tripId,
        userId: event.identity.sub,
    });
    const promises = tripDestinations.map((tripDestination) => {
        if (!tripDestination)
            return null;
        return ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateCreateTripDestinationUser,
            variables: {
                input: {
                    isReady: false,
                    userId: userTrip.userId,
                    tripId: event.arguments.input.tripId,
                    destinationId: tripDestination.destinationId,
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
exports.default = createTripDestinationUser;
