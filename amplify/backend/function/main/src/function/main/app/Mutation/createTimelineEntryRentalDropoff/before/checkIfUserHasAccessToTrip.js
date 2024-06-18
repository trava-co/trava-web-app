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
const checkIfUserHasAccessToTrip = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    if (!event.arguments.input) {
        throw new Error('Not enough arguments specified');
    }
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_RENTAL_DROPOFF_MESSAGE);
    }
    const res = yield (0, getUserTrips_1.default)({
        tripId: event.arguments.input.tripId,
        userId: event.identity.sub,
    });
    if (!res.length) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_RENTAL_DROPOFF_MESSAGE);
    }
    return null;
});
exports.default = checkIfUserHasAccessToTrip;
