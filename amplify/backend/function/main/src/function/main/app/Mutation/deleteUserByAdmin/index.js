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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const deleteCognitoUser_1 = __importDefault(require("./deleteCognitoUser"));
const lambda_1 = require("shared-types/graphql/lambda");
const signOutCognitoUser_1 = __importDefault(require("./signOutCognitoUser"));
const constants_1 = require("../../utils/constants");
const _getUser = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetUser,
        variables,
    });
    return res.data.getUser;
});
const _getUserName = (user) => {
    if (user.appleId)
        return `signinwithapple_${user.username}`;
    if (user.facebookId)
        return `facebook_${user.username}`;
    if (user.googleId)
        return `google_${user.username}`;
    else
        return user.username || '';
};
const _anonymizeUser = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, avatar, email, phone, privacy, dateOfBirth, facebookId, googleId, appleId, description, location } = variables, rest = __rest(variables, ["id", "avatar", "email", "phone", "privacy", "dateOfBirth", "facebookId", "googleId", "appleId", "description", "location"]);
    return yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaUpdateUser,
        variables: {
            input: {
                appleId: '',
                avatar: null,
                dateOfBirth: '2000-01-01',
                description: constants_1.USER_DELETED_STRING,
                email: constants_1.USER_DELETED_STRING,
                facebookId: '',
                googleId: '',
                id,
                location: constants_1.USER_DELETED_STRING,
                name: constants_1.USER_DELETED_STRING,
                phone,
                privacy,
                username: constants_1.USER_DELETED_STRING,
            },
        },
    });
});
const privateDeleteUserByAdmin = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('privateDeleteUserByAdmin');
    const user = yield _getUser(event.arguments.input);
    if (!user) {
        throw new Error(`${lambdaErrors_1.CUSTOM_GET_USER_DATA_DELETE_BY_ADMIN}: ${JSON.stringify(event.arguments.input)}`);
    }
    const username = _getUserName(user);
    console.log('delete user username:', username);
    /**
     * Main query
     */
    try {
        yield _anonymizeUser(user);
        yield (0, signOutCognitoUser_1.default)(username);
        yield (0, deleteCognitoUser_1.default)(username);
    }
    catch (err) {
        throw new Error(`${lambdaErrors_1.CUSTOM_ERROR_USER_DELETE_BY_ADMIN}: ${err}`);
    }
    return user;
});
exports.default = privateDeleteUserByAdmin;
