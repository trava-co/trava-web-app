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
const lambda_1 = require("shared-types/graphql/lambda");
const syncBeforeHooks = [validateInput_1.default, checkIfUserHasAccessToTrip_1.default, checkIfUsersAddedBelongToTrip_1.default];
function _privateCreateTimelineEntryLodgingDeparture(variables) {
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
                    timelineEntryType: API_1.TimelineEntryType.LODGING_DEPARTURE,
                    tripId: variables.input.tripId,
                    notes: variables.input.notes,
                    date: variables.input.date,
                    time: variables.input.time,
                    lodgingDepartureNameAndAddress: variables.input.lodgingDepartureNameAndAddress,
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
const createTimelineEntryLodgingDeparture = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
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
    const timelineEntryLodgingDeparture = yield _privateCreateTimelineEntryLodgingDeparture(event.arguments);
    if (!timelineEntryLodgingDeparture) {
        throw new Error('Failed to create timeline entry lodging departure');
    }
    for (const userId of (_a = event.arguments.input) === null || _a === void 0 ? void 0 : _a.memberIds) {
        const timelineEntryMembers = yield _privateCreateTimelineEntryMember({
            input: {
                timelineEntryId: timelineEntryLodgingDeparture.id,
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
    return timelineEntryLodgingDeparture;
});
exports.default = createTimelineEntryLodgingDeparture;
