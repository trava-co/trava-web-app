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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const createNotification_1 = __importDefault(require("./after/createNotification"));
const lambda_1 = require("shared-types/graphql/lambda");
const checkIfUserNotBlocked_1 = __importDefault(require("./before/checkIfUserNotBlocked"));
const beforeHooks = [checkIfUserNotBlocked_1.default];
const afterHooks = [createNotification_1.default];
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
function _privateCreateUserFollow(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateCreateUserFollow,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateUserFollow;
    });
}
const createUserFollow = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    yield Promise.all(beforeHooks.map((hook) => {
        console.log(`Running before hook: "${hook.name}"`);
        return hook(event, ...args);
    }));
    /**
     * Main query
     */
    const userToBeFollowed = yield _getUser({
        id: event.arguments.input.followedUserId,
    });
    if (!userToBeFollowed) {
        throw new Error('Failed to create userFollow');
    }
    const argumentsInput = Object.assign({}, event.arguments.input);
    if (userToBeFollowed.privacy === API_1.PRIVACY.PRIVATE) {
        argumentsInput.approved = false;
    }
    const userFollow = yield _privateCreateUserFollow({
        input: argumentsInput,
    });
    if (!userFollow) {
        throw new Error('Failed to create userFollow');
    }
    /**
     * after hooks
     */
    yield Promise.all(afterHooks.map((hook) => {
        console.log(`Running after hook: "${hook.name}"`);
        return hook(event, userFollow);
    }));
    return userFollow;
});
exports.default = createUserFollow;
