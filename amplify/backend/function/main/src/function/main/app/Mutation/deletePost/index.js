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
const checkPostAccessDelete_1 = __importDefault(require("./before/checkPostAccessDelete"));
const lambda_1 = require("shared-types/graphql/lambda");
const beforeHooks = [checkPostAccessDelete_1.default];
const deletePost = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    // only owner (authorId) or user within group "admin" can soft delete post
    const deletedPost = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateUpdatePost,
        variables: {
            input: {
                id: event.arguments.input.id,
                deletedAt: new Date().toISOString(),
            },
        },
    });
    return (_a = deletedPost.data) === null || _a === void 0 ? void 0 : _a.privateUpdatePost;
});
exports.default = deletePost;
