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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const lambda_1 = require("shared-types/graphql/lambda");
const signOut = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('signOut');
    /**
     * Main query
     */
    if (event.identity && 'sub' in event.identity) {
        try {
            yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaUpdateUser,
                variables: { input: { id: event.identity.sub, fcmToken: null } },
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    else
        throw new Error(lambdaErrors_1.NOT_AUTHORIZED_REMOVE_FCM_TOKEN);
});
exports.default = signOut;
