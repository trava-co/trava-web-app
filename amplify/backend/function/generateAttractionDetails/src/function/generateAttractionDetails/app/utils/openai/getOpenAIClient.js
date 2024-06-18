"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
const getSSMVariable_1 = require("../getSSMVariable");
let openaiInstance = null;
async function getOpenAIClient() {
    if (openaiInstance) {
        return openaiInstance;
    }
    const OPENAI_API_KEY = await (0, getSSMVariable_1.getSSMVariable)('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not defined');
    }
    openaiInstance = new openai_1.default({
        apiKey: OPENAI_API_KEY,
    });
    return openaiInstance;
}
exports.getOpenAIClient = getOpenAIClient;
