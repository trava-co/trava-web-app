"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaCategories = void 0;
const API_1 = require("shared-types/API");
const constants_1 = require("../constants");
const createEmbeddings_1 = require("../createEmbeddings");
const cosineSimilarities_1 = require("../cosineSimilarities");
const embeddings_1 = require("../../embeddings");
const questions_1 = require("../prompts/questions");
const categories_1 = require("../prompts/categories");
const buildRelevantInputText_1 = require("../buildRelevantInputText");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const TravaCardCreationErrors_1 = require("../TravaCardCreationErrors");
const categoryOrCuisineEmbeddings = {
    DO: embeddings_1.attractionCategoryEmbeddings,
    EAT: embeddings_1.attractionCuisineEmbeddings,
};
const RESPONSE_TOKENS = 100; // 100 is the max tokens for a chat response
async function getTravaCategories({ attractionId, attractionName, destinationName, recommendationSourceCategories, attractionType, relevanceMap, }) {
    console.log(`getTravaCategories for ${attractionName} \nrecommendationSourceCategories: ${recommendationSourceCategories}`);
    const isTypeDo = attractionType === API_1.ATTRACTION_TYPE.DO;
    const isTypeEat = attractionType === API_1.ATTRACTION_TYPE.EAT;
    // create deep copy of possibleCategories so that deletions don't affect the original
    const possibleTravaCategories = JSON.parse(JSON.stringify(categories_1.possibleCategories[attractionType]));
    const travaCategories = [];
    const nonTravaCategories = [];
    recommendationSourceCategories?.forEach((recSourceCategory) => {
        if (isTypeEat) {
            nonTravaCategories.push(`Restaurant Cuisine: ${recSourceCategory.toUpperCase()}`);
        }
        else if (isTypeDo) {
            nonTravaCategories.push(`Attraction Category: ${recSourceCategory.toUpperCase()}`);
        }
    });
    if (!nonTravaCategories.length) {
        // if recommendationSourceCategories is not provided, then we need to query openai for the categories
        const categoriesQuestion = isTypeDo ? questions_1.questions.DO.CATEGORIES : questions_1.questions.EAT.CUISINES;
        const reviewSentencesAboutCategories = Object.keys(relevanceMap[categoriesQuestion]);
        const buildChatThread = (inputWithNewSentence) => {
            return (0, categories_1.getCategoriesChatThread)(attractionName, destinationName, attractionType, inputWithNewSentence);
        };
        let functions = null;
        if (isTypeDo) {
            functions = [
                {
                    name: 'log_attraction_categories',
                    description: 'Provided the appropriate categories for a given attraction, logs them to the console',
                    parameters: {
                        type: 'object',
                        properties: {
                            attractionCategories: {
                                type: 'array',
                                description: 'The categories of the attraction',
                                items: {
                                    type: 'string',
                                    enum: Object.values(possibleTravaCategories),
                                },
                            },
                        },
                        required: ['attractionCategories'],
                    },
                },
            ];
        }
        else if (isTypeEat) {
            functions = [
                {
                    name: 'log_restaurant_cuisines',
                    description: 'Provided the appropriate cuisines of a restaurant, logs them to the console',
                    parameters: {
                        type: 'object',
                        properties: {
                            restaurantCuisines: {
                                type: 'array',
                                description: 'The cuisines of the restaurant',
                                items: {
                                    type: 'string',
                                    enum: Object.values(possibleTravaCategories),
                                },
                            },
                        },
                        required: ['restaurantCuisines'],
                    },
                },
            ];
        }
        let openAICategoriesInput;
        try {
            openAICategoriesInput = (0, buildRelevantInputText_1.buildRelevantInputText)({
                relevantSentences: reviewSentencesAboutCategories,
                buildChatThread,
                functions: functions,
                responseTokens: RESPONSE_TOKENS,
                maxDiscretionaryInputTokens: 750,
            });
        }
        catch (error) {
            console.error('Error building relevant input text for getTravaCategories');
            throw error;
        }
        const { messages } = openAICategoriesInput;
        let response;
        try {
            response = await (0, askOpenAIChat_1.askOpenAIChat)({
                messages,
                functions: functions,
                temperature: 0,
                model: constants_1.CHAT_MODELS.NEW_GPT_3,
                callFunction: {
                    // force openai to call the function
                    type: 'function',
                    function: {
                        name: isTypeDo ? 'log_attraction_categories' : 'log_restaurant_cuisines',
                    },
                },
                maxTokensForAnswer: RESPONSE_TOKENS,
                context: `${attractionName} in ${destinationName}: getTravaCategories`,
            });
        }
        catch (error) {
            console.error('Error asking openai for categories in getTravaCategories');
            throw error;
        }
        // parse the response's function call arguments
        const categories = isTypeDo ? response.attractionCategories : response.restaurantCuisines;
        console.log(`chat completions for ${attractionName} in ${destinationName} responded with trava categories: ${categories}`);
        categories.forEach((categoryOrCuisine) => {
            if (Object.values(possibleTravaCategories).includes(categoryOrCuisine)) {
                travaCategories.push(categoryOrCuisine);
                // remove the category from possibleTravaCategories, so that later similarity score computed for categories not already included. If most similar category is above threshold, will be added.
                delete possibleTravaCategories[categoryOrCuisine];
            }
            else {
                // if chat response contains a category that isn't in the trava categories, add it to the nonTravaCategories
                nonTravaCategories.push(`${isTypeDo ? 'Attraction Category' : 'Restaurant Cuisine'}: ${categoryOrCuisine}`);
            }
        });
        // if there are travaCategories and no nonTravaCategories, then we can just return the travaCategories
        if (travaCategories.length && !nonTravaCategories.length) {
            return travaCategories;
        }
        // if there are no nonTravaCategories or possibleTravaCategories, no use in continuing
        if (nonTravaCategories.length === 0 || Object.keys(possibleTravaCategories).length === 0) {
            if (!travaCategories.length) {
                throw new TravaCardCreationErrors_1.TravaCategoriesError({
                    message: 'no trava categories or cuisines found, and none returned by openai',
                    attractionId,
                    attractionName,
                    destinationName,
                });
            }
            return travaCategories;
        }
    }
    let nonTravaCategoryEmbeddings;
    try {
        // process the nonTravaCategories, finding the best trava category for each
        nonTravaCategoryEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
            input: nonTravaCategories,
            attractionId,
            attractionName,
            destinationName,
            context: 'get embeddings for nonTravaCategories',
        });
    }
    catch (error) {
        console.error('Error creating embeddings for nonTravaCategories in getTravaCategories');
        throw error;
    }
    const travaCategoryOrCuisineWithEmbeddings = categoryOrCuisineEmbeddings[attractionType];
    const travaCategoriesWithScores = nonTravaCategoryEmbeddings.map((nonTravaCategoryEmbedding, nonTravaCategoryIndex) => {
        const bestMatch = Object.keys(possibleTravaCategories).reduce((best, travaCategoryOrCuisineName) => {
            const similarity = (0, cosineSimilarities_1.cosineSimilarity)(nonTravaCategoryEmbedding, travaCategoryOrCuisineWithEmbeddings[travaCategoryOrCuisineName]);
            // determines the best Trava category for the given nonTrava category
            return similarity > best.similarity ? { categoryOrCuisine: travaCategoryOrCuisineName, similarity } : best;
        }, { categoryOrCuisine: '', similarity: -Infinity });
        console.log(`Best match for ${nonTravaCategories[nonTravaCategoryIndex]} is ${bestMatch.categoryOrCuisine} with a similarity of ${bestMatch.similarity}`);
        return bestMatch;
    });
    // the categories are ordered by relevance. if score is above .93, we've found a great trava category match, so we maintain the order. otherwise, we sort by similarity.
    travaCategoriesWithScores.sort((a, b) => {
        if (a.similarity > 0.93 && b.similarity > 0.93) {
            return 0;
        }
        else {
            return b.similarity - a.similarity;
        }
    });
    travaCategoriesWithScores.forEach((category) => {
        let similarityThreshold = 0;
        // low bar for first category, then high bar for the rest
        if (travaCategories.length === 0) {
            if (isTypeEat) {
                similarityThreshold = 0.8;
            } // else it will be 0 for ATTRACTION_TYPE.DO, since DO does not have OTHER
        }
        else {
            similarityThreshold = 0.95;
        }
        if (category.similarity >= similarityThreshold) {
            travaCategories.push(category.categoryOrCuisine);
        }
    });
    // if there are no travaCategories, and attractionType is EAT, then add ATTRACTION_CUISINE_TYPE.OTHER
    if (!travaCategories.length && isTypeEat) {
        travaCategories.push(API_1.ATTRACTION_CUISINE_TYPE.OTHER);
    }
    // Dedupe categories
    const uniqueTravaCategories = [...new Set(travaCategories)];
    return uniqueTravaCategories;
}
exports.getTravaCategories = getTravaCategories;
