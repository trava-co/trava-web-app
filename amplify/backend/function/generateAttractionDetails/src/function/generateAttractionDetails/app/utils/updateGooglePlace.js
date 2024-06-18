"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGooglePlace = void 0;
const ApiClient_1 = __importDefault(require("./ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const updateGooglePlace = async (updateGooglePlaceInput) => {
    const res = await ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateUpdateGooglePlace,
        variables: { input: updateGooglePlaceInput.input },
    });
    if (res.errors?.length) {
        throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
    }
    return res.data.privateUpdateGooglePlace;
};
exports.updateGooglePlace = updateGooglePlace;
