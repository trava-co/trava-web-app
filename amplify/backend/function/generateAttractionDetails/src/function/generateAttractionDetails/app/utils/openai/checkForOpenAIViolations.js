"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForOpenAIViolations = void 0;
const getOpenAIClient_1 = require("./getOpenAIClient");
// @ts-ignore
const bad_words_1 = __importDefault(require("bad-words"));
const filter = new bad_words_1.default();
// query the openai moderation api to check for any violations with the input text.
async function checkForOpenAIViolations(input) {
    const openai = await (0, getOpenAIClient_1.getOpenAIClient)();
    try {
        console.log('checking for violations in input to openai...');
        const response = await openai.moderations.create({
            input,
        });
        // console.log(`Response from moderation API: ${JSON.stringify(response)}`)
        const flagged = response.results[0].flagged;
        if (flagged) {
            console.log(`Input was flagged by OpenAI's moderation API. Attempting to clean...`);
            filter.clean(input);
            console.log(`Cleaned input`);
            const responseNew = await openai.moderations.create({
                input,
            });
            return responseNew.results[0].flagged;
        }
    }
    catch (error) {
        console.error(JSON.stringify(error));
        console.error(`Error checking for violations with input: ${input}`);
        throw error;
    }
    return false;
}
exports.checkForOpenAIViolations = checkForOpenAIViolations;
