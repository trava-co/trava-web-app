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
const getTableName_1 = __importDefault(require("../../utils/getTableName"));
const dbClient_1 = __importDefault(require("../../utils/dbClient"));
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const likeDislikePost = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('likeDislikePost');
    ApiClient_1.default.get().useIamAuth();
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_LIKE_DISLIKE_POST);
    }
    if (event.identity.sub !== event.arguments.input.userId)
        throw new Error('Wrong user');
    const userPostLikeTableName = (0, getTableName_1.default)(process.env.API_TRAVA_USERPOSTLIKETABLE_NAME);
    const postTableName = (0, getTableName_1.default)(process.env.API_TRAVA_POSTTABLE_NAME);
    const getPost = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetPostLikeDislikePost,
        variables: {
            id: event.arguments.input.postId,
        },
    });
    const post = (_a = getPost === null || getPost === void 0 ? void 0 : getPost.data) === null || _a === void 0 ? void 0 : _a.privateGetPost;
    if (!post) {
        throw new Error('no post');
    }
    const userPostLikeItem = {
        userId: event.arguments.input.userId,
        postId: event.arguments.input.postId,
    };
    const now = new Date();
    const transactPartCreateDeleteUserPostLike = {
        [API_1.LIKE_DISLIKE_ACTION_INPUT.ADD]: {
            Put: {
                TableName: userPostLikeTableName,
                ConditionExpression: 'attribute_not_exists(#pk)',
                ExpressionAttributeNames: { '#pk': 'userId' },
                Item: Object.assign(Object.assign({}, userPostLikeItem), { updatedAt: now.toISOString(), createdAt: now.toISOString(), __typename: 'UserPostLike' }),
            },
        },
        [API_1.LIKE_DISLIKE_ACTION_INPUT.REMOVE]: {
            Delete: {
                TableName: userPostLikeTableName,
                ConditionExpression: 'attribute_exists(#pk)',
                ExpressionAttributeNames: { '#pk': 'userId' },
                Key: userPostLikeItem,
            },
        },
    };
    yield dbClient_1.default
        .transactWrite({
        TransactItems: [
            Object.assign({}, transactPartCreateDeleteUserPostLike[event.arguments.input.action]),
            // 2. increment / decrement likesCount field in Post
            {
                Update: {
                    ExpressionAttributeNames: { '#likesCount': 'likesCount' },
                    ExpressionAttributeValues: {
                        ':value': event.arguments.input.action === API_1.LIKE_DISLIKE_ACTION_INPUT.ADD ? 1 : -1,
                    },
                    Key: {
                        id: event.arguments.input.postId,
                    },
                    TableName: postTableName,
                    UpdateExpression: 'ADD #likesCount :value',
                },
            },
        ],
    })
        .promise();
    // create notification
    if (event.arguments.input.action === API_1.LIKE_DISLIKE_ACTION_INPUT.ADD && post.userId !== event.identity.sub) {
        yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateNotification,
            variables: {
                input: {
                    showInApp: 1,
                    receiverUserId: post.userId,
                    senderUserId: event.identity.sub,
                    type: API_1.NOTIFICATION_TYPE.LIKE_POST,
                    postId: event.arguments.input.postId,
                },
            },
        });
    }
    return true;
});
exports.default = likeDislikePost;
