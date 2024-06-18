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
const checkIfUserHasAccessToTrip_1 = __importDefault(require("./before/checkIfUserHasAccessToTrip"));
const validateInput_1 = __importDefault(require("./before/validateInput"));
const addAndRemoveTimelineEntryMembers_1 = __importDefault(require("./after/addAndRemoveTimelineEntryMembers"));
const checkIfUsersAddedBelongToTrip_1 = __importDefault(require("./before/checkIfUsersAddedBelongToTrip"));
const lambda_1 = require("shared-types/graphql/lambda");
const syncBeforeHooks = [validateInput_1.default, checkIfUserHasAccessToTrip_1.default, checkIfUsersAddedBelongToTrip_1.default];
const syncAfterHooks = [addAndRemoveTimelineEntryMembers_1.default];
function _privateUpdateTimelineEntryRentalPickup(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!variables.input)
            return;
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaCustomPrivateUpdateTimelineEntry,
            variables: {
                input: {
                    id: variables.input.id,
                    notes: variables.input.notes,
                    date: variables.input.date,
                    time: variables.input.time,
                    rentalPickupLocation: variables.input.rentalPickupLocation,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateTimelineEntry;
    });
}
const createTimelineEntryRentalPickup = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
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
    const timelineEntryRentalPickup = yield _privateUpdateTimelineEntryRentalPickup(event.arguments);
    if (!timelineEntryRentalPickup) {
        throw new Error('Failed to update timeline entry rental pickup');
    }
    /**
     * sync after
     */
    for (const hook of syncAfterHooks) {
        console.log(`Running sync after hook: "${hook.name}"`);
        yield hook(event, timelineEntryRentalPickup);
    }
    return timelineEntryRentalPickup;
});
exports.default = createTimelineEntryRentalPickup;
