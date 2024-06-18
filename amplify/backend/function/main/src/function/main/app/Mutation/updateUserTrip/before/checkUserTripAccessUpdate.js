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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const checkUserTripAccessUpdate = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    // If userId is equal sub - can update (example: change userTrip status: pending -> approved)
    if (event.identity && 'sub' in event.identity) {
        if (event.arguments.input.userId !== event.identity.sub) {
            throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_USER_TRIP_MESSAGE);
        }
    }
    return null;
});
exports.default = checkUserTripAccessUpdate;
