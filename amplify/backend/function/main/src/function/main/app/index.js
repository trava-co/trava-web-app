"use strict";
/* Amplify Params - DO NOT EDIT
    API_TRAVA_GRAPHQLAPIENDPOINTOUTPUT
    API_TRAVA_GRAPHQLAPIIDOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
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
exports.handler = void 0;
const ApiClient_1 = __importDefault(require("./utils/ApiClient/ApiClient"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const minMax_1 = __importDefault(require("dayjs/plugin/minMax"));
const setupCloudinary_1 = require("./utils/setupCloudinary");
const setupTeaRex_1 = require("./utils/setupTeaRex");
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.extend(minMax_1.default);
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const model = event.model;
    // @ts-ignore
    const stage = event.stage;
    // use cognito user pool auth if event.identity.sub is present
    event.request.headers.authorization &&
        event.identity &&
        'sub' in event.identity &&
        event.identity.sub &&
        ApiClient_1.default.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization);
    yield (0, setupCloudinary_1.configureCloudinary)();
    yield (0, setupTeaRex_1.setupTeaRex)();
    let func;
    if (model && stage) {
        // @ts-ignore
        const { default: _func } = yield Promise.resolve(`${`./${model}/${event.fieldName}/${stage}/index.js`}`).then(s => __importStar(require(s))); // important (after compilation it's js)
        func = _func;
    }
    else {
        // @ts-ignore
        // @ts-ignore
        const { default: _func } = yield Promise.resolve(`${`./${event.typeName}/${event.fieldName}/index.js`}`).then(s => __importStar(require(s))); // important (after compilation it's js)
        func = _func;
    }
    try {
        const res = yield func(event);
        if ((_a = res === null || res === void 0 ? void 0 : res.errors) === null || _a === void 0 ? void 0 : _a.length)
            console.log('errors ===', res.errors);
        return res;
    }
    catch (e) {
        console.warn('function error:\n', e);
        throw e;
    }
});
exports.handler = handler;
