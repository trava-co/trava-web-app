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
const checkAttractionAccessUpdate_1 = __importDefault(require("./before/checkAttractionAccessUpdate"));
const checkAtractionUpdateInput_1 = __importDefault(require("./before/checkAtractionUpdateInput"));
const lambda_1 = require("shared-types/graphql/lambda");
const beforeHooks = [checkAtractionUpdateInput_1.default, checkAttractionAccessUpdate_1.default];
function _privateUpdateAttraction(updateAttractionMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateAttraction,
            variables: {
                input: Object.assign({}, updateAttractionMutationVariables.input),
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateAttraction;
    });
}
const updateUserAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    for (const hook of beforeHooks) {
        console.log(`Running before hook: "${hook.name}"`);
        yield hook(event);
    }
    /**
     * Main query
     */
    const attraction = yield _privateUpdateAttraction(event.arguments);
    if (!attraction) {
        throw new Error('Failed to update attraction');
    }
    return attraction;
});
exports.default = updateUserAttraction;
