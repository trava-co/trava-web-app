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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getFollowsIds_1 = __importDefault(require("../homeTabsFeed/getFollowsIds"));
const notEmpty_1 = __importDefault(require("../../utils/notEmpty"));
const getBlockedUsersIds_1 = __importDefault(require("../../utils/getBlockedUsersIds"));
const homeTabsFeedPostComments = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_POST_COMMENTS);
    }
    // Get post
    const getPost = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaHomeTabsFeedPostCommentsGetPost,
        variables: {
            id: event.arguments.input.postId,
        },
    });
    const post = (_a = getPost === null || getPost === void 0 ? void 0 : getPost.data) === null || _a === void 0 ? void 0 : _a.privateGetPost;
    if (!post) {
        throw new Error('no post');
    }
    // check if I am post creator
    if (event.identity.sub !== post.userId) {
        // check if user is public
        const user = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetUserPrivacy,
            variables: {
                userId: post.userId,
            },
        });
        if (((_c = (_b = user === null || user === void 0 ? void 0 : user.data) === null || _b === void 0 ? void 0 : _b.getUser) === null || _c === void 0 ? void 0 : _c.privacy) === API_1.PRIVACY.PRIVATE) {
            // check if I follow post creator
            const followsIds = yield (0, getFollowsIds_1.default)(event.identity.sub);
            if (followsIds.indexOf(post.userId) === -1) {
                throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_POST_COMMENTS);
            }
        }
    }
    // get blocked users
    const { blockedByIds, blocksIds } = yield (0, getBlockedUsersIds_1.default)(event.identity.sub);
    return {
        __typename: 'HomeTabsFeedPostCommentsResponse',
        id: post.id,
        userId: post.userId,
        tripId: post.tripId,
        username: ((_d = post.user) === null || _d === void 0 ? void 0 : _d.username) || '',
        membersLength: ((_g = (_f = (_e = post.trip) === null || _e === void 0 ? void 0 : _e.members) === null || _f === void 0 ? void 0 : _f.items) === null || _g === void 0 ? void 0 : _g.length) || 0,
        avatar: (_h = post.user) === null || _h === void 0 ? void 0 : _h.avatar,
        description: post.description,
        comments: (_k = (_j = post.comments) === null || _j === void 0 ? void 0 : _j.items) === null || _k === void 0 ? void 0 : _k.filter(notEmpty_1.default).filter((comment) => !blockedByIds.includes(comment.userId) && !blocksIds.includes(comment.userId)).map((comment) => {
            var _a, _b;
            return ({
                __typename: 'HomeTabsFeedPostCommentsResponseComment',
                id: comment.id,
                userId: comment.userId,
                username: ((_a = comment.user) === null || _a === void 0 ? void 0 : _a.username) || '',
                avatar: (_b = comment.user) === null || _b === void 0 ? void 0 : _b.avatar,
                text: comment.text,
                updatedAt: comment.updatedAt,
            });
        }),
    };
});
exports.default = homeTabsFeedPostComments;
