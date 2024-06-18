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
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const mutations_1 = require("shared-types/graphql/mutations");
const checkIfUserHasAccessToTrip_1 = __importDefault(require("./before/checkIfUserHasAccessToTrip"));
const validateInput_1 = __importDefault(require("./before/validateInput"));
const checkIfUsersAddedBelongToTrip_1 = __importDefault(require("./before/checkIfUsersAddedBelongToTrip"));
const getTripTimelineByTrip_1 = __importDefault(require("../../utils/getTripTimelineByTrip"));
const lambda_1 = require("shared-types/graphql/lambda");
const syncBeforeHooks = [validateInput_1.default, checkIfUserHasAccessToTrip_1.default, checkIfUsersAddedBelongToTrip_1.default];
function _privateCreateTimelineEntryFlight(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!variables.input)
            return;
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: mutations_1.privateCreateTimelineEntry,
            variables: {
                input: {
                    timelineEntryType: API_1.TimelineEntryType.FLIGHT,
                    tripId: variables.input.tripId,
                    notes: variables.input.notes,
                    date: variables.input.date,
                    time: variables.input.time,
                    flightDetails: variables.input.flightDetails,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateTimelineEntry;
    });
}
function _privateCreateTimelineEntryMember(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!variables.input)
            return;
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateCreateTimelineEntryMember,
            variables: {
                input: variables.input,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateTimelineEntryMember;
    });
}
const createTimelineEntryFlight = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    /**
     * sync before hooks
     */
    for (const hook of syncBeforeHooks) {
        console.log(`Running sync before hook: "${hook.name}"`);
        yield hook(event, ...args);
    }
    /**
     * Main query
     */
    if (!event.arguments.input) {
        throw new Error('No arguments specified');
    }
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('Not authorized');
    }
    event.request.headers.authorization && ApiClient_1.default.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization);
    const tripTimelineEntries = yield (0, getTripTimelineByTrip_1.default)({
        tripId: event.arguments.input.tripId,
        userId: event.identity.sub,
    });
    const existingTimelineEntry = tripTimelineEntries
        .filter((tripTimelineEntry) => !!tripTimelineEntry)
        .find((tripTimelineEntry) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const flightFromTimelineEntry = (_b = (_a = tripTimelineEntry === null || tripTimelineEntry === void 0 ? void 0 : tripTimelineEntry.flightDetails) === null || _a === void 0 ? void 0 : _a.scheduledFlights) === null || _b === void 0 ? void 0 : _b[0];
        const flightFromArguments = (_e = (_d = (_c = event.arguments.input) === null || _c === void 0 ? void 0 : _c.flightDetails) === null || _d === void 0 ? void 0 : _d.scheduledFlights) === null || _e === void 0 ? void 0 : _e[0];
        if (!flightFromTimelineEntry || !flightFromArguments)
            return;
        const flightFromTimelineEntryIata = ((_f = flightFromTimelineEntry.carrierFsCode) !== null && _f !== void 0 ? _f : '') + ((_g = flightFromTimelineEntry.flightNumber) !== null && _g !== void 0 ? _g : '');
        const flightFromArgumentsIata = ((_h = flightFromArguments.carrierFsCode) !== null && _h !== void 0 ? _h : '') + ((_j = flightFromArguments.flightNumber) !== null && _j !== void 0 ? _j : '');
        // since there may be multiple flights with the same flight number, we need to check if the arrival and departure airports are the same
        const sameAirportsForDepartureAndArrival = flightFromTimelineEntry.departureAirportFsCode === flightFromArguments.departureAirportFsCode &&
            flightFromTimelineEntry.arrivalAirportFsCode === flightFromArguments.arrivalAirportFsCode;
        return ((tripTimelineEntry === null || tripTimelineEntry === void 0 ? void 0 : tripTimelineEntry.date) === ((_k = event.arguments.input) === null || _k === void 0 ? void 0 : _k.date) &&
            flightFromTimelineEntryIata.localeCompare(flightFromArgumentsIata) === 0 &&
            sameAirportsForDepartureAndArrival);
    });
    if (existingTimelineEntry) {
        const timelineEntryFlight = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.updateTimelineEntryFlight,
            variables: {
                input: {
                    id: existingTimelineEntry.id,
                    time: event.arguments.input.time,
                    date: event.arguments.input.date,
                    flightDetails: event.arguments.input.flightDetails,
                    notes: event.arguments.input.notes,
                    memberIds: event.arguments.input.memberIds,
                },
            },
        });
        return (_a = timelineEntryFlight === null || timelineEntryFlight === void 0 ? void 0 : timelineEntryFlight.data) === null || _a === void 0 ? void 0 : _a.updateTimelineEntryFlight;
    }
    ApiClient_1.default.get().useIamAuth();
    const timelineEntryFlight = yield _privateCreateTimelineEntryFlight(event.arguments);
    if (!timelineEntryFlight) {
        throw new Error('Failed to create timeline entry flight');
    }
    for (const userId of event.arguments.input.memberIds) {
        const timelineEntryMembers = yield _privateCreateTimelineEntryMember({
            input: {
                timelineEntryId: timelineEntryFlight.id,
                userId: userId,
            },
        });
        if (!timelineEntryMembers) {
            throw new Error('Failed to create timeline entry member');
        }
    }
    /**
     * sync after
     */
    // none
    return timelineEntryFlight;
});
exports.default = createTimelineEntryFlight;
