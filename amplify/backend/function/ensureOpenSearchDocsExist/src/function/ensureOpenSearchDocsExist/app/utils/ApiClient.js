"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const getSSMVariable_1 = require("./getSSMVariable");
const region = process.env.REGION;
class ApiClient {
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
    openSearchFetch(index, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const openSearchUrl = (yield getSSMVariable_1.getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test';
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
            const res = yield axios_1.default({
                method: 'post',
                url: openSearchEndpoint.href,
                data: req.body,
                headers: req.headers,
            });
            // @ts-ignore
            if ((_a = res.data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                // @ts-ignore
                res.data.errors.forEach((error) => console.log(error));
                // @ts-ignore
                console.warn('TRAVA opensearch apiClient - errors', res.data.errors);
            }
            return res.data;
        });
    }
    openSearchMSearch(index, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const openSearchUrl = (yield getSSMVariable_1.getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test';
            const openSearchMultiSearchEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_msearch`);
            const req = new AWS.HttpRequest(openSearchMultiSearchEndpoint, region);
            req.method = 'POST';
            req.headers.host = req.endpoint.host;
            req.headers['Content-Type'] = 'application/x-ndjson';
            req.body = body;
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
            const res = yield axios_1.default({
                method: 'post',
                url: openSearchMultiSearchEndpoint.href,
                data: req.body,
                headers: req.headers,
            });
            // @ts-ignore
            if ((_a = res.data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                // @ts-ignore
                res.data.errors.forEach((error) => console.log(error));
                // @ts-ignore
                console.warn('TRAVA opensearch multisearch apiClient - errors', res.data.errors);
            }
            return res.data;
        });
    }
    // Method to initiate the scroll context
    openSearchScrollInit(index, body, scrollDuration = '1m') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const openSearchUrl = (yield getSSMVariable_1.getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test';
            const openSearchScrollInitEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_search?scroll=${scrollDuration}`);
            const req = new AWS.HttpRequest(openSearchScrollInitEndpoint, region);
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
            const res = yield axios_1.default({
                method: 'post',
                url: openSearchScrollInitEndpoint.href,
                data: req.body,
                headers: req.headers,
            });
            // @ts-ignore
            if ((_a = res.data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                // @ts-ignore
                res.data.errors.forEach((error) => console.log(error));
                // @ts-ignore
                console.warn('TRAVA opensearch apiClient - errors', res.data.errors);
            }
            return res.data;
        });
    }
    // Method to continue scrolling with the existing scroll ID
    openSearchScrollContinue(scrollId, scrollDuration = '1m') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const openSearchUrl = (yield getSSMVariable_1.getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test';
            const openSearchScrollContinueEndpoint = new AWS.Endpoint(`${openSearchUrl}/_search/scroll`);
            const req = new AWS.HttpRequest(openSearchScrollContinueEndpoint, region);
            req.method = 'POST';
            req.headers.host = req.endpoint.host;
            req.headers['Content-Type'] = 'application/json';
            req.body = JSON.stringify({
                scroll: scrollDuration,
                scroll_id: scrollId,
            });
            // AWS signing logic
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
            const res = yield axios_1.default({
                method: 'post',
                url: openSearchScrollContinueEndpoint.href,
                data: req.body,
                headers: req.headers,
            });
            if ((_a = res.data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                res.data.errors.forEach((error) => console.log(error));
                console.warn('TRAVA opensearch apiClient - errors', res.data.errors);
            }
            return res.data;
        });
    }
    // Method to clear the scroll context
    openSearchScrollClear(scrollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const openSearchUrl = (yield getSSMVariable_1.getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test';
            const openSearchClearScrollEndpoint = new AWS.Endpoint(`${openSearchUrl}/_search/scroll`);
            const req = new AWS.HttpRequest(openSearchClearScrollEndpoint, region);
            req.method = 'DELETE';
            req.headers.host = req.endpoint.host;
            req.headers['Content-Type'] = 'application/json';
            req.body = JSON.stringify({
                scroll_id: scrollId,
            });
            // AWS signing logic
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
            try {
                yield axios_1.default({
                    method: 'delete',
                    url: openSearchClearScrollEndpoint.href,
                    data: req.body,
                    headers: req.headers,
                });
            }
            catch (error) {
                console.error('Error in openSearchScrollClear:', error);
                throw error;
            }
        });
    }
}
exports.default = ApiClient;
