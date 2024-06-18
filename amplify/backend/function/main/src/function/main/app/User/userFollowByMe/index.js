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
const getUserFollow = /* GraphQL */ `
  query GetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
    }
  }
`;
function get(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: getUserFollow,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.getUserFollow;
    });
}
const userFollowByMe = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (event.identity && 'sub' in event.identity) {
        const myUserId = event.identity.sub;
        return yield get({
            userId: myUserId,
            followedUserId: event.source.id,
        });
    }
    return null;
});
exports.default = userFollowByMe;
