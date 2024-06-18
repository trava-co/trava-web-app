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
const createCognitoUser_1 = __importDefault(require("./createCognitoUser"));
const createUser_1 = __importDefault(require("./createUser"));
const deleteCognitoUser_1 = __importDefault(require("./deleteCognitoUser"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const country_to_continent_map_1 = require("../../utils/country-to-continent-map");
const blockedContinents = ['Africa'];
const blockedCountryCodes = ['+92', '+93', '+670', '+972']; // Pakistan, Afghanistan, East Timor, Israel
const BLOCKED_NUMBER_ERROR_MESSAGE = 'Phone number rejected. Try again with a different phone number, or try signing up with email.';
const isBlockedByCountryCode = (phone) => {
    return blockedCountryCodes.some((code) => phone.startsWith(code));
};
const isBlockedByContinent = (phone) => {
    const parsedPhoneNumber = (0, libphonenumber_js_1.default)(phone);
    const possibleCountries = parsedPhoneNumber === null || parsedPhoneNumber === void 0 ? void 0 : parsedPhoneNumber.getPossibleCountries();
    const possibleContinents = possibleCountries === null || possibleCountries === void 0 ? void 0 : possibleCountries.map((country) => country_to_continent_map_1.countryToContinentMap[country]);
    return (possibleContinents === null || possibleContinents === void 0 ? void 0 : possibleContinents.some((continent) => blockedContinents.includes(continent))) || false;
};
const signUp = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!event.arguments.input)
        throw new Error('No input params passed in request');
    // temp fix against bot: block phone number registration in Africa and Asia
    const phone = event.arguments.input.phone;
    if (phone) {
        if (phone && (isBlockedByCountryCode(phone) || isBlockedByContinent(phone))) {
            throw new Error(BLOCKED_NUMBER_ERROR_MESSAGE);
        }
    }
    const signUpResponse = yield (0, createCognitoUser_1.default)(event.arguments.input);
    if (!signUpResponse) {
        throw new Error('Cognito user not created');
    }
    try {
        yield (0, createUser_1.default)(signUpResponse.UserSub, event.arguments.input);
    }
    catch (err) {
        // if create user in dynamo fails - clean up cognito
        yield (0, deleteCognitoUser_1.default)(event.arguments.input);
        throw err;
    }
    return {
        __typename: 'SignUpResponse',
        id: signUpResponse.UserSub,
        destination: (_a = signUpResponse.CodeDeliveryDetails) === null || _a === void 0 ? void 0 : _a.Destination,
    };
});
exports.default = signUp;
