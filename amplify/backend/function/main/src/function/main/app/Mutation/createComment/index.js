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
const getTableName_1 = __importDefault(require("../../utils/getTableName"));
const dbClient_1 = __importDefault(require("../../utils/dbClient"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const uuid = __importStar(require("uuid"));
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getFollowsIds_1 = __importDefault(require("../../Query/homeTabsFeed/getFollowsIds"));
const createComment = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log('createComment');
    ApiClient_1.default.get().useIamAuth();
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_COMMENT);
    }
    const commentTableName = (0, getTableName_1.default)(process.env.API_TRAVA_COMMENTTABLE_NAME);
    const postTableName = (0, getTableName_1.default)(process.env.API_TRAVA_POSTTABLE_NAME);
    // Check if I can leave a comment
    // 1. Get post
    const getPost = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaHomeTabsFeedPostCommentsCreateCommentGetPost,
        variables: {
            id: event.arguments.input.postId,
        },
    });
    const post = (_a = getPost === null || getPost === void 0 ? void 0 : getPost.data) === null || _a === void 0 ? void 0 : _a.privateGetPost;
    if (!post) {
        throw new Error('no post');
    }
    // 2. check if I am post creator
    if (event.identity.sub !== post.userId) {
        // check if user is public
        const user = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetUserPrivacy,
            variables: {
                userId: post.userId,
            },
        });
        if (((_c = (_b = user === null || user === void 0 ? void 0 : user.data) === null || _b === void 0 ? void 0 : _b.getUser) === null || _c === void 0 ? void 0 : _c.privacy) === API_1.PRIVACY.PRIVATE) {
            // check if I follow this userId
            const followsIds = yield (0, getFollowsIds_1.default)(event.identity.sub);
            if (followsIds.indexOf(post.userId) === -1) {
                throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_COMMENT);
            }
        }
    }
    const now = new Date();
    const newCommentId = uuid.v4();
    yield dbClient_1.default
        .transactWrite({
        TransactItems: [
            // 1. create Comment
            {
                Put: {
                    TableName: commentTableName,
                    Item: {
                        id: newCommentId,
                        userId: event.identity.sub,
                        postId: event.arguments.input.postId,
                        text: event.arguments.input.text,
                        updatedAt: now.toISOString(),
                        createdAt: now.toISOString(),
                        __typename: 'Comment',
                    },
                },
            },
            // 2. increment commentsCount field in Post
            {
                Update: {
                    ExpressionAttributeNames: { '#commentsCount': 'commentsCount' },
                    ExpressionAttributeValues: {
                        ':value': 1,
                    },
                    Key: {
                        id: event.arguments.input.postId,
                    },
                    TableName: postTableName,
                    UpdateExpression: 'ADD #commentsCount :value',
                },
            },
        ],
    })
        .promise();
    // create notification
    if (event.identity.sub !== post.userId) {
        yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateNotification,
            variables: {
                input: {
                    showInApp: 1,
                    receiverUserId: post.userId,
                    senderUserId: event.identity.sub,
                    type: API_1.NOTIFICATION_TYPE.COMMENT_POST,
                    commentId: newCommentId,
                    postId: event.arguments.input.postId,
                    tripId: post.tripId,
                },
            },
        });
    }
    return true;
});
exports.default = createComment;
