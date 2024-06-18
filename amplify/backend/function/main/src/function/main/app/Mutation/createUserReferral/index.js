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
const lambda_1 = require("shared-types/graphql/lambda");
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
function _privateCreateUserReferral(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateCreateUserReferral,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateUserReferral;
    });
}
const createUserReferral = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    /**
     * Main query
     */
    const referringUser = yield _getUser({
        id: event.arguments.input.userId,
    });
    if (!referringUser) {
        throw new Error('Failed to create user referral: referring user not found');
    }
    const userReferral = yield _privateCreateUserReferral({
        input: event.arguments.input,
    });
    if (!userReferral) {
        throw new Error('Failed to create userReferral');
    }
    /**
     * after hooks
     */
    yield Promise.all(afterHooks.map((hook) => {
        console.log(`Running after hook: "${hook.name}"`);
        return hook(event, userReferral);
    }));
    return userReferral;
});
exports.default = createUserReferral;
