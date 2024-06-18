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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const cognitoIdentityServiceProvider = new aws_sdk_1.default.CognitoIdentityServiceProvider();
function getUserAttributes(data) {
    const userAttributes = [];
    if (data.email) {
        userAttributes.push({
            Name: 'email',
            Value: data.email,
        });
    }
    if (data.phone) {
        userAttributes.push({
            Name: 'phone_number',
            Value: data.phone,
        });
    }
    return userAttributes;
}
function getClientId() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.AUTH_TRAVAF4F82E77_USERPOOLID) {
            throw new Error('Cognito user pool not configured');
        }
        const userPoolClients = yield cognitoIdentityServiceProvider
            .listUserPoolClients({
            UserPoolId: process.env.AUTH_TRAVAF4F82E77_USERPOOLID,
        })
            .promise();
        if (!((_a = userPoolClients.UserPoolClients) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new Error('No AppSync client found.');
        }
        if (!userPoolClients.UserPoolClients[0].ClientId) {
            throw new Error('No AppSync client found.');
        }
        return userPoolClients.UserPoolClients[0].ClientId;
    });
}
function createCognitoUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield cognitoIdentityServiceProvider
            .signUp({
            ClientId: yield getClientId(),
            Password: data.password,
            Username: data.username,
            UserAttributes: getUserAttributes(data),
        })
            .promise();
        return res;
    });
}
exports.default = createCognitoUser;
