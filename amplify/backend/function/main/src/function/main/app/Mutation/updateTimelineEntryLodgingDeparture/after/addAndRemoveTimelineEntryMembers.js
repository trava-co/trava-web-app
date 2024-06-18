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
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const getTimelineEntry_1 = __importDefault(require("../../../utils/getTimelineEntry"));
const lambda_1 = require("shared-types/graphql/lambda");
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
                input: variables.input,
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
const addAndRemoveTimelineEntryMembers = (event, timelineEntryLodgingDeparture) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log('event', event);
    if (!event.arguments.input) {
        throw new Error('No arguments specified');
    }
    const timelineEntry = yield (0, getTimelineEntry_1.default)(timelineEntryLodgingDeparture.id);
    if (!((_a = timelineEntry === null || timelineEntry === void 0 ? void 0 : timelineEntry.members) === null || _a === void 0 ? void 0 : _a.items)) {
        throw new Error(`Timeline entry ${timelineEntryLodgingDeparture.id} not found`);
    }
    const timelineEntryMembersToCreate = event.arguments.input.memberIds.filter((memberId) => {
        var _a, _b;
        return !((_b = (_a = timelineEntry.members) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.filter((member) => !!member).find((member) => member.userId === memberId));
    });
    const timelineEntryMembersToDelete = (_d = (_c = (_b = timelineEntry.members) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.filter((member) => !!(member === null || member === void 0 ? void 0 : member.userId))) === null || _d === void 0 ? void 0 : _d.map((member) => member.userId).filter((memberId) => !event.arguments.input.memberIds.includes(memberId));
    const deleteTimelineEntryMembersPromises = timelineEntryMembersToDelete.map((timelineEntryMemberId) => {
        return _privateDeleteTimelineEntryMember({
            input: {
                timelineEntryId: timelineEntry.id,
                userId: timelineEntryMemberId,
            },
        });
    });
    const createTimelineEntryMembersPromises = timelineEntryMembersToCreate.map((timelineEntryMemberId) => {
        return _privateCreateTimelineEntryMember({
            input: {
                timelineEntryId: timelineEntry.id,
                userId: timelineEntryMemberId,
            },
        });
    });
    yield Promise.all(deleteTimelineEntryMembersPromises);
    yield Promise.all(createTimelineEntryMembersPromises);
    return null;
});
exports.default = addAndRemoveTimelineEntryMembers;
