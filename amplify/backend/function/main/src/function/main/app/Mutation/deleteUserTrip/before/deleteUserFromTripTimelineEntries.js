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
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const getTripTimelineByTrip_1 = __importDefault(require("../../../utils/getTripTimelineByTrip"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const lambda_1 = require("shared-types/graphql/lambda");
const CHUNK_SIZE = 10;
const deleteUserFromTripTimelineEntries = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE); // FIXME:
    }
    const { tripId, userId } = event.arguments.input;
    const tripTimelineEntries = yield (0, getTripTimelineByTrip_1.default)({ tripId, userId: event.identity.sub });
    const promises = tripTimelineEntries === null || tripTimelineEntries === void 0 ? void 0 : tripTimelineEntries.filter((tripTimelineEntry) => !!(tripTimelineEntry === null || tripTimelineEntry === void 0 ? void 0 : tripTimelineEntry.id)).map((tripTimelineEntry) => {
        return ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateDeleteTimelineEntryMember,
            variables: {
                input: {
                    timelineEntryId: tripTimelineEntry.id,
                    userId,
                },
            },
        });
    });
    event.request.headers.authorization && ApiClient_1.default.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization);
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return null;
});
exports.default = deleteUserFromTripTimelineEntries;
