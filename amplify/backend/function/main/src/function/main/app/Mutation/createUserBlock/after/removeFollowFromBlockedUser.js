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
const getUserFollow_1 = __importDefault(require("../../../utils/getUserFollow"));
const deleteUserFollow_1 = __importDefault(require("../../../utils/deleteUserFollow"));
const removeFollowFromBlockedUser = (event, userBlock) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        return null;
    }
    const userFollow = yield (0, getUserFollow_1.default)({
        userId: userBlock.blockedUserId,
        followedUserId: event.identity.sub,
    });
    if (!userFollow)
        return null;
    yield (0, deleteUserFollow_1.default)({
        input: {
            userId: userBlock.blockedUserId,
            followedUserId: event.identity.sub,
        },
    });
    return null;
});
exports.default = removeFollowFromBlockedUser;
