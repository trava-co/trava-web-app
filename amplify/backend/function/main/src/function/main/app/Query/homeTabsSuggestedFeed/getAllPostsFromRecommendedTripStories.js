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
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const constants_1 = require("../homeTabsAccountTrips/utils/constants");
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const getAllPostsFromRecommendedTripStories = (tripStoryInfoDictionary, viewedPostsIds, gtTimestampForData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postsPromises = (_a = Object.values(tripStoryInfoDictionary)) === null || _a === void 0 ? void 0 : _a.map((tripStory) => __awaiter(void 0, void 0, void 0, function* () {
        const postsPromisesByRecommendation = [];
        yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaPrivateListPostsByTrip,
                variables: {
                    tripId: tripStory.tripId,
                    userId: { eq: tripStory.userId },
                    postsNextToken: nextToken,
                    postsLimit: 50,
                    createdDateGTTimestamp: gtTimestampForData,
                },
            });
            return {
                nextToken: (_b = res.data.privateListPostsByTripByUser) === null || _b === void 0 ? void 0 : _b.nextToken,
                data: res.data,
            };
        }), (data) => {
            var _a, _b;
            (_b = (_a = data === null || data === void 0 ? void 0 : data.privateListPostsByTripByUser) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.forEach((post) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                if (post) {
                    postsPromisesByRecommendation.push({
                        __typename: 'PostWithinStory',
                        id: post.id,
                        createdAt: post.createdAt,
                        userId: post.userId,
                        tripId: post.tripId,
                        membersLength: ((_c = (_b = (_a = post.trip) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.length) || 0,
                        description: post.description || '',
                        cloudinaryUrl: post.cloudinaryUrl || '',
                        avatar: ((_d = post.user) === null || _d === void 0 ? void 0 : _d.avatar) || null,
                        // check if post creator still belongs to a trip
                        username: (((_g = (_f = (_e = post === null || post === void 0 ? void 0 : post.trip) === null || _e === void 0 ? void 0 : _e.members) === null || _f === void 0 ? void 0 : _f.items) === null || _g === void 0 ? void 0 : _g.map((el) => el === null || el === void 0 ? void 0 : el.userId)) || []).indexOf(post.userId) > -1
                            ? ((_h = post.user) === null || _h === void 0 ? void 0 : _h.username) || ''
                            : ((_j = post.user) === null || _j === void 0 ? void 0 : _j.username) + constants_1.HAS_LEFT_THE_TRIP,
                        authorPublic: ((_k = post.user) === null || _k === void 0 ? void 0 : _k.privacy) === API_1.PRIVACY.PUBLIC,
                        viewed: (viewedPostsIds === null || viewedPostsIds === void 0 ? void 0 : viewedPostsIds.indexOf(post.id)) > -1,
                        destinationIcon: ((_l = post.destination) === null || _l === void 0 ? void 0 : _l.icon) || null,
                        destinationCoverImage: ((_m = post.destination) === null || _m === void 0 ? void 0 : _m.coverImage) || null,
                        destinationName: ((_o = post.destination) === null || _o === void 0 ? void 0 : _o.name) || null,
                        destinationState: ((_p = post.destination) === null || _p === void 0 ? void 0 : _p.state) || null,
                        destinationCountry: ((_q = post.destination) === null || _q === void 0 ? void 0 : _q.country) || null,
                        attractionId: post.attractionId || null,
                        attractionName: ((_r = post.attraction) === null || _r === void 0 ? void 0 : _r.name) || null,
                        attractionImage: ((_t = (_s = post.attraction) === null || _s === void 0 ? void 0 : _s.images) === null || _t === void 0 ? void 0 : _t[0]) || null,
                        likesCount: (_u = post.likesCount) !== null && _u !== void 0 ? _u : 0,
                        commentsCount: (_v = post.commentsCount) !== null && _v !== void 0 ? _v : 0,
                        mediaType: post.mediaType,
                        videoDuration: post.videoDuration,
                    });
                }
            });
        });
        const sortedPostPromisesByRecommendationNewestFirst = postsPromisesByRecommendation.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
        return sortedPostPromisesByRecommendationNewestFirst;
    }));
    const posts = yield Promise.all(postsPromises !== null && postsPromises !== void 0 ? postsPromises : []);
    return posts;
});
exports.default = getAllPostsFromRecommendedTripStories;
