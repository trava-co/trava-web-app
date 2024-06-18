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
const acceptPendingFollowRequests_1 = __importDefault(require("./after/acceptPendingFollowRequests"));
const lambda_1 = require("shared-types/graphql/lambda");
const updateNotifications_1 = __importDefault(require("./after/updateNotifications"));
const afterHooks = [acceptPendingFollowRequests_1.default, updateNotifications_1.default];
function _privateUpdateUser(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateUser,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateUser;
    });
}
const updateUser = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('updateUser');
    /**
     * before hooks
     */
    // none
    /**
     * Main query
     */
    const user = yield _privateUpdateUser(event.arguments);
    if (!user) {
        throw new Error('Failed to update user');
    }
    /**
     * after hooks
     */
    yield Promise.all(afterHooks.map((hook) => {
        console.log(`Running after hook: "${hook.name}"`);
        return hook(event, user);
    }));
    return user;
});
exports.default = updateUser;
