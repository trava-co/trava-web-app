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
const usernames_json_1 = __importDefault(require("./data/usernames.json"));
const signUpCheckGetUserByUsername = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!event.arguments.username) {
        throw new Error('Username is required');
    }
    const user = yield ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: lambda_1.lambdaGetUserByUsername,
        variables: {
            username: event.arguments.username,
        },
    });
    const usernameExistsInDynamo = (_c = (_b = (_a = user.data.getUserByUsername) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id;
    if (usernameExistsInDynamo) {
        return usernameExistsInDynamo;
    }
    // we started with any case usernames, but now we want to enforce lowercase, and want to prevent
    // users from registering with a username that is already in use in a different capitalization
    const usernameWithDifferentCase = usernames_json_1.default.find((users) => users.username === event.arguments.username);
    return (_d = usernameWithDifferentCase === null || usernameWithDifferentCase === void 0 ? void 0 : usernameWithDifferentCase.id) !== null && _d !== void 0 ? _d : '';
});
exports.default = signUpCheckGetUserByUsername;
