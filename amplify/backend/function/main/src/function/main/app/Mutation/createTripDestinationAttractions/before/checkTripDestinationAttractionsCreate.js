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
const getTripDestinations_1 = __importDefault(require("../../../utils/getTripDestinations"));
const getAttraction_1 = __importDefault(require("../../../utils/getAttraction"));
const checkTripDestinationAttractionsCreate = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_ATTRACTION_MESSAGE);
    }
    // check if user belongs to a trip & get all destinations from trip
    const tripDestinations = yield (0, getTripDestinations_1.default)({
        tripId: event.arguments.input.tripId,
        userId: event.identity.sub,
    });
    // check if destination with input destinationId exists
    const tripDestinationIndex = tripDestinations === null || tripDestinations === void 0 ? void 0 : tripDestinations.findIndex((el) => (el === null || el === void 0 ? void 0 : el.destinationId) === event.arguments.input.destinationId);
    if (tripDestinationIndex === -1)
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_ATTRACTION_MESSAGE);
    // check if attractions exist
    for (const attraction of event.arguments.input.attractions) {
        const attractionFromDb = yield (0, getAttraction_1.default)({ id: attraction.attractionId });
        if (!attractionFromDb)
            throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_ATTRACTION_MESSAGE);
    }
    return null;
});
exports.default = checkTripDestinationAttractionsCreate;
