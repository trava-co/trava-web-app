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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const getAllPaginatedData_1 = __importDefault(require("./getAllPaginatedData"));
const ATTRACTION_SWIPES_BY_USER_LIMIT = 20;
function getUserAttractionSwipes(variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const attractionIds = [];
        yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaGetUserAttractionSwipes,
                variables: Object.assign(Object.assign({}, variables), { attractionSwipesByUserLimit: ATTRACTION_SWIPES_BY_USER_LIMIT, attractionSwipesByUserNextToken: nextToken }),
            });
            return {
                nextToken: (_f = (_e = (_d = (_c = (_b = (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.userTrips) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.trip) === null || _e === void 0 ? void 0 : _e.attractionSwipesByUser) === null || _f === void 0 ? void 0 : _f.nextToken,
                data: (_m = (_l = (_k = (_j = (_h = (_g = res.data.getUser) === null || _g === void 0 ? void 0 : _g.userTrips) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.trip) === null || _l === void 0 ? void 0 : _l.attractionSwipesByUser) === null || _m === void 0 ? void 0 : _m.items,
            };
        }), (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((item) => {
                if (item === null || item === void 0 ? void 0 : item.attractionId)
                    attractionIds.push(item.attractionId);
            });
        });
        return attractionIds;
    });
}
exports.default = getUserAttractionSwipes;
