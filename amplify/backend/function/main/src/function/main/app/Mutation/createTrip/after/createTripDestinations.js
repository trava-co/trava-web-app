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
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
function create(tripDestination) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCustomCreateTripDestination,
            variables: {
                input: tripDestination,
            },
        });
        // TODO unified error handler\
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.createTripDestination;
    });
}
const createTripDestinations = (event, trip) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (event.identity && 'sub' in event.identity) {
        // https://stackoverflow.com/a/58429784 // filter array of destination objects with unique destinationId
        const uniqueDestinationIdsWithDates = [
            ...new Map(event.arguments.input.destinationIdsWithDates.map((item) => [item['id'], item])).values(),
        ];
        const tripDestinationPromises = uniqueDestinationIdsWithDates.map((destinationIdWithDates) => create({
            tripId: trip.id,
            destinationId: destinationIdWithDates.id,
            startDate: (destinationIdWithDates === null || destinationIdWithDates === void 0 ? void 0 : destinationIdWithDates.startDate) || undefined,
            endDate: (destinationIdWithDates === null || destinationIdWithDates === void 0 ? void 0 : destinationIdWithDates.endDate) || undefined,
        }));
        yield Promise.all(tripDestinationPromises);
    }
    return null;
});
exports.default = createTripDestinations;
