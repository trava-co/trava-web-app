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
const mutations_1 = require("shared-types/graphql/mutations");
function create(createTripDestinationMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateCreateTripDestinationAttraction,
            variables: createTripDestinationMutationVariables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateTripDestinationAttraction;
    });
}
const createTripDestinationAttraction = (event, attraction) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`after hook: creating tripDestinationAttraction for attraction: ${attraction.id}`);
    // if (event.arguments.input.isTravaCreated === 1) return null // don't create tripDestinationAttraction if admin creates trava attraction
    // if input has a tripId and destinationId (aka created within trip) create a tripDestinationAttraction
    if (event.arguments.input.tripId && event.arguments.input.destinationId) {
        yield create({
            input: {
                tripId: event.arguments.input.tripId,
                destinationId: event.arguments.input.destinationId,
                attractionId: attraction.id,
                isTravaCreated: event.arguments.input.isTravaCreated,
            },
        });
    }
    return null;
});
exports.default = createTripDestinationAttraction;
