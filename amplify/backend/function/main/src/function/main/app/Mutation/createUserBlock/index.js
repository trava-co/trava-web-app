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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const removeFollowFromBlockedUser_1 = __importDefault(require("./after/removeFollowFromBlockedUser"));
const unfollowBlockedUser_1 = __importDefault(require("./after/unfollowBlockedUser"));
const afterHooks = [removeFollowFromBlockedUser_1.default, unfollowBlockedUser_1.default];
function _getUser(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetUser,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.getUser;
    });
}
function _privateCreateUserBlock(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateCreateUserBlock,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateUserBlock;
    });
}
const createUserBlock = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    // none
    /**
     * Main query
     */
    const userToBeBlocked = yield _getUser({
        id: event.arguments.input.blockedUserId,
    });
    if (!userToBeBlocked) {
        throw new Error(`Failed to create userBlock. Provided blockUserId ${event.arguments.input.blockedUserId} does not belong to any user.`);
    }
    const userBlock = yield _privateCreateUserBlock({
        input: event.arguments.input,
    });
    if (!userBlock) {
        throw new Error(`Failed to create userBlock. blockedUserId: ${event.arguments.input.blockedUserId}`);
    }
    /**
     * after hooks
     */
    yield Promise.all(afterHooks.map((hook) => {
        console.log(`Running after hook: "${hook.name}"`);
        return hook(event, userBlock);
    }));
    return userBlock;
});
exports.default = createUserBlock;
