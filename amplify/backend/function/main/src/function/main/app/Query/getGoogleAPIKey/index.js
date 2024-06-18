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
Object.defineProperty(exports, "__esModule", { value: true });
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const API_1 = require("shared-types/API");
const getGoogleAPIKey = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('google get api key');
    /**
     * Main query
     */
    const { platform, isDev } = event.arguments.input;
    let key;
    if (isDev) {
        key = yield (0, getSSMVariable_1.getSSMVariable)('GOOGLE_AUTOCOMPLETE_API_KEY_DEV');
    }
    else if (platform === API_1.PLATFORM.IOS) {
        key = yield (0, getSSMVariable_1.getSSMVariable)('GOOGLE_AUTOCOMPLETE_API_KEY_IOS');
    }
    else if (platform === API_1.PLATFORM.ANDROID) {
        key = yield (0, getSSMVariable_1.getSSMVariable)('GOOGLE_AUTOCOMPLETE_API_KEY_ANDROID');
    }
    if (!key) {
        throw new Error('no key found in SSM');
    }
    return { __typename: 'GoogleGetAPIKeyResult', key };
});
exports.default = getGoogleAPIKey;
