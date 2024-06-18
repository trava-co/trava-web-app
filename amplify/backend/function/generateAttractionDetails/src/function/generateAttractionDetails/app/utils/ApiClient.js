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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const env_names_to_config_1 = require("./env-names-to-config");
const appsyncUrl = process.env.API_TRAVA_GRAPHQLAPIENDPOINTOUTPUT || 'test';
const region = process.env.REGION;
const endpoint = new AWS.Endpoint(appsyncUrl);
class ApiClient {
    static instance;
    authHeader;
    constructor() {
        this.authHeader = null;
    }
    static get() {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    useAwsCognitoUserPoolAuth(authHeader) {
        this.authHeader = authHeader;
        return this;
    }
    useIamAuth() {
        this.authHeader = null;
        return this;
    }
    async apiFetch(body) {
        const req = new AWS.HttpRequest(endpoint, region);
        req.method = 'POST';
        req.headers.host = endpoint.host;
        req.headers['Content-Type'] = 'application/json';
        req.body = JSON.stringify(body);
        if (!this.authHeader) {
            // needs to be set this way, otherwise this will not work on mock
            // see: https://github.com/aws-amplify/amplify-cli/issues/9100
            const mockCredentials = {
                accessKeyId: 'ASIAVJKIAM-AuthRole',
                secretAccessKey: 'fake',
            };
            const credentials = endpoint.hostname === 'localhost' ? mockCredentials : AWS.config.credentials;
            // @ts-ignore
            const signer = new AWS.Signers.V4(req, 'appsync', true);
            // @ts-ignore
            signer.addAuthorization(credentials, AWS.util.date.getDate());
        }
        else {
            req.headers.Authorization = this.authHeader;
        }
        const res = await (0, axios_1.default)({
            method: 'post',
            url: endpoint.href,
            data: req.body,
            headers: req.headers,
        });
        // @ts-ignore
        if (res.data.errors?.length) {
            // @ts-ignore
            res.data.errors.forEach((error) => console.log(error));
            // @ts-ignore
            console.warn('TRAVA apiClient - errors', res.data.errors);
        }
        return res.data;
    }
    async openSearchFetch(index, body) {
        const env = process.env.ENV;
        if (!env)
            throw new Error('ENV not set');
        const parsedEnv = env.toUpperCase();
        const envConfig = env_names_to_config_1.envNamesToConfig[parsedEnv];
        const openSearchUrl = envConfig.openSearchUrl || 'test';
        const openSearchEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_search`);
        const req = new AWS.HttpRequest(openSearchEndpoint, region);
        req.method = 'POST';
        req.headers.host = req.endpoint.host;
        req.headers['Content-Type'] = 'application/json';
        req.body = JSON.stringify(body);
        if (!this.authHeader) {
            const mockCredentials = {
                accessKeyId: 'ASIAVJKIAM-AuthRole',
                secretAccessKey: 'fake',
            };
            const credentials = req.endpoint.hostname === 'localhost' ? mockCredentials : AWS.config.credentials;
            // @ts-ignore
            const signer = new AWS.Signers.V4(req, 'es', true);
            // @ts-ignore
            signer.addAuthorization(credentials, AWS.util.date.getDate());
        }
        else {
            req.headers.Authorization = this.authHeader;
        }
        const res = await (0, axios_1.default)({
            method: 'post',
            url: openSearchEndpoint.href,
            data: req.body,
            headers: req.headers,
        });
        if (res.data.errors?.length) {
            res.data.errors.forEach((error) => console.log(error));
            console.warn('TRAVA opensearch apiClient - errors', res.data.errors);
        }
        return res.data;
    }
}
exports.default = ApiClient;
