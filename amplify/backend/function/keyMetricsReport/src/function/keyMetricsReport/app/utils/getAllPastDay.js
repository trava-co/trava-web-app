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
    console.log(`getting all users created in past day`);
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
    console.log(`getting all attraction swipes in past day`);
    const attractionSwipes = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListAttractionSwipesByUpdatedAt,
            variables: {
                nextToken,
                label: API_1.AttractionSwipeLabel.SWIPE,
                updatedAt: { ge: yesterday() },
                limit: 500,
            },
        });
        return {
            nextToken: (_b = res.data.privateListAttractionSwipesByUpdatedAt) === null || _b === void 0 ? void 0 : _b.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.privateListAttractionSwipesByUpdatedAt) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (item) {
                attractionSwipes.push({
                    userId: item.userId,
                    user: {
                        username: (_b = (_a = item.user) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : '',
                        name: (_d = (_c = item.user) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                        email: (_f = (_e = item.user) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : '',
                    },
                    destinationId: item.destinationId,
                    destination: {
                        name: (_h = (_g = item.destination) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : item.destinationId,
                    },
                });
            }
        });
    });
    console.log(`attractionSwipes length: ${attractionSwipes.length}\n`);
    return attractionSwipes;
});
exports.getAllAttractionSwipesPastDay = getAllAttractionSwipesPastDay;
// attractions created
const getAllAttractionsCreatedPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`getting all attractions created in past day`);
    const attractionsCreated = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const result = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListAttractionsByCreatedAt,
            variables: {
                nextToken,
                label: API_1.AttractionLabel.ATTRACTION,
                createdAt: { ge: yesterday() },
                limit: 500,
            },
        });
        return {
            nextToken: (_c = result.data.privateListAttractionsByCreatedAt) === null || _c === void 0 ? void 0 : _c.nextToken,
            data: result.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.privateListAttractionsByCreatedAt) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (item) {
                attractionsCreated.push({
                    id: item.id,
                    name: item.name,
                    authorId: item.authorId,
                    author: {
                        username: (_b = (_a = item.author) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : '',
                        name: (_d = (_c = item.author) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '',
                        email: (_f = (_e = item.author) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : '',
                    },
                    authorType: item.authorType,
                    destinationId: item.destinationId,
                    destination: {
                        name: (_h = (_g = item.destination) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : item.destinationId,
                    },
                });
            }
        });
    });
    console.log(`attractions created length ${attractionsCreated.length} \n`);
    return attractionsCreated;
});
exports.getAllAttractionsCreatedPastDay = getAllAttractionsCreatedPastDay;
// itineraries viewed in past 24 hours
// get all trip destination users with tripPlanViewwedAt > 24 hours ago
const getAllItineraryViewsPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`getting all itinerary views in past day`);
    const itineraries = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
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
            nextToken: (_d = res.data.privateListTripDestinationUsers) === null || _d === void 0 ? void 0 : _d.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.privateListTripDestinationUsers) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            if (item)
                itineraries.push(item);
        });
    });
    console.log(`itinerary views: ${itineraries.length} \n`);
    return itineraries;
});
exports.getAllItineraryViewsPastDay = getAllItineraryViewsPastDay;
const getAllAppSessionsPastDay = () => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = [];
    yield getAllPaginatedData_1.default((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListUserSessionsByCreatedAt,
            variables: {
                nextToken,
                label: API_1.UserSessionLabel.SESSION,
                createdAt: { ge: yesterday() },
                limit: 500,
            },
        });
        return {
            nextToken: (_e = res.data.privateListUserSessionsByCreatedAt) === null || _e === void 0 ? void 0 : _e.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.privateListUserSessionsByCreatedAt) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            if (item)
                sessions.push(item);
        });
    });
    console.log(`sessions: ${sessions.length} \n`);
    return sessions;
});
exports.getAllAppSessionsPastDay = getAllAppSessionsPastDay;
