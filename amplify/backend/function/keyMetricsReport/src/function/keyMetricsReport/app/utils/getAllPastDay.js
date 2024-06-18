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
exports.getAllAppSessionsPastDay = exports.getAllItineraryViewsPastDay = exports.getAllAttractionsCreatedPastDay = exports.getAllAttractionSwipesPastDay = exports.getAllUsersPastDay = void 0;
const API_1 = require("shared-types/API");
const getAllPaginatedData_1 = __importDefault(require("./getAllPaginatedData"));
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const tz = 'America/New_York';
// 24 hours ago from the current time, in eastern time, accounting for daylight savings period during year
const yesterday = () => {
    const date = dayjs_1.default().tz(tz).subtract(24, 'hour');
    return date.toISOString();
};
const getAllUsersPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaListUsers,
            variables: {
                nextToken,
                limit: 500,
                filter: {
                    createdAt: { ge: yesterday() },
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
exports.getAllUsersPastDay = getAllUsersPastDay;
const getAllAttractionSwipesPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const result = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateListAttractionSwipesByUpdatedAt,
        variables: {
            label: API_1.AttractionSwipeLabel.SWIPE,
            updatedAt: { ge: yesterday() },
        },
    });
    console.log(`result: ${JSON.stringify(result, null, 2)}\n`);
    return (_d = (_c = (_b = result.data) === null || _b === void 0 ? void 0 : _b.privateListAttractionSwipesByUpdatedAt) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [];
});
exports.getAllAttractionSwipesPastDay = getAllAttractionSwipesPastDay;
// attractions created
const getAllAttractionsCreatedPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    console.log(`getting all attractions created in past day`);
    const result = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateListAttractionsByCreatedAt,
        variables: {
            label: API_1.AttractionLabel.ATTRACTION,
            createdAt: { ge: yesterday() },
        },
    });
    console.log(`result: ${JSON.stringify(result, null, 2)}\n`);
    return (_g = (_f = (_e = result.data) === null || _e === void 0 ? void 0 : _e.privateListAttractionsByCreatedAt) === null || _f === void 0 ? void 0 : _f.items) !== null && _g !== void 0 ? _g : [];
});
exports.getAllAttractionsCreatedPastDay = getAllAttractionsCreatedPastDay;
// itineraries viewed in past 24 hours
// get all trip destination users with tripPlanViewwedAt > 24 hours ago
const getAllItineraryViewsPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`yesterday: ${yesterday()}`);
    const itineraries = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _h;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListTripDestinationUsers,
            variables: {
                nextToken,
                limit: 500,
                filter: {
                    tripPlanViewedAt: { ge: yesterday() },
                },
            },
        });
        return {
            nextToken: (_h = res.data.privateListTripDestinationUsers) === null || _h === void 0 ? void 0 : _h.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.privateListTripDestinationUsers) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            if (item)
                itineraries.push(item);
        });
    });
    console.log(`result: ${JSON.stringify(itineraries, null, 2)}\n`);
    return itineraries;
});
exports.getAllItineraryViewsPastDay = getAllItineraryViewsPastDay;
const getAllAppSessionsPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    const result = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateListUserSessionsByCreatedAt,
        variables: {
            label: API_1.UserSessionLabel.SESSION,
            createdAt: { ge: yesterday() },
        },
    });
    console.log(`result: ${JSON.stringify(result, null, 2)}\n`);
    return (_l = (_k = (_j = result.data) === null || _j === void 0 ? void 0 : _j.privateListUserSessionsByCreatedAt) === null || _k === void 0 ? void 0 : _k.items) !== null && _l !== void 0 ? _l : [];
});
exports.getAllAppSessionsPastDay = getAllAppSessionsPastDay;
