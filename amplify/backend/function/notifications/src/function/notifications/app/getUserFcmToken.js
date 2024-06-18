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
const apiClient_1 = __importDefault(require("./utils/apiClient"));
const user_1 = require("shared-types/graphql/user");
const getUserFcmToken = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const res = yield apiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: user_1.customGetUserFcmToken,
        variables,
    })
        .catch((err) => {
        throw new Error(err);
    });
    console.log('fcmToken', (_a = res.data.getUser) === null || _a === void 0 ? void 0 : _a.fcmToken);
    return ((_b = res.data.getUser) === null || _b === void 0 ? void 0 : _b.fcmToken) || '';
});
exports.default = getUserFcmToken;
