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
const mutations_1 = require("shared-types/graphql/mutations");
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const checkIfUserTripAndTripDestinationExists_1 = __importDefault(require("./before/checkIfUserTripAndTripDestinationExists"));
const beforeHooks = [checkIfUserTripAndTripDestinationExists_1.default];
function _privateGetAttractionSwipe(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateGetAttractionSwipe,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateGetAttractionSwipe;
    });
}
function _privateUpdateAttractionSwipe(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateUpdateAttractionSwipe,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateAttractionSwipe;
    });
}
function _privateCreateAttractionSwipe(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateCreateAttractionSwipe,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateAttractionSwipe;
    });
}
const putAttractionSwipe = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('putAttractionSwipe');
    /**
     * before hooks
     */
    yield Promise.all(beforeHooks.map((hook) => {
        console.log(`Running before hook: "${hook.name}"`);
        return hook(event, ...args);
    }));
    /**
     * Main query
     */
    const { userId, tripId, attractionId } = event.arguments.input;
    // check if attractionSwipe already exists
    const existingAttractionSwipe = yield _privateGetAttractionSwipe({ userId, tripId, attractionId });
    if (existingAttractionSwipe) {
        // update existing attractionSwipe
        const updatedAttractionSwipe = yield _privateUpdateAttractionSwipe(event.arguments);
        if (!updatedAttractionSwipe) {
            throw new Error('Failed to update attractionSwipe');
        }
        return updatedAttractionSwipe;
    }
    // add label to variables
    const createSwipeVariables = Object.assign(Object.assign({}, event.arguments), { input: Object.assign(Object.assign({}, event.arguments.input), { label: API_1.AttractionSwipeLabel.SWIPE }) });
    const attractionSwipe = yield _privateCreateAttractionSwipe(createSwipeVariables);
    if (!attractionSwipe) {
        throw new Error('Failed to create userTrip');
    }
    /**
     * after hooks
     */
    // none
    return attractionSwipe;
});
exports.default = putAttractionSwipe;
