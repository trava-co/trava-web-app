"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRelevantInputText = void 0;
const askOpenAIChat_1 = require("./openai/askOpenAIChat");
const countTokensApproximation_1 = require("./openai/countTokensApproximation");
const MAX_TOKENS_WITH_BUFFER = askOpenAIChat_1.MAX_TOKENS - 100;
function calculateApproximateTokens(textSegments) {
    const totalWords = textSegments.reduce((total, segment) => total + segment.split(' ').length, 0);
    // Assuming roughly 4 tokens per 3 words. This is an approximation, actual number of tokens can vary.
    return totalWords * (4 / 3); // 100 tokens is about 75 words per this: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
}
function buildRelevantInputText({ relevantSentences, buildChatThread, functions, responseTokens = 100, inputThatMustBeIncluded, maxDiscretionaryInputTokens, // the number of additional tokens to add beyond the required tokens (required = prompt + inputThatMustBeIncluded + functions + responseTokens)
 }) {
    let inputThatMustBeIncludedTokens = 0;
    let functionsTokens = 0;
    const mostRelevantSentences = [];
    let sentencesSet = new Set();
    if (inputThatMustBeIncluded) {
        inputThatMustBeIncludedTokens = (0, countTokensApproximation_1.countTokensApproximation)(inputThatMustBeIncluded);
        mostRelevantSentences.push(inputThatMustBeIncluded);
    }
    if (functions?.length) {
        // functions cost tokens, too. we should json stringify them and add subtract their token cost from the total
        const functionsString = JSON.stringify(functions);
        functionsTokens = (0, countTokensApproximation_1.countTokensApproximation)(functionsString);
    }
    const emptyInputPromptTokens = (0, countTokensApproximation_1.countTokensApproximation)(JSON.stringify(buildChatThread('')));
    const requiredInputTokens = emptyInputPromptTokens + inputThatMustBeIncludedTokens + functionsTokens;
    let remainingDiscretionaryInputTokens = MAX_TOKENS_WITH_BUFFER - requiredInputTokens - responseTokens;
    if (maxDiscretionaryInputTokens) {
        remainingDiscretionaryInputTokens = Math.min(remainingDiscretionaryInputTokens, maxDiscretionaryInputTokens);
    }
    // add sentences to the input until we reach the remainingDiscretionaryInputTokens limit
    for (let sentence of relevantSentences) {
        const inputWithNewSentence = [...mostRelevantSentences, sentence].join(' ');
        const approximateTokens = calculateApproximateTokens([inputWithNewSentence]);
        if (sentencesSet.has(sentence)) {
            continue;
        }
        if (approximateTokens > remainingDiscretionaryInputTokens) {
            break;
        }
        mostRelevantSentences.push(sentence);
        sentencesSet.add(sentence);
    }
    // confirm that the final input is within the token limit
    let messages = buildChatThread(mostRelevantSentences.join(' '));
    let inputPromptLength = (0, countTokensApproximation_1.countTokensApproximation)(JSON.stringify(messages)) + functionsTokens;
    // if inputPromptLength is greater than remainingDiscretionaryInputTokens + required tokens, iteratively remove the last sentence until it is within the token limit
    while (inputPromptLength > remainingDiscretionaryInputTokens + requiredInputTokens) {
        mostRelevantSentences.pop();
        messages = buildChatThread(mostRelevantSentences.join(' '));
        inputPromptLength = (0, countTokensApproximation_1.countTokensApproximation)(JSON.stringify(messages));
    }
    return { messages, finalInputPromptLength: inputPromptLength };
}
exports.buildRelevantInputText = buildRelevantInputText;
