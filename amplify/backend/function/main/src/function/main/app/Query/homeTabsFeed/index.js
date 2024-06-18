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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const dayjs_1 = __importDefault(require("dayjs"));
const getFollowsIds_1 = __importDefault(require("./getFollowsIds"));
const getViewedPosts_1 = __importDefault(require("./getViewedPosts"));
const getPostsByUsers_1 = __importDefault(require("./getPostsByUsers"));
const getBlockedUsersIds_1 = __importDefault(require("../../utils/getBlockedUsersIds"));
const homeTabsFeed = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    ApiClient_1.default.get().useIamAuth();
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED);
    }
    const gtTimestampForData = (0, dayjs_1.default)().subtract(180, 'day').toISOString(); // data (Posts, UserPosts) will be retrieved for the last 180 days
    // 1. get following users
    const followsIds = yield (0, getFollowsIds_1.default)(event.identity.sub);
    // 2. get blocked users
    const { blockedByIds, blocksIds } = yield (0, getBlockedUsersIds_1.default)(event.identity.sub);
    // 3. get viewed posts data from past 180 days
    const viewedPostsIds = yield (0, getViewedPosts_1.default)(event.identity.sub, gtTimestampForData);
    // 4. for each following user get his posts created within past 180 days
    const postsByUsers = yield (0, getPostsByUsers_1.default)(followsIds, viewedPostsIds, gtTimestampForData);
    // 5. group posts into stories by user by trip
    const postsByUserGroupedByTrip = (0, lodash_groupby_1.default)(postsByUsers.flat(), (post) => `${post.userId}#${post.tripId}`);
    // 6. filter stories (don't show stories with all viewed posts and posts by blocked users), sort stories by newest post within story
    const filteredByViewedEntireStorySortedByNewestPostWithinStories = (_c = (_b = (_a = Object.entries(postsByUserGroupedByTrip)) === null || _a === void 0 ? void 0 : _a.filter((story) => story[1].some((post) => !blockedByIds.includes(post.userId) && !blocksIds.includes(post.userId)))) === null || _b === void 0 ? void 0 : _b.filter((story) => story[1].some((post) => !post.viewed))) === null || _c === void 0 ? void 0 : _c.sort((a, b) => ((0, dayjs_1.default)(b[1][0].createdAt).isAfter((0, dayjs_1.default)(a[1][0].createdAt)) ? 1 : -1));
    return {
        __typename: 'HomeTabsFeedResponse',
        stories: filteredByViewedEntireStorySortedByNewestPostWithinStories.map((el) => ({
            __typename: 'Story',
            storyId: el[0],
            story: el[1],
        })),
    };
});
exports.default = homeTabsFeed;
