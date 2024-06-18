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
const getUserTrips_1 = __importDefault(require("../../../utils/getUserTrips"));
const lambda_1 = require("shared-types/graphql/lambda");
const CHUNK_SIZE = 10;
const deleteTripDestinationUsers = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE);
    }
    const userTrips = yield (0, getUserTrips_1.default)({
        tripId: event.arguments.input.tripId,
        userId: event.identity.sub,
    });
    const promises = userTrips.map((userTrip) => {
        if (!userTrip)
            return null;
        return ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateDeleteTripDestinationUser,
            variables: {
                input: {
                    userId: userTrip.userId,
                    tripId: event.arguments.input.tripId,
                    destinationId: event.arguments.input.destinationId,
                },
            },
        });
    });
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    ApiClient_1.default.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization);
    return null;
});
exports.default = deleteTripDestinationUsers;
