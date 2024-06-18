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
const mutations_1 = require("shared-types/graphql/mutations");
const checkIfUserHasAccessToTrip_1 = __importDefault(require("./before/checkIfUserHasAccessToTrip"));
const deleteTimelineEntryMembers_1 = __importDefault(require("./before/deleteTimelineEntryMembers"));
const syncBeforeHooks = [checkIfUserHasAccessToTrip_1.default, deleteTimelineEntryMembers_1.default];
function _privateDeleteTimelineEntry(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!variables.input)
            return;
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: mutations_1.privateDeleteTimelineEntry,
            variables: {
                input: {
                    id: variables.input.id,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateDeleteTimelineEntry;
    });
}
const deleteTimelineEntry = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
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
    const timelineEntryFlight = yield _privateDeleteTimelineEntry(event.arguments);
    if (!timelineEntryFlight) {
        throw new Error('Failed to delete timeline entry');
    }
    /**
     * sync after hooks
     */
    // none
    return timelineEntryFlight;
});
exports.default = deleteTimelineEntry;
