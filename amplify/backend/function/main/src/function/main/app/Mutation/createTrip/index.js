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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const createTripDestinations_1 = __importDefault(require("./after/createTripDestinations"));
const createUserTrips_1 = __importDefault(require("./after/createUserTrips"));
const syncAfterHooks = [createUserTrips_1.default, createTripDestinations_1.default];
function _privateCreateTrip(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCustomPrivateCreateTrip,
            variables: {
                input: {
                    id: variables.input.id,
                    link: variables.input.link,
                    name: variables.input.name,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateTrip;
    });
}
const createTrip = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('createTrip');
    /**
     * before hooks
     */
    // none
    /**
     * Main query
     */
    const trip = yield _privateCreateTrip(event.arguments);
    if (!trip) {
        throw new Error('Failed to create trip');
    }
    /**
     * sync after
     */
    for (const hook of syncAfterHooks) {
        console.log(`Running sync after hook: "${hook.name}"`);
        yield hook(event, trip);
    }
    return trip;
});
exports.default = createTrip;
