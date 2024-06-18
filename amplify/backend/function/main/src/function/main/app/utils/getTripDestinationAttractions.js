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
const TRIP_DESTINATION_ATTRACTIONS_LIMIT = 1000;
function getTripDestinationAttractionIds(variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const attractionIds = [];
        yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaGetTripDestinationAttractionsByTripByDestination,
                variables: {
                    tripId: variables.tripId,
                    destinationId: variables.destinationId,
                    userId: variables.userId,
                    attractionsLimit: TRIP_DESTINATION_ATTRACTIONS_LIMIT,
                    attractionsNextToken: nextToken,
                },
            });
            return {
                nextToken: (_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.userTrips) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.trip) === null || _e === void 0 ? void 0 : _e.tripDestinations) === null || _f === void 0 ? void 0 : _f.items) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.tripDestinationAttractions) === null || _j === void 0 ? void 0 : _j.nextToken,
                data: (_t = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = res.data.getUser) === null || _k === void 0 ? void 0 : _k.userTrips) === null || _l === void 0 ? void 0 : _l.items) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.trip) === null || _p === void 0 ? void 0 : _p.tripDestinations) === null || _q === void 0 ? void 0 : _q.items) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.tripDestinationAttractions) === null || _t === void 0 ? void 0 : _t.items,
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
exports.default = getTripDestinationAttractionIds;
