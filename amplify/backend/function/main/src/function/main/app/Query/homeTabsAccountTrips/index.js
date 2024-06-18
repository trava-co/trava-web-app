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
const getViewedPosts_1 = __importDefault(require("../homeTabsFeed/getViewedPosts"));
const getPostsByUser_1 = __importDefault(require("./getPostsByUser"));
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const homeTabsAccountTrips = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    ApiClient_1.default.get().useIamAuth();
    if (!((_a = event.arguments.input) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new Error('Wrong parameters');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_ACCOUNT_TRIPS);
    }
    // TODO: Add authorization checks (if account is private, if I follow this account, if I am this account, if account is public)
    const gtTimestampForData = (0, dayjs_1.default)().subtract(360, 'day').toISOString(); // data (UserPosts) will be retrieved for the last 360 days
    // 1. get viewed posts data
    const viewedPostsIds = yield (0, getViewedPosts_1.default)(event.identity.sub, gtTimestampForData);
    // 2. get posts by user
    const postsByUser = yield (0, getPostsByUser_1.default)(event.arguments.input.id, viewedPostsIds, gtTimestampForData);
    // 3. group posts into stories by trip
    const postsByTrip = (0, lodash_groupby_1.default)(postsByUser, (post) => `${post.userId}#${post.tripId}`);
    // 4. sort stories by newest post within story
    const sortedByNewestPostWithinStories = (_b = Object.entries(postsByTrip)) === null || _b === void 0 ? void 0 : _b.sort((a, b) => (0, dayjs_1.default)(b[1][0].createdAt).isAfter((0, dayjs_1.default)(a[1][0].createdAt)) ? 1 : -1);
    return {
        __typename: 'HomeTabsAccountTripsResponse',
        stories: sortedByNewestPostWithinStories.map((el) => ({
            __typename: 'StoryAccountTrips',
            storyId: el[0],
            story: el[1],
        })),
    };
});
exports.default = homeTabsAccountTrips;
