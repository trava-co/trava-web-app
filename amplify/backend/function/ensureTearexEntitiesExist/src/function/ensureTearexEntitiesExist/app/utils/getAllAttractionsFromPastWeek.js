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
const ApiClient_1 = __importDefault(require("./ApiClient"));
const getAllPaginatedData_1 = __importDefault(require("./getAllPaginatedData"));
const lambda_1 = require("shared-types/graphql/lambda");
const LIMIT = 500;
const oneWeekAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
};
function getAllAttractionsFromPastWeek() {
    return __awaiter(this, void 0, void 0, function* () {
        const attractions = [];
        yield getAllPaginatedData_1.default((nextToken) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaListAttractions,
                variables: {
                    filter: {
                        deletedAt: { notContains: '' },
                        createdAt: { ge: oneWeekAgo() },
                    },
                    limit: LIMIT,
                    nextToken: nextToken,
                },
            });
            return {
                nextToken: (_a = res.data.listAttractions) === null || _a === void 0 ? void 0 : _a.nextToken,
                data: (_b = res.data.listAttractions) === null || _b === void 0 ? void 0 : _b.items,
            };
        }), (data) => {
            if (!data)
                return;
            data.forEach((item) => {
                if (!item)
                    return;
                attractions.push(item);
            });
        });
        return attractions;
    });
}
exports.default = getAllAttractionsFromPastWeek;
