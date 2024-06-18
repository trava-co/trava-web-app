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
const getAllPaginatedData_1 = __importDefault(require("./getAllPaginatedData"));
const queries_1 = require("shared-types/graphql/queries");
const ApiClient_1 = __importDefault(require("./ApiClient"));
const LIMIT = 500;
const oneWeekAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: queries_1.listUsers,
            variables: {
                nextToken,
                filter: {
                    createdAt: { ge: oneWeekAgo() },
                },
                limit: LIMIT,
            },
        });
        return {
            nextToken: (_a = res.data.listUsers) === null || _a === void 0 ? void 0 : _a.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.listUsers) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            if (item)
                users.push(item);
        });
    });
    return users;
});
