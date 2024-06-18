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
const dbClient_1 = __importDefault(require("../../../utils/dbClient"));
const getTableName_1 = __importDefault(require("../../../utils/getTableName"));
function _increment(id, field) {
    return __awaiter(this, void 0, void 0, function* () {
        const TableName = (0, getTableName_1.default)(process.env.API_TRAVA_USERTABLE_NAME);
        yield dbClient_1.default
            .update({
            TableName,
            Key: {
                id,
            },
            UpdateExpression: `ADD ${field} :inc`,
            ExpressionAttributeValues: { ':inc': { N: '1' } },
        })
            .promise();
    });
}
const incrementUserFollows = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    // TODO check event.prev or handle in type check
    if (!event.prev) {
        // should never happen as this is called as a pipeline resolver
        throw new Error('event.prev is not defined. Check if the resolver is correctly set up.');
    }
    const userId = event.prev.result.userId;
    const followedUserId = event.prev.result.followedUserId;
    yield _increment(userId, 'followingCount');
    yield _increment(followedUserId, 'followersCount');
    return null;
});
exports.default = incrementUserFollows;
