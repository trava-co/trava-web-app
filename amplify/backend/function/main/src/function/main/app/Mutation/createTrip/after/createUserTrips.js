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
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const CHUNK_SIZE = 5;
function create(userTrip) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateUserTrip,
            variables: {
                input: userTrip,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.createUserTrip;
    });
}
const createUserTrips = (event, trip) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (event.identity && 'sub' in event.identity) {
        const adminUserId = event.identity.sub;
        const adminInviteLink = event.arguments.input.link;
        const userIds = event.arguments.input.userIds;
        const uniqueUserIds = [...new Set(userIds)];
        // userTrip host must go first, otherwise you won't be allowed to create other userTrips
        yield create({
            tripId: trip.id,
            userId: adminUserId,
            status: API_1.UserTripStatus.APPROVED,
            invitedByUserId: adminUserId,
            inviteLink: adminInviteLink,
        });
        // create userTrips for other members
        const userTripPromises = uniqueUserIds.map((userId) => create({
            tripId: trip.id,
            userId,
            status: userId === adminUserId ? API_1.UserTripStatus.APPROVED : API_1.UserTripStatus.PENDING,
            invitedByUserId: adminUserId,
        }));
        const chunkedUserTripPromises = (0, lodash_chunk_1.default)(userTripPromises, CHUNK_SIZE);
        for (const chunkOfUserTripPromises of chunkedUserTripPromises) {
            yield Promise.all(chunkOfUserTripPromises);
        }
    }
    return null;
});
exports.default = createUserTrips;
