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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const queries_1 = require("shared-types/graphql/queries");
const checkIfUserNotBlocked = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    // if user (sub) belongs to tripId - can create (example: add members)
    var _a, _b;
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE);
    }
    // check if user block exists from one side...
    const userBlockedByMe = yield ApiClient_1.default.get().apiFetch({
        query: queries_1.getUserBlock,
        variables: {
            userId: event.arguments.input.userId,
            blockedUserId: event.arguments.input.followedUserId,
        },
    });
    if ((_a = userBlockedByMe === null || userBlockedByMe === void 0 ? void 0 : userBlockedByMe.data) === null || _a === void 0 ? void 0 : _a.getUserBlock) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_USER_FOLLOW);
    }
    // ...and from the opposite side
    const blockOfMeByUser = yield ApiClient_1.default.get().apiFetch({
        query: queries_1.getUserBlock,
        variables: {
            userId: event.arguments.input.followedUserId,
            blockedUserId: event.arguments.input.userId,
        },
    });
    if ((_b = blockOfMeByUser === null || blockOfMeByUser === void 0 ? void 0 : blockOfMeByUser.data) === null || _b === void 0 ? void 0 : _b.getUserBlock) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_USER_FOLLOW);
    }
    return null;
});
exports.default = checkIfUserNotBlocked;
