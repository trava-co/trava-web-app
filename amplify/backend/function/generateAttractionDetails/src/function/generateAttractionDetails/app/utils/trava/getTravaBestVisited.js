"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaBestVisited = void 0;
const API_1 = require("shared-types/API");
const constants_1 = require("../constants");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const bestVisited_1 = require("../prompts/bestVisited");
const questions_1 = require("../prompts/questions");
const cosineSimilarities_1 = require("../cosineSimilarities");
const createEmbeddings_1 = require("../createEmbeddings");
const embeddings_1 = require("../../embeddings");
const buildRelevantInputText_1 = require("../buildRelevantInputText");
const filterBestVisitedByGoogleInfo_1 = require("./filterBestVisitedByGoogleInfo");
const bestVisitedEmbeddings = {
    DO: embeddings_1.doBestVisitedEmbeddings,
    EAT: embeddings_1.eatBestVisitedEmbeddings,
};
const RESPONSE_TOKENS = 100; // 100 is the max tokens for a chat response
const getTravaBestVisited = async ({ attractionId, attractionName, attractionType, relevanceMap, hours, destinationName, bestVisitedByPopularTimes, mealsServed, travaCuisines, }) => {
    console.log(`getTravaBestVisited for ${attractionName} in ${destinationName}`);
    const possibleBestVisitedTimesByType = Object.values(bestVisited_1.possibleBestVisitedTimes[attractionType]);
    // travaBestVisited is a set of ATTRACTION_BEST_VISIT_TIME
    let travaBestVisited = new Set();
    // if attractionType is EAT and travaCuisines contains ICE_CREAM_AND_DESSERTS, return SNACK
    if (attractionType === API_1.ATTRACTION_TYPE.EAT &&
        travaCuisines.includes(API_1.ATTRACTION_CUISINE_TYPE.ICE_CREAM_AND_DESSERTS)) {
        return [API_1.ATTRACTION_BEST_VISIT_TIME.SNACK];
    }
    if (bestVisitedByPopularTimes?.length ?? 0 > 0) {
        if (attractionType === API_1.ATTRACTION_TYPE.DO) {
            // for type DO, we already have the ordered popular times in the proper format
            return bestVisitedByPopularTimes;
        }
        else {
            const bestVisitedTimesMealsServedByRestaurant = (0, filterBestVisitedByGoogleInfo_1.filterBestVisitedByMealsServed)(bestVisitedByPopularTimes, mealsServed);
            // add the valid best visited times to the set
            bestVisitedTimesMealsServedByRestaurant.forEach((bestVisitedTime) => {
                travaBestVisited.add(bestVisitedTime);
            });
        }
    }
    // no information about snacks, so fallback to asking openai and then using cosine similarity to ensure arguments conform to our data schema. Also, need to validate the best times to visit are open and that google says they serve the meal.
    const bestVisitedQuestion = questions_1.questions[attractionType].BEST_VISITED;
    const reviewSentencesAboutBestVisited = Object.keys(relevanceMap[bestVisitedQuestion]);
    const buildChatThread = (inputWithNewSentence) => {
        return (0, bestVisited_1.getTravaBestVisitedChatThread)(attractionName, destinationName, attractionType, inputWithNewSentence, hours?.weekdayText);
    };
    let functions;
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        functions = [
            {
                name: 'log_best_times_to_visit',
                description: 'Provided an array of best times to visit, logs them to the console',
                parameters: {
                    type: 'object',
                    properties: {
                        bestVisited: {
                            type: 'array',
                            description: 'The best times to visit the attraction',
                            items: {
                                type: 'string',
                                enum: possibleBestVisitedTimesByType,
                            },
                        },
                    },
                    required: ['bestVisited'],
                },
            },
        ];
    }
    else {
        functions = [
            {
                name: 'log_best_times_to_visit',
                description: 'Provided an array of best times to visit, logs them to the console',
                parameters: {
                    type: 'object',
                    properties: {
                        bestVisited: {
                            type: 'array',
                            description: 'The best times to visit the restaurant',
                            items: {
                                type: 'string',
                                enum: possibleBestVisitedTimesByType,
                            },
                        },
                    },
                    required: ['bestVisited'],
                },
            },
        ];
    }
    let openAIBestVisitedInput;
    try {
        openAIBestVisitedInput = (0, buildRelevantInputText_1.buildRelevantInputText)({
            relevantSentences: reviewSentencesAboutBestVisited,
            buildChatThread,
            functions,
            responseTokens: RESPONSE_TOKENS,
            maxDiscretionaryInputTokens: 500,
        });
    }
    catch (error) {
        console.error('Error building relevant input text for getTravaBestVisited');
        throw error;
    }
    const { messages } = openAIBestVisitedInput;
    let response;
    try {
        response = (await (0, askOpenAIChat_1.askOpenAIChat)({
            messages,
            functions,
            temperature: 0,
            model: constants_1.CHAT_MODELS.NEW_GPT_3,
            callFunction: {
                // force openai to call the function
                type: 'function',
                function: {
                    name: 'log_best_times_to_visit',
                },
            },
            maxTokensForAnswer: RESPONSE_TOKENS,
            context: `${attractionName} in ${destinationName}: getTravaBestVisited`,
        }));
    }
    catch (error) {
        console.error(`Error asking openai for best visited in getTravaBestVisited`);
        throw error;
    }
    // parse the response's function call arguments
    const { bestVisited } = response;
    console.log(`chat completions for ${attractionName} in ${destinationName} responded with trava best visited: ${bestVisited}`);
    let compliantBestVisitedFromChat = new Set();
    let incompliantBestVisitedFromChat = new Set();
    bestVisited.forEach((bestVisitedTime) => {
        if (possibleBestVisitedTimesByType.includes(bestVisitedTime)) {
            compliantBestVisitedFromChat.add(bestVisitedTime);
        }
        else {
            incompliantBestVisitedFromChat.add(bestVisitedTime);
        }
    });
    if (incompliantBestVisitedFromChat.size > 0) {
        // for each incompliantBestVisitedFromChat, find the most similar travaBestVisitedTime
        // create embeddings for all incompliantBestVisitedFromChat
        let nonTravaBestVisitedEmbeddings;
        try {
            nonTravaBestVisitedEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
                input: Array.from(incompliantBestVisitedFromChat),
                attractionId,
                attractionName,
                destinationName,
                context: `get embeddings for nonTravaBestVisitedEmbeddings`,
            });
        }
        catch (error) {
            console.error(`Error creating embeddings for nonTravaBestVisitedEmbeddings in getTravaBestVisited`);
            throw error;
        }
        const possibleBestVisitedTimesForAttractionType = bestVisitedEmbeddings[attractionType];
        // for each nonTravaBestVisitedEmbedding, use cosineSimilarity to find the most similar possible best visited time
        for (let nonTravaBestVisitedEmbedding of nonTravaBestVisitedEmbeddings) {
            let maxSimilarity = -Infinity;
            let mostSimilarBestVisitedTime = null;
            for (let [possibleBestVisitedTime, possibleBestVisitedEmbedding] of Object.entries(possibleBestVisitedTimesForAttractionType)) {
                let similarity = (0, cosineSimilarities_1.cosineSimilarity)(nonTravaBestVisitedEmbedding, possibleBestVisitedEmbedding);
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    mostSimilarBestVisitedTime = possibleBestVisitedTime;
                }
            }
            compliantBestVisitedFromChat.add(mostSimilarBestVisitedTime);
        }
    }
    // Filter out best visited times that are outside of the attraction's operating hours
    const bestVisitedTimesFilteredByOperatingHours = (0, filterBestVisitedByGoogleInfo_1.filterBestVisitedByOperatingHours)(Array.from(compliantBestVisitedFromChat), hours?.periods);
    // if type do, return the filtered best visited times
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        return bestVisitedTimesFilteredByOperatingHours;
    }
    else {
        // type EAT
        // if google meals served is defined, filter out best visited times that are not served by the restaurant
        const bestVisitedTimesMealsServedByRestaurant = Array.from((0, filterBestVisitedByGoogleInfo_1.filterBestVisitedByMealsServed)(bestVisitedTimesFilteredByOperatingHours, mealsServed));
        if ((bestVisitedByPopularTimes?.length ?? 0) > 0 && travaBestVisited?.size > 0) {
            // determine the index of SNACK in bestVisitedTimesMealsServedByRestaurant, and place into travaBestVisited at that index
            const snackIndex = bestVisitedTimesMealsServedByRestaurant.indexOf(API_1.ATTRACTION_BEST_VISIT_TIME.SNACK);
            const travaBestVisitedArray = Array.from(travaBestVisited);
            if (snackIndex > -1) {
                travaBestVisitedArray.splice(snackIndex, 0, API_1.ATTRACTION_BEST_VISIT_TIME.SNACK);
            }
            return travaBestVisitedArray;
        }
        else {
            return bestVisitedTimesMealsServedByRestaurant;
        }
    }
};
exports.getTravaBestVisited = getTravaBestVisited;
