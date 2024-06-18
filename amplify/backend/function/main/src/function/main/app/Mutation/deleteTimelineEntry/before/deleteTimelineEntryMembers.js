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
const getTimelineEntry_1 = __importDefault(require("../../../utils/getTimelineEntry"));
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
function _privateDeleteTimelineEntryMember(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!variables.input)
            return;
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaPrivateDeleteTimelineEntryMember,
            variables: {
                input: {
                    timelineEntryId: variables.input.timelineEntryId,
                    userId: variables.input.userId,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateDeleteTimelineEntryMember;
    });
}
const deleteTimelineEntryMembers = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('event', event);
    if (!event.arguments.input) {
        throw new Error('Not enough arguments specified');
    }
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE);
    }
    ApiClient_1.default.get().useIamAuth();
    const timelineEntry = yield (0, getTimelineEntry_1.default)(event.arguments.input.id);
    if (!timelineEntry) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE);
    }
    if (!((_a = timelineEntry.members) === null || _a === void 0 ? void 0 : _a.items)) {
        return null;
    }
    const deleteTimelineEntryMemberPromises = (_b = timelineEntry.members) === null || _b === void 0 ? void 0 : _b.items.filter((member) => !!member).map((member) => {
        return _privateDeleteTimelineEntryMember({
            input: {
                timelineEntryId: timelineEntry.id,
                userId: member.userId,
            },
        });
    });
    yield Promise.all(deleteTimelineEntryMemberPromises);
    return null;
});
exports.default = deleteTimelineEntryMembers;
