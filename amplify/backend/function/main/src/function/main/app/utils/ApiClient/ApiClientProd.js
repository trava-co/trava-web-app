"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const AWS = __importStar(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const getSSMVariable_1 = require("../getSSMVariable");
// TODO make me dynamic
const appsyncUrl = 'https://md6aoumzf5enrlp3v4h6vo5ydy.appsync-api.us-east-1.amazonaws.com/graphql';
const region = process.env.REGION;
const endpoint = new AWS.Endpoint(appsyncUrl);
class ApiClientProd {
    constructor() {
        this.authHeader = null;
    }
    static get() {
        if (!ApiClientProd.instance) {
            ApiClientProd.instance = new ApiClientProd();
        }
        return ApiClientProd.instance;
    }
    useAwsCognitoUserPoolAuth(authHeader) {
        this.authHeader = authHeader;
        return this;
    }
    useIamAuth() {
        this.authHeader = null;
        return this;
    }
    apiFetch(body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const req = new AWS.HttpRequest(endpoint, region);
            req.method = 'POST';
            req.headers.host = endpoint.host;
            req.headers['Content-Type'] = 'application/json';
            req.body = JSON.stringify(body);
            if (!this.authHeader) {
                // accessKeyId and secretAccessKey of IAM user api_client_production
                const credentials = {
                    accessKeyId: yield (0, getSSMVariable_1.getSSMVariable)('API_CLIENT_PRODUCTION_ACCESS_KEY_ID'),
                    secretAccessKey: yield (0, getSSMVariable_1.getSSMVariable)('API_CLIENT_PRODUCTION_SECRET_ACCESS_KEY'),
                };
                // @ts-ignore
                const signer = new AWS.Signers.V4(req, 'appsync', true);
                // @ts-ignore
                signer.addAuthorization(credentials, AWS.util.date.getDate());
            }
            else {
                req.headers.Authorization = this.authHeader;
            }
            const res = yield (0, axios_1.default)({
                method: 'post',
                url: endpoint.href,
                data: req.body,
                headers: req.headers,
            });
            // @ts-ignore
            if ((_a = res.data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                // @ts-ignore
                res.data.errors.forEach((error) => console.log(error));
                // @ts-ignore
                console.warn('TRAVA apiClientProd - errors', res.data.errors);
            }
            return res.data;
        });
    }
}
exports.default = ApiClientProd;
