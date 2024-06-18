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
const checkForGroup_1 = require("../../utils/checkForGroup");
const addRemoveFromBucketList = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    console.log('addRemoveFromBucketList');
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_BUCKET_LIST);
    }
    const currentAttraction = yield ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: lambda_1.lambdaGetAttraction,
        variables: {
            id: event.arguments.input.attractionId,
        },
    });
    if (event.identity.sub !== event.arguments.input.userId && !(0, checkForGroup_1.checkForGroup)(event, 'admin'))
        throw new Error('Wrong user');
    if (!currentAttraction)
        throw new Error('Attraction not found');
    if (((_b = (_a = currentAttraction.data) === null || _a === void 0 ? void 0 : _a.getAttraction) === null || _b === void 0 ? void 0 : _b.privacy) !== API_1.ATTRACTION_PRIVACY.PUBLIC)
        throw new Error('Cannot add private attraction to a bucket list');
    const userAttractionTableName = (0, getTableName_1.default)(process.env.API_TRAVA_USERATTRACTIONTABLE_NAME);
    const attractionTableName = (0, getTableName_1.default)(process.env.API_TRAVA_ATTRACTIONTABLE_NAME);
    const authorId = (_e = (_d = (_c = currentAttraction.data) === null || _c === void 0 ? void 0 : _c.getAttraction) === null || _d === void 0 ? void 0 : _d.authorId) !== null && _e !== void 0 ? _e : null;
    const userAttractionItem = {
        userId: event.arguments.input.userId,
        attractionId: event.arguments.input.attractionId,
    };
    const now = new Date();
    const transactPartCreateDeleteUserAttraction = {
        [API_1.BUCKET_LIST_ACTION_INPUT.ADD]: {
            Put: {
                TableName: userAttractionTableName,
                ConditionExpression: 'attribute_not_exists(#pk)',
                ExpressionAttributeNames: { '#pk': 'userId' },
                Item: Object.assign(Object.assign({}, userAttractionItem), { authorId, updatedAt: now.toISOString(), createdAt: now.toISOString(), __typename: 'UserAttraction' }),
            },
        },
        [API_1.BUCKET_LIST_ACTION_INPUT.REMOVE]: {
            Delete: {
                TableName: userAttractionTableName,
                ConditionExpression: 'attribute_exists(#pk)',
                ExpressionAttributeNames: { '#pk': 'userId' },
                Key: userAttractionItem,
            },
        },
    };
    yield dbClient_1.default
        .transactWrite({
        TransactItems: [
            Object.assign({}, transactPartCreateDeleteUserAttraction[event.arguments.input.action]),
            // 2. increment / decrement bucketListCount field in Attraction
            {
                Update: {
                    ExpressionAttributeNames: { '#bucketListCount': 'bucketListCount' },
                    ExpressionAttributeValues: {
                        ':value': event.arguments.input.action === API_1.BUCKET_LIST_ACTION_INPUT.ADD ? 1 : -1,
                    },
                    Key: {
                        id: event.arguments.input.attractionId,
                    },
                    TableName: attractionTableName,
                    UpdateExpression: 'ADD #bucketListCount :value',
                },
            },
        ],
    })
        .promise();
    // create notification
    if (event.arguments.input.action === API_1.BUCKET_LIST_ACTION_INPUT.ADD &&
        ((_g = (_f = currentAttraction === null || currentAttraction === void 0 ? void 0 : currentAttraction.data) === null || _f === void 0 ? void 0 : _f.getAttraction) === null || _g === void 0 ? void 0 : _g.authorId) &&
        ((_j = (_h = currentAttraction === null || currentAttraction === void 0 ? void 0 : currentAttraction.data) === null || _h === void 0 ? void 0 : _h.getAttraction) === null || _j === void 0 ? void 0 : _j.authorId) !== event.identity.sub) {
        yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateNotification,
            variables: {
                input: {
                    showInApp: 1,
                    receiverUserId: currentAttraction.data.getAttraction.authorId,
                    senderUserId: event.identity.sub,
                    type: API_1.NOTIFICATION_TYPE.BUCKET_LIST_ATTRACTION,
                    attractionId: event.arguments.input.attractionId,
                },
            },
        });
    }
    return true;
});
exports.default = addRemoveFromBucketList;
