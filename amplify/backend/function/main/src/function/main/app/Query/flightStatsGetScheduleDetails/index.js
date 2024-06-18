"use strict";
// @ts-nocheck
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
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const axios_1 = __importDefault(require("axios"));
const flightStatsGetScheduleDetails = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('flightStatsGetScheduleDetails');
    /**
     * Main query
     */
    const flightstatsAppId = yield (0, getSSMVariable_1.getSSMVariable)('FLIGHTSTATS_APPID');
    const flightstatsAppKey = yield (0, getSSMVariable_1.getSSMVariable)('FLIGHTSTATS_APPKEY');
    if (!event.arguments.input) {
        throw new Error('No arguments specified');
    }
    const { flightNumber, day, codeType, month, year, carrier } = event.arguments.input;
    const result = (yield axios_1.default.get(encodeURI(`https://api.flightstats.com/flex/schedules/rest/v1/json/flight/${carrier}/${flightNumber}/departing/${year}/${month}/${day}`), {
        params: {
            appId: flightstatsAppId,
            appKey: flightstatsAppKey,
            codeType,
        },
    })).data;
    /**
     * after hooks
     */
    // none
    if (!result) {
        return null;
    }
    return result;
});
exports.default = flightStatsGetScheduleDetails;
