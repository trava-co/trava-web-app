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
exports.SharedPostError = void 0;
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const constants_1 = require("../homeTabsAccountTrips/utils/constants");
class SharedPostError extends Error {
    constructor(type, authorId, authorUsername, authorAvatar) {
        super();
        this.type = type;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.authorAvatar = authorAvatar;
    }
}
exports.SharedPostError = SharedPostError;
const getAllPostsFromSharedTripStory = (postId, requestingUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const res = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateGetStoryAndAuthorInfoFromPost,
        variables: {
            id: postId,
        },
    });
    const sharedPost = res.data.privateGetPost;
    if (!sharedPost) {
        throw new SharedPostError(API_1.SHARED_POST_ERROR_TYPE.POST_NOT_FOUND);
    }
    if (sharedPost === null || sharedPost === void 0 ? void 0 : sharedPost.deletedAt) {
        throw new SharedPostError(API_1.SHARED_POST_ERROR_TYPE.POST_DELETED);
    }
    if (((_a = sharedPost.user) === null || _a === void 0 ? void 0 : _a.privacy) === API_1.PRIVACY.PRIVATE && sharedPost.userId !== requestingUserId) {
        // if the post is not public, and it's not requesting user's post, check if the requesting user is following the post's user
        const userFollowResponse = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateGetUserFollow,
            variables: {
                userId: requestingUserId,
                followedUserId: sharedPost === null || sharedPost === void 0 ? void 0 : sharedPost.userId,
            },
        });
        const userFollowByMe = userFollowResponse.data.getUserFollow;
        if (!(userFollowByMe === null || userFollowByMe === void 0 ? void 0 : userFollowByMe.followedUserId) || !userFollowByMe.approved) {
            throw new SharedPostError(API_1.SHARED_POST_ERROR_TYPE.PRIVATE_POST, sharedPost.userId, (_c = (_b = sharedPost === null || sharedPost === void 0 ? void 0 : sharedPost.user) === null || _b === void 0 ? void 0 : _b.username) !== null && _c !== void 0 ? _c : undefined, (_e = (_d = sharedPost === null || sharedPost === void 0 ? void 0 : sharedPost.user) === null || _d === void 0 ? void 0 : _d.avatar) !== null && _e !== void 0 ? _e : undefined);
        }
    }
    const postsPromisesByRecommendation = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListPostsBySharedStory,
            variables: {
                tripId: sharedPost.tripId,
                userId: { eq: sharedPost.userId },
                postsNextToken: nextToken,
                postsLimit: 50,
            },
        });
        return {
            nextToken: (_f = res.data.privateListPostsByTripByUser) === null || _f === void 0 ? void 0 : _f.nextToken,
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
                    viewed: post.createdAt < sharedPost.createdAt,
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
    const story = {
        __typename: 'Story',
        storyId: `${sharedPost.userId}#${sharedPost.tripId}`,
        story: sortedPostPromisesByRecommendationNewestFirst,
    };
    return story;
});
exports.default = getAllPostsFromSharedTripStory;
