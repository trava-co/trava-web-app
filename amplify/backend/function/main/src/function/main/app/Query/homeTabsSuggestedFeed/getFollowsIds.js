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
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getFollowsIds = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const followsIds = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaHomeTabsFeedGetFollowingUsers,
            variables: {
                id: userId,
                followsNextToken: nextToken,
                followsLimit: 50,
            },
        });
        return {
            nextToken: (_b = (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.follows) === null || _b === void 0 ? void 0 : _b.nextToken,
            data: (_d = (_c = res.data.getUser) === null || _c === void 0 ? void 0 : _c.follows) === null || _d === void 0 ? void 0 : _d.items,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((item) => {
            if ((item === null || item === void 0 ? void 0 : item.followedUserId) && (item === null || item === void 0 ? void 0 : item.approved))
                followsIds.push(item.followedUserId);
        });
    });
    return followsIds;
});
exports.default = getFollowsIds;
