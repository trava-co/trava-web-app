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
const constants_1 = require("../../utils/constants");
const getAllUsers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaListUsers,
            variables: {
                nextToken,
                limit: 1000,
                filter: {
                    id: {
                        ne: userId,
                    },
                    name: {
                        ne: constants_1.USER_DELETED_STRING,
                    },
                },
            },
        });
        return {
            nextToken: (_a = res.data.listUsers) === null || _a === void 0 ? void 0 : _a.nextToken,
            data: (_b = res.data.listUsers) === null || _b === void 0 ? void 0 : _b.items,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((user) => {
            if (user) {
                users.push({
                    __typename: 'SearchUser',
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                });
            }
        });
    });
    return users;
});
exports.default = getAllUsers;
