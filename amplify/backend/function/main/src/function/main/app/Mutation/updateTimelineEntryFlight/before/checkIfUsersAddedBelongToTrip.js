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
const getUserTrips_1 = __importDefault(require("../../../utils/getUserTrips"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getTimelineEntry_1 = __importDefault(require("../../../utils/getTimelineEntry"));
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const checkIfUsersAddedBelongToTrip = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    if (!event.arguments.input) {
        throw new Error('Not enough arguments specified');
    }
    const timelineEntry = yield (0, getTimelineEntry_1.default)(event.arguments.input.id);
    if (!timelineEntry) {
        throw new Error('Timeline entry not found');
    }
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_FLIGHT_MESSAGE);
    }
    event.request.headers.authorization && ApiClient_1.default.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization);
    const res = yield (0, getUserTrips_1.default)({
        tripId: timelineEntry.tripId,
        userId: event.identity.sub,
    });
    event.arguments.input.memberIds.forEach((memberId) => {
        if (!res.find((user) => (user === null || user === void 0 ? void 0 : user.userId) === memberId)) {
            throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_FLIGHT_MESSAGE);
        }
    });
    return null;
});
exports.default = checkIfUsersAddedBelongToTrip;
