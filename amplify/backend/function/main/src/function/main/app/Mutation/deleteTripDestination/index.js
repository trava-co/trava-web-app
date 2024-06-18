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
const mutations_1 = require("shared-types/graphql/mutations");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const checkTripDestinationAccessDelete_1 = __importDefault(require("./before/checkTripDestinationAccessDelete"));
const deleteAttractionSwipes_1 = __importDefault(require("./before/deleteAttractionSwipes"));
const deleteTripDestinationUsers_1 = __importDefault(require("./before/deleteTripDestinationUsers"));
const asyncBeforeHooks = [checkTripDestinationAccessDelete_1.default];
const syncBeforeHooks = [deleteAttractionSwipes_1.default, deleteTripDestinationUsers_1.default];
function _privateDeleteTripDestination(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateDeleteTripDestination,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateDeleteTripDestination;
    });
}
const deleteTripDestination = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('deleteTripDestination');
    /**
     * async before hooks
     */
    yield Promise.all(asyncBeforeHooks.map((hook) => {
        console.log(`Running async before hook: "${hook.name}"`);
        return hook(event, ...args);
    }));
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
    const tripDestination = yield _privateDeleteTripDestination(event.arguments);
    if (!tripDestination) {
        throw new Error('Failed to delete tripDestination');
    }
    /**
     * after hooks
     */
    // none
    return tripDestination;
});
exports.default = deleteTripDestination;
