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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const lambda_1 = require("shared-types/graphql/lambda");
const notEmpty_1 = __importDefault(require("../../utils/notEmpty"));
const CHUNK_SIZE = 10;
const createTripMessageNotifications = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    ApiClient_1.default.get().useIamAuth();
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS);
    }
    const senderUserId = event.identity.sub;
    if (!senderUserId) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS);
    }
    // 1. Get members of the trip
    const getMembers = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaChatCreateTripMessageNotificationsGetReceiversIds,
        variables: {
            tripId: event.arguments.input.tripId,
        },
    });
    const getMembersIds = (_e = (_d = (_c = (_b = (_a = getMembers === null || getMembers === void 0 ? void 0 : getMembers.data) === null || _a === void 0 ? void 0 : _a.privateGetTrip) === null || _b === void 0 ? void 0 : _b.members) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.filter(notEmpty_1.default)) === null || _e === void 0 ? void 0 : _e.filter((el) => el.status === API_1.UserTripStatus.APPROVED).map((el) => el.userId);
    if (!getMembersIds) {
        throw new Error('No members');
    }
    // if user doesn't belong to the trip
    if (getMembersIds.indexOf(senderUserId) === -1) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS);
    }
    const promises = getMembersIds
        .filter((userId) => userId !== senderUserId) // don't send notification to the sender
        .map((receiverUserId) => {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateNotification,
            variables: {
                input: {
                    showInApp: 0,
                    receiverUserId,
                    senderUserId,
                    tripId: event.arguments.input.tripId,
                    type: event.arguments.input.type,
                    text: event.arguments.input.text,
                },
            },
        });
    });
    const chunks = (0, lodash_chunk_1.default)(promises, CHUNK_SIZE);
    for (const chunkOfPromises of chunks) {
        yield Promise.all(chunkOfPromises);
    }
    return true;
});
exports.default = createTripMessageNotifications;
