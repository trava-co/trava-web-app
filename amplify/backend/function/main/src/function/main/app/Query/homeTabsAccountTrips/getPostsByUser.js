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
const notEmpty_1 = __importDefault(require("../../utils/notEmpty"));
const API_1 = require("shared-types/API");
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const get_trip_date_range_1 = __importDefault(require("./utils/get-trip-date-range"));
const get_destinations_string_1 = __importDefault(require("./utils/get-destinations-string"));
const constants_1 = require("./utils/constants");
const getPostsByUser = (userId, viewedPostsIds, gtTimestampForData) => __awaiter(void 0, void 0, void 0, function* () {
    const postsByUser = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaHomeTabsAccountTripsGetPosts,
            variables: {
                id: userId,
                postsNextToken: nextToken,
                postsLimit: 50,
                createdDateGTTimestamp: gtTimestampForData,
            },
        });
        return {
            nextToken: (_b = (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a, _b;
        (_b = (_a = data === null || data === void 0 ? void 0 : data.getUser) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.items.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
            if (item)
                postsByUser.push({
                    __typename: 'PostWithinStoryAccountTrips',
                    id: item.id,
                    createdAt: item.createdAt,
                    userId: userId,
                    tripId: item.tripId,
                    membersLength: ((_c = (_b = (_a = item.trip) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    description: item.description || '',
                    cloudinaryUrl: item.cloudinaryUrl || '',
                    avatar: ((_d = data === null || data === void 0 ? void 0 : data.getUser) === null || _d === void 0 ? void 0 : _d.avatar) || null,
                    // check if post creator still belongs to a trip
                    username: (((_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.trip) === null || _e === void 0 ? void 0 : _e.members) === null || _f === void 0 ? void 0 : _f.items) === null || _g === void 0 ? void 0 : _g.map((el) => el === null || el === void 0 ? void 0 : el.userId)) || []).indexOf(userId) > -1
                        ? ((_h = data === null || data === void 0 ? void 0 : data.getUser) === null || _h === void 0 ? void 0 : _h.username) || ''
                        : ((_j = data === null || data === void 0 ? void 0 : data.getUser) === null || _j === void 0 ? void 0 : _j.username) + constants_1.HAS_LEFT_THE_TRIP,
                    authorPublic: ((_k = data === null || data === void 0 ? void 0 : data.getUser) === null || _k === void 0 ? void 0 : _k.privacy) === API_1.PRIVACY.PUBLIC,
                    viewed: (viewedPostsIds === null || viewedPostsIds === void 0 ? void 0 : viewedPostsIds.indexOf(item.id)) > -1,
                    dateRange: (0, get_trip_date_range_1.default)(((_o = (_m = (_l = item.trip) === null || _l === void 0 ? void 0 : _l.tripDestinations) === null || _m === void 0 ? void 0 : _m.items) === null || _o === void 0 ? void 0 : _o.filter(notEmpty_1.default).map((el) => ({
                        startDate: el.startDate,
                        endDate: el.endDate,
                    }))) || []),
                    destinations: (0, get_destinations_string_1.default)(((_r = (_q = (_p = item.trip) === null || _p === void 0 ? void 0 : _p.tripDestinations) === null || _q === void 0 ? void 0 : _q.items) === null || _r === void 0 ? void 0 : _r.filter(notEmpty_1.default).map((el) => {
                        var _a;
                        return ({
                            startDate: el.startDate,
                            endDate: el.endDate,
                            name: ((_a = el.destination) === null || _a === void 0 ? void 0 : _a.name) || '',
                        });
                    })) || []),
                    destinationId: ((_s = item.destination) === null || _s === void 0 ? void 0 : _s.id) || null,
                    destinationIcon: ((_t = item.destination) === null || _t === void 0 ? void 0 : _t.icon) || '',
                    destinationState: ((_u = item.destination) === null || _u === void 0 ? void 0 : _u.state) || '',
                    destinationCountry: ((_v = item.destination) === null || _v === void 0 ? void 0 : _v.country) || '',
                    destinationCoverImage: ((_w = item.destination) === null || _w === void 0 ? void 0 : _w.coverImage) || null,
                    destinationName: ((_x = item.destination) === null || _x === void 0 ? void 0 : _x.name) || null,
                    destinationGooglePlaceId: ((_y = item.destination) === null || _y === void 0 ? void 0 : _y.googlePlaceId) || null,
                    attractionId: item.attractionId || null,
                    attractionName: ((_z = item.attraction) === null || _z === void 0 ? void 0 : _z.name) || null,
                    attractionImage: ((_1 = (_0 = item.attraction) === null || _0 === void 0 ? void 0 : _0.images) === null || _1 === void 0 ? void 0 : _1[0]) || null,
                    likesCount: (_2 = item.likesCount) !== null && _2 !== void 0 ? _2 : 0,
                    commentsCount: (_3 = item.commentsCount) !== null && _3 !== void 0 ? _3 : 0,
                    mediaType: item.mediaType,
                    videoDuration: item.videoDuration,
                });
        });
    });
    return postsByUser;
});
exports.default = getPostsByUser;
