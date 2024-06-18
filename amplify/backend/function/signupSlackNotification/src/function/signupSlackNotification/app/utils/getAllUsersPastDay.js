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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const tz = 'America/New_York';
// today's date, starting at midnight eastern time, accounting for daylight savings period during year
const today = () => {
    const date = dayjs_1.default().tz(tz).startOf('day');
    return date.toISOString();
};
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaListUsers,
            variables: {
                nextToken,
                limit: 500,
                filter: {
                    createdAt: { ge: today() },
                },
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
