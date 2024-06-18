"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttraction = void 0;
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient"));
async function getAttraction(variables) {
    const res = await ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: lambda_1.lambdaGetDetailsForAttractionGeneration,
        variables,
    });
    // TODO unified error handler
    if (res.errors?.length) {
        // TODO handle error message parsing:
        throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
    }
    return res.data.getAttraction;
}
exports.getAttraction = getAttraction;
