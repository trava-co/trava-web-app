"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatErrors = exports.retryOpenAIWithExponentialBackoff = void 0;
const logError_1 = require("../logError");
const ChatErrors = __importStar(require("./ChatErrors"));
exports.ChatErrors = ChatErrors;
const error_1 = require("openai/error");
// Define function for exponential backoff
async function retryOpenAIWithExponentialBackoff(func, initialDelay = 1, exponentialBase = 2, jitter = true, maxRetries = 5) {
    let delay = initialDelay;
    let retries = 0;
    while (true) {
        try {
            return await func();
        }
        catch (error) {
            retries++;
            if (
            // if it's a 429 error, we should attempt more retries
            (retries > maxRetries && error instanceof error_1.APIError && error?.status !== 429) ||
                retries > 8) {
                await (0, logError_1.logError)({
                    error: error,
                    context: `MAX RETRIES (${maxRetries}) EXCEEDED. THROWING ERROR.`,
                    shouldThrow: true,
                });
            }
            else {
                (0, logError_1.logError)({
                    error: error,
                    context: `retryOpenAIWithExponentialBackoff: retrying in ${delay} seconds.`,
                });
            }
            if (jitter) {
                delay *= exponentialBase * (1 + Math.random());
            }
            else {
                delay *= exponentialBase;
            }
            await new Promise((resolve) => setTimeout(resolve, delay * 1000));
        }
    }
}
exports.retryOpenAIWithExponentialBackoff = retryOpenAIWithExponentialBackoff;
