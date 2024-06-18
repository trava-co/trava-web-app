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
const getAllPaginatedData_1 = __importDefault(require("../../../utils/getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const CHUNK_SIZE = 25;
function _privateUpdateUserFollow(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateUserFollow,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateUserFollow;
    });
}
function _lambdaGetUserFollowedBy(variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const userFollows = [];
        yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaGetUserFollowedBy,
                variables: {
                    userId: variables.userId,
                    followedByNextToken: nextToken,
                },
            });
            return {
                nextToken: (_b = (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.followedBy) === null || _b === void 0 ? void 0 : _b.nextToken,
                data: (_d = (_c = res.data.getUser) === null || _c === void 0 ? void 0 : _c.followedBy) === null || _d === void 0 ? void 0 : _d.items,
            };
        }), (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((item) => {
                if (!item)
                    return;
                userFollows.push(item);
            });
        });
        return userFollows;
    });
}
const acceptPendingFollowRequests = (event, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    // trigger only when a user sets privacy to PUBLIC
    if ('privacy' in event.arguments.input && event.arguments.input.privacy === API_1.PRIVACY.PUBLIC) {
        const userFollows = yield _lambdaGetUserFollowedBy({ userId: user.id });
        const updateUserFollowPromises = userFollows
            .filter((userFollow) => !userFollow.approved)
            .map((userFollow) => _privateUpdateUserFollow({
            input: {
                userId: userFollow.userId,
                followedUserId: userFollow.followedUserId,
                approved: true,
            },
        }));
        const chunks = (0, lodash_chunk_1.default)(updateUserFollowPromises, CHUNK_SIZE);
        for (const chunkOfPromises of chunks) {
            yield Promise.all(chunkOfPromises);
        }
    }
    return null;
});
exports.default = acceptPendingFollowRequests;
