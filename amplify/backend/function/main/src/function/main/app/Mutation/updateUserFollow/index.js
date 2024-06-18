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
const createNotification_1 = __importDefault(require("./after/createNotification"));
const checkIfUserIsAllowedToUpdateUserFollow_1 = __importDefault(require("./before/checkIfUserIsAllowedToUpdateUserFollow"));
const lambda_1 = require("shared-types/graphql/lambda");
const beforeHooks = [checkIfUserIsAllowedToUpdateUserFollow_1.default];
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
function _privateUpdateUserFollow(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateUserFollow,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateUserFollow;
    });
}
const updateUserFollow = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
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
    const userFollow = yield _privateUpdateUserFollow(event.arguments);
    if (!userFollow) {
        throw new Error('Failed to update userFollow');
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
exports.default = updateUserFollow;
