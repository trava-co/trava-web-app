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
const checkAttractionAccessDelete_1 = __importDefault(require("./before/checkAttractionAccessDelete"));
const lambda_1 = require("shared-types/graphql/lambda");
const beforeHooks = [checkAttractionAccessDelete_1.default];
const deleteAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
    // only owner (authorId) or user within group "admin" can soft delete attraction
    yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateUpdateAttraction,
        variables: {
            input: {
                id: event.arguments.input.id,
                deletedAt: new Date().toISOString(),
            },
        },
    });
});
exports.default = deleteAttraction;
