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
const checkDestinationAccessCreate_1 = __importDefault(require("./before/checkDestinationAccessCreate"));
const mutations_1 = require("shared-types/graphql/mutations");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const beforeHooks = [checkDestinationAccessCreate_1.default];
function _privateCreateDestination(createDestinationMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const input = Object.assign(Object.assign({}, createDestinationMutationVariables.input), { label: 'Destination' });
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: mutations_1.privateCreateDestination,
            variables: { input },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateDestination;
    });
}
const createDestination = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    for (const hook of beforeHooks) {
        console.log(`Running before hook: "${hook.name}"`);
        yield hook(event);
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE);
    }
    /**
     * Main query
     */
    const createDestinationArguments = {
        input: Object.assign(Object.assign({}, event.arguments.input), { authorId: event.identity.sub || '' }),
    };
    const destination = yield _privateCreateDestination(createDestinationArguments);
    if (!destination) {
        throw new Error('Failed to create destination');
    }
    return destination;
});
exports.default = createDestination;
