"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const dayjs_1 = __importDefault(require("dayjs"));
const getViewedPosts_1 = __importDefault(require("./getViewedPosts"));
const tearex_1 = __importDefault(require("tearex"));
const getBlockedUsersIds_1 = __importDefault(require("../../utils/getBlockedUsersIds"));
const getTripStoryInfoFromRecommendedPosts_1 = __importDefault(require("./getTripStoryInfoFromRecommendedPosts"));
const getAllPostsFromRecommendedTripStories_1 = __importDefault(require("./getAllPostsFromRecommendedTripStories"));
const getAllPostsFromSharedTripStory_1 = __importStar(require("./getAllPostsFromSharedTripStory"));
const getReferringUserInfo_1 = __importDefault(require("./getReferringUserInfo"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const homeTabsSuggestedFeed = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    ApiClient_1.default.get().useIamAuth();
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED);
    }
    const gtTimestampForData = (0, dayjs_1.default)().subtract(180, 'day').toISOString(); // data (Posts, UserPosts) will be retrieved for the last 180 days
    const { sharedPostId, referringUserId } = event.arguments.input || {}; // if sharedPostId is provided, we will return this story first, with the shared post displayed first
    // 1a. get blocked users
    const blockedUsersInfo = (0, getBlockedUsersIds_1.default)(event.identity.sub);
    let suggestedFeedResponse = {
        __typename: 'HomeTabsSuggestedFeedResponse',
        stories: null,
        sharedPostError: null,
        referringUserInfo: null,
    };
    // 1b. if sharedPostId is provided, get the trip story info for this post
    let sharedPostTripStoryInfo, sharedPostReferringUserInfo;
    if (sharedPostId && referringUserId) {
        sharedPostTripStoryInfo = (0, getAllPostsFromSharedTripStory_1.default)(sharedPostId, event.identity.sub);
        sharedPostTripStoryInfo.catch((e) => {
            if (e instanceof getAllPostsFromSharedTripStory_1.SharedPostError) {
                suggestedFeedResponse.sharedPostError = Object.assign(Object.assign({}, e), { __typename: 'SharedPostError' });
            }
            else {
                throw e;
            }
        });
        sharedPostReferringUserInfo = (0, getReferringUserInfo_1.default)(referringUserId);
        sharedPostReferringUserInfo.catch();
    }
    // 2a. tearex returns individual post recommendations that this user hasn't seen yet
    const recommendations = yield tearex_1.default.recommend({
        id: event.identity.sub,
        label: 'User',
    }, 'Post', { limit: 250 });
    // 3. identify all trip stories associated with these recommended posts, as well as the average score of unwatched posts in each trip story
    // 4. get viewed posts data from past 180 days
    const [tripStoryInfo, viewedPostsIds] = yield Promise.all([
        (0, getTripStoryInfoFromRecommendedPosts_1.default)(recommendations, gtTimestampForData),
        (0, getViewedPosts_1.default)(event.identity.sub, gtTimestampForData),
    ]);
    // 5. for each tripStory, get all posts from past 180 days
    const postsByUsers = yield (0, getAllPostsFromRecommendedTripStories_1.default)(tripStoryInfo, viewedPostsIds, gtTimestampForData);
    // 6. group posts into stories by user by trip
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const postsByUserGroupedByTrip = (0, lodash_groupby_1.default)(postsByUsers.flat(), (post) => `${post.userId}#${post.tripId}`);
    // ensure blockedUsersInfo is resolved
    const { blockedByIds, blocksIds } = yield blockedUsersInfo;
    // 7. filter stories (don't show stories with all viewed posts and posts by blocked users), don't show posts created by the current user
    const filteredByViewedEntireStorySortedByHighestAverageScore = (_c = (_b = (_a = Object.entries(postsByUserGroupedByTrip)) === null || _a === void 0 ? void 0 : _a.filter((story) => story[1].some((post) => !blockedByIds.includes(post.userId) && !blocksIds.includes(post.userId)))) === null || _b === void 0 ? void 0 : _b.filter((story) => story[1].some((post) => !post.viewed && post.userId !== event.identity.sub && !post.deletedAt))) === null || _c === void 0 ? void 0 : _c.sort((a, b) => (tripStoryInfo[a[0]].averageScore > tripStoryInfo[b[0]].averageScore ? -1 : 1));
    suggestedFeedResponse.stories = filteredByViewedEntireStorySortedByHighestAverageScore.map((el) => ({
        __typename: 'Story',
        storyId: el[0],
        story: el[1],
    }));
    // 8. if sharedPostId is provided, return this story first
    if (sharedPostId) {
        // 8a. get the referring user's info
        try {
            const referringUserInfo = yield sharedPostReferringUserInfo;
            const { id, avatar, username } = referringUserInfo || {};
            if (id && username) {
                suggestedFeedResponse.referringUserInfo = { id, avatar, username, __typename: 'ReferringUserInfo' };
            }
        }
        catch (e) {
            console.log('Error with sharedPostReferringUserInfo 1', e);
        }
        // 8b. get the story info for this post
        try {
            const storyInfo = yield sharedPostTripStoryInfo;
            const storyAuthorId = (_e = (_d = storyInfo === null || storyInfo === void 0 ? void 0 : storyInfo.story) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.userId;
            const storyTripId = (_g = (_f = storyInfo === null || storyInfo === void 0 ? void 0 : storyInfo.story) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.tripId;
            const storyAuthorUsername = (_j = (_h = storyInfo === null || storyInfo === void 0 ? void 0 : storyInfo.story) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.username;
            const storyAuthorAvatar = (_l = (_k = storyInfo === null || storyInfo === void 0 ? void 0 : storyInfo.story) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.avatar;
            // if story already in suggested feed, remove it from there
            suggestedFeedResponse.stories = (_m = suggestedFeedResponse.stories) === null || _m === void 0 ? void 0 : _m.filter((story) => (story === null || story === void 0 ? void 0 : story.storyId) !== `${storyAuthorId}#${storyTripId}`);
            // if requesting user or author of shared post is blocked, throw error
            if (storyAuthorId) {
                if (blockedByIds.includes(storyAuthorId)) {
                    throw new getAllPostsFromSharedTripStory_1.SharedPostError(API_1.SHARED_POST_ERROR_TYPE.BLOCKED_USER);
                }
                else if (blocksIds.includes(storyAuthorId)) {
                    throw new getAllPostsFromSharedTripStory_1.SharedPostError(API_1.SHARED_POST_ERROR_TYPE.BLOCKED_AUTHOR, storyAuthorId, storyAuthorUsername !== null && storyAuthorUsername !== void 0 ? storyAuthorUsername : undefined, storyAuthorAvatar !== null && storyAuthorAvatar !== void 0 ? storyAuthorAvatar : undefined);
                }
            }
            // ensure story contains at least one post
            if (storyInfo && storyInfo.story.length && storyAuthorId) {
                (_o = suggestedFeedResponse.stories) === null || _o === void 0 ? void 0 : _o.unshift(storyInfo);
            }
        }
        catch (e) {
            console.log('Error with sharedPostTripStoryInfo 2', e);
            // if error is of type SHARED_POST_ERROR, assign to suggestedFeedResponse.error
            if (e instanceof getAllPostsFromSharedTripStory_1.SharedPostError) {
                suggestedFeedResponse.sharedPostError = Object.assign(Object.assign({}, e), { __typename: 'SharedPostError' });
            }
        }
    }
    return suggestedFeedResponse;
});
exports.default = homeTabsSuggestedFeed;
