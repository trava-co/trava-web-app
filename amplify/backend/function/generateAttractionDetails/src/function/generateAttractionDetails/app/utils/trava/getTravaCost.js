"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaCost = void 0;
const API_1 = require("shared-types/API");
const constants_1 = require("../constants");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const questions_1 = require("../prompts/questions");
const cosineSimilarities_1 = require("../cosineSimilarities");
const createEmbeddings_1 = require("../createEmbeddings");
const embeddings_1 = require("../../embeddings");
const cost_1 = require("../prompts/cost");
const buildRelevantInputText_1 = require("../buildRelevantInputText");
const TravaCardCreationErrors_1 = require("../TravaCardCreationErrors");
const logError_1 = require("../logError");
const mostSimilarResponse_1 = require("../prompts/mostSimilarResponse");
const travaCostEmbeddings = { DO: embeddings_1.doCostEmbeddings, EAT: embeddings_1.eatCostEmbeddings };
const RESPONSE_TOKENS = 100; // 100 is the max tokens for a chat response
const getTravaCost = async ({ attractionId, attractionName, destinationName, recSourcePrice, attractionType, relevanceMap, bingDescription, }) => {
    console.log(`getTravaCost for ${attractionName}`);
    const isTypeDo = attractionType === API_1.ATTRACTION_TYPE.DO;
    const isTypeEat = attractionType === API_1.ATTRACTION_TYPE.EAT;
    const possibleCostValuesByType = Object.values(cost_1.possibleCosts[attractionType]);
    if (isTypeDo && bingDescription) {
        // query openai for categories from bing descriptions
        // necessary because for DO, categories from rec sources aren't always available/more variable
        // if value does not conform, then ask gpt-4 functions api
        const possibleCostValuesByTypeWithUnknown = [...possibleCostValuesByType, constants_1.UNKNOWN];
        const possiblyValidValue = await (0, mostSimilarResponse_1.getMostSimilarResponse)({
            context: mostSimilarResponse_1.DESCRIPTIVE_CONTEXT.COST,
            offSchemaValue: bingDescription,
            possibleValues: possibleCostValuesByTypeWithUnknown,
        });
        console.log(`gpt-4 chat completions for ${attractionName} in ${destinationName} responded with cost: ${possiblyValidValue} as being most similar to bing description`);
        if (possibleCostValuesByType.includes(possiblyValidValue)) {
            return possiblyValidValue;
        }
        console.log("gpt-4 didn't return a valid value for cost from bing description. Falling back to reviews.");
    }
    if (isTypeEat && recSourcePrice) {
        // recSourcePrice exists, which will be the case for > 2/3 of restaurants
        // likely can't trust for type DO. Only 1/35 attractions have recSourcePrice, anyways
        if (recSourcePrice > 4) {
            throw new TravaCardCreationErrors_1.TravaCostError({
                message: 'recSourcePrice is greater than 4',
                attractionId,
                attractionName,
                destinationName,
            });
        }
        return possibleCostValuesByType[recSourcePrice - 1];
    }
    const costQuestion = questions_1.questions[attractionType].COST;
    const reviewSentencesAboutCost = Object.keys(relevanceMap[costQuestion]);
    const buildChatThread = (inputWithNewSentence) => {
        return (0, cost_1.getCostChatThread)(attractionName, destinationName, attractionType, inputWithNewSentence);
    };
    let functions = null;
    if (isTypeDo) {
        functions = [
            {
                name: 'log_cost',
                description: 'Logs to the console the average cost per person to experience the attraction',
                parameters: {
                    type: 'object',
                    properties: {
                        cost: {
                            type: 'string',
                            description: 'The average cost per person to experience the attraction',
                            enum: possibleCostValuesByType,
                        },
                    },
                    required: ['cost'],
                },
            },
        ];
    }
    else if (isTypeEat) {
        functions = [
            {
                name: 'log_cost',
                description: 'Logs to the console the average cost per person to eat at the restaurant',
                parameters: {
                    type: 'object',
                    properties: {
                        cost: {
                            type: 'string',
                            description: 'The average cost per person to eat at the restaurant',
                            enum: possibleCostValuesByType,
                        },
                    },
                    required: ['cost'],
                },
            },
        ];
    }
    let openAICostInput;
    try {
        openAICostInput = (0, buildRelevantInputText_1.buildRelevantInputText)({
            relevantSentences: reviewSentencesAboutCost,
            buildChatThread,
            functions: functions,
            responseTokens: RESPONSE_TOKENS,
            maxDiscretionaryInputTokens: 500,
        });
    }
    catch (error) {
        console.error('Error building relevant input text for getTravaCost');
        throw error;
    }
    const { messages } = openAICostInput;
    let response;
    try {
        // Ask GPT to take its best guess at the cost given its own knowledge and the input
        response = await (0, askOpenAIChat_1.askOpenAIChat)({
            messages,
            functions: functions,
            model: constants_1.CHAT_MODELS.NEW_GPT_3,
            temperature: 0,
            callFunction: {
                // force openai to call the function
                type: 'function',
                function: {
                    name: 'log_cost',
                },
            },
            maxTokensForAnswer: RESPONSE_TOKENS,
            context: `${attractionName} in ${destinationName}: getTravaCost`,
        });
    }
    catch (error) {
        console.error('Error asking OpenAI chat for getTravaCost');
        throw error;
    }
    // parse the response's function call arguments
    const { cost } = response;
    console.log(`chat completions for ${attractionName} in ${destinationName} responded with trava cost: ${cost}`);
    if (possibleCostValuesByType.includes(cost)) {
        return cost;
    }
    (0, logError_1.logError)({
        error: new Error(`getTravaCost: GPT-3 returned an improper value: ${cost}. Falling back to GPT-4.`),
    });
    // if value does not conform, then ask gpt-4 functions api
    const possiblyValidValue = await (0, mostSimilarResponse_1.getMostSimilarResponse)({
        context: mostSimilarResponse_1.DESCRIPTIVE_CONTEXT.COST,
        offSchemaValue: cost,
        possibleValues: possibleCostValuesByType,
    });
    console.log(`gpt-4 chat completions for ${attractionName} in ${destinationName} responded with cost: ${possiblyValidValue} as being most similar to ${cost}`);
    if (possibleCostValuesByType.includes(possiblyValidValue)) {
        return possiblyValidValue;
    }
    (0, logError_1.logError)({
        error: new Error(`getTravaCost GPT-4 returned an improper value: ${possiblyValidValue}. Falling back to cosine similarity.`),
    });
    let nonTravaCostEmbeddings;
    try {
        nonTravaCostEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
            input: [cost],
            attractionId,
            attractionName,
            destinationName,
            context: 'get embeddings for nonTravaCostEmbeddings',
        });
    }
    catch (error) {
        console.error('Error creating embeddings for getTravaCost');
        throw error;
    }
    const nonTravaCostEmbedding = nonTravaCostEmbeddings[0];
    const possibleTravaCostEmbeddings = travaCostEmbeddings[attractionType];
    // find closest cost value in possibleTravaCostEmbeddings to nonTravaCostEmbedding
    // note: possibleTravaCostEmbeddings is of type { [key: string]: number[]}, where key is the cost value and value is the embedding
    // so perform cosineSimilarity on each value in possibleTravaCostEmbeddings, and return the key with the highest cosineSimilarity
    const travaCost = Object.keys(possibleTravaCostEmbeddings).reduce((a, b) => (0, cosineSimilarities_1.cosineSimilarity)(nonTravaCostEmbedding, possibleTravaCostEmbeddings[a]) >
        (0, cosineSimilarities_1.cosineSimilarity)(nonTravaCostEmbedding, possibleTravaCostEmbeddings[b])
        ? a
        : b);
    // log the closest cost value
    console.log(`getTravaCost travaCost final classification: ${travaCost}`);
    return travaCost;
};
exports.getTravaCost = getTravaCost;
