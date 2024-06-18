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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getUserTrips_1 = __importDefault(require("../../../utils/getUserTrips"));
const checkTripDestinationAccessUpdate = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    // if user (sub) belongs to tripId - can update trip destinations that belongs to trip
    if (event.identity && 'sub' in event.identity) {
        const res = yield (0, getUserTrips_1.default)({
            tripId: event.arguments.input.tripId,
            userId: event.identity.sub,
        });
        if (!res.length) {
            throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_TRIP_DESTINATION_MESSAGE);
        }
    }
    return null;
});
exports.default = checkTripDestinationAccessUpdate;
