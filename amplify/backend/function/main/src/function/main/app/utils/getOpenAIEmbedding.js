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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const getSSMVariable_1 = require("./getSSMVariable");
const getOpenAIEmbedding = (searchString) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = yield (0, getSSMVariable_1.getSSMVariable)('OPENAI_API_KEY');
    const openaiConfig = new openai_1.Configuration({
        apiKey,
    });
    const openai = new openai_1.OpenAIApi(openaiConfig);
    try {
        const response = yield openai.createEmbedding({
            model: 'text-embedding-3-large',
            input: searchString,
        });
        return response.data.data[0].embedding;
    }
    catch (error) {
        console.log('[createEmbeddings error]', error);
        throw new Error('Error creating embedding');
    }
});
exports.default = getOpenAIEmbedding;
