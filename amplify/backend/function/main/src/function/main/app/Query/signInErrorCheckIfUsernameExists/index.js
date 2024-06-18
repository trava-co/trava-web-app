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
const lambda_1 = require("shared-types/graphql/lambda");
const signInErrorCheckIfUsernameExists = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!event.arguments.username) {
        throw new Error('Username is required');
    }
    const user = yield ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: lambda_1.lambdaGetUserAuthProviderByUsername,
        variables: {
            username: event.arguments.username,
        },
    });
    const userData = (_b = (_a = user.data.getUserByUsername) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b[0];
    const provider = (userData === null || userData === void 0 ? void 0 : userData.googleId)
        ? API_1.PROVIDER.GOOGLE
        : (userData === null || userData === void 0 ? void 0 : userData.facebookId)
            ? API_1.PROVIDER.FACEBOOK
            : (userData === null || userData === void 0 ? void 0 : userData.appleId)
                ? API_1.PROVIDER.APPLE
                : API_1.PROVIDER.NONE;
    return {
        __typename: 'SignInErrorCheckIfUsernameExistsResponse',
        provider,
    };
});
exports.default = signInErrorCheckIfUsernameExists;
