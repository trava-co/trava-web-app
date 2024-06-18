"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaDuration = void 0;
const API_1 = require("shared-types/API");
const constants_1 = require("../constants");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const questions_1 = require("../prompts/questions");
const duration_1 = require("../prompts/duration");
const cosineSimilarities_1 = require("../cosineSimilarities");
const createEmbeddings_1 = require("../createEmbeddings");
const embeddings_1 = require("../../embeddings");
const buildRelevantInputText_1 = require("../buildRelevantInputText");
const logError_1 = require("../logError");
const mostSimilarResponse_1 = require("../prompts/mostSimilarResponse");
const travaDurationEmbeddings = {
    DO: embeddings_1.doDurationEmbeddings,
    EAT: embeddings_1.eatDurationEmbeddings,
};
const RESPONSE_TOKENS = 100;
const getTravaDuration = async ({ attractionId, attractionName, destinationName, attractionType, relevanceMap, travaBestVisited, recSourceDuration, }) => {
    console.log(`getting trava duration for ${attractionName} in ${destinationName}`);
    if (travaBestVisited[0] === API_1.ATTRACTION_BEST_VISIT_TIME.SNACK) {
        // snacks must be less than an hour
        return API_1.ATTRACTION_DURATION.LESS_THAN_AN_HOUR;
    }
    const possibleDurationValuesByType = Object.values(duration_1.possibleDurations[attractionType]);
    let duration = recSourceDuration;
    // if duration is not provided, get it from gpt 3.5
    if (!duration) {
        const durationQuestion = questions_1.questions[attractionType].DURATION;
        const reviewSentencesAboutDuration = Object.keys(relevanceMap[durationQuestion]);
        const buildChatThread = (inputWithNewSentence) => {
            return (0, duration_1.getTravaDurationChatThread)(attractionName, destinationName, attractionType, inputWithNewSentence);
        };
        let functions;
        if (attractionType === API_1.ATTRACTION_TYPE.DO) {
            functions = [
                {
                    name: 'log_duration',
                    description: 'Logs to the console the typical time spent at the attraction',
                    parameters: {
                        type: 'object',
                        properties: {
                            duration: {
                                type: 'string',
                                description: 'The typical time spent at the attraction',
                                enum: possibleDurationValuesByType,
                            },
                        },
                        required: ['duration'],
                    },
                },
            ];
        }
        else {
            functions = [
                {
                    name: 'log_duration',
                    description: 'Logs to the console the typical time spent at the restaurant',
                    parameters: {
                        type: 'object',
                        properties: {
                            duration: {
                                type: 'string',
                                description: 'The typical time spent at the restaurant for a meal',
                                enum: possibleDurationValuesByType,
                            },
                        },
                        required: ['duration'],
                    },
                },
            ];
        }
        let openAIDurationInput;
        try {
            openAIDurationInput = (0, buildRelevantInputText_1.buildRelevantInputText)({
                relevantSentences: reviewSentencesAboutDuration,
                buildChatThread,
                functions,
                responseTokens: RESPONSE_TOKENS,
                maxDiscretionaryInputTokens: 500,
            });
        }
        catch (error) {
            console.error('Error building relevant input text for getTravaDuration');
            throw error;
        }
        const { messages } = openAIDurationInput;
        let response;
        try {
            response = await (0, askOpenAIChat_1.askOpenAIChat)({
                messages,
                functions,
                temperature: 0,
                model: constants_1.CHAT_MODELS.NEW_GPT_3,
                callFunction: {
                    // force openai to call the function
                    type: 'function',
                    function: {
                        name: 'log_duration',
                    },
                },
                maxTokensForAnswer: RESPONSE_TOKENS,
                context: `${attractionName} in ${destinationName}: getTravaDuration`,
            });
        }
        catch (error) {
            console.error('Error asking OpenAI chat for getTravaDuration');
            throw error;
        }
        // parse the openAIDurationClassification for the duration value
        duration = response.duration;
        console.log(`chat completions for ${attractionName} in ${destinationName} responded with duration: ${duration}`);
        if (possibleDurationValuesByType.includes(duration)) {
            return duration;
        }
        (0, logError_1.logError)({
            error: new Error(`getTravaDuration: GPT-3 returned an improper value: ${duration}. Falling back to GPT-4.`),
        });
    }
    // if value does not conform, then ask gpt-4 functions api
    const possiblyValidValue = await (0, mostSimilarResponse_1.getMostSimilarResponse)({
        context: mostSimilarResponse_1.DESCRIPTIVE_CONTEXT.DURATION,
        offSchemaValue: duration,
        possibleValues: possibleDurationValuesByType,
    });
    console.log(`gpt-4 chat completions for ${attractionName} in ${destinationName} responded with duration: ${possiblyValidValue} as being most similar to ${duration}`);
    if (possibleDurationValuesByType.includes(possiblyValidValue)) {
        return possiblyValidValue;
    }
    (0, logError_1.logError)({
        error: new Error(`getTravaDuration GPT-4 returned an improper value: ${possiblyValidValue}. Falling back to cosine similarity.`),
    });
    let nonTravaDurationEmbeddings;
    try {
        // create embedding for openAIDurationClassification
        nonTravaDurationEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
            input: [duration],
            attractionId,
            attractionName,
            destinationName,
            context: 'get embeddings for nonTravaDurationEmbeddings',
        });
    }
    catch (error) {
        console.error('Error creating embeddings for getTravaDuration');
        throw error;
    }
    const nonTravaDurationEmbedding = nonTravaDurationEmbeddings[0];
    const possibleTravaDurationEmbeddings = travaDurationEmbeddings[attractionType];
    // find closest duration value in possibleTravaDurationEmbeddings to nonTravaDurationEmbedding
    // note: possibleTravaDurationEmbeddings is of type { [key: string]: number[]}, where key is the duration value and value is the embedding
    // so perform cosineSimilarity on each value in possibleTravaDurationEmbeddings, and return the key with the highest cosineSimilarity
    const travaDuration = Object.keys(possibleTravaDurationEmbeddings).reduce((a, b) => (0, cosineSimilarities_1.cosineSimilarity)(nonTravaDurationEmbedding, possibleTravaDurationEmbeddings[a]) >
        (0, cosineSimilarities_1.cosineSimilarity)(nonTravaDurationEmbedding, possibleTravaDurationEmbeddings[b])
        ? a
        : b);
    // log the closest duration value
    console.log(`getTravaDuration travaDuration: ${travaDuration}`);
    return travaDuration;
};
exports.getTravaDuration = getTravaDuration;
