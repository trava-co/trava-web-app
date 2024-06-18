"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostSimilarMultiResponses = exports.determineLogistics = exports.getMostSimilarResponse = exports.DESCRIPTIVE_CONTEXT = void 0;
const constants_1 = require("../constants");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
var DESCRIPTIVE_CONTEXT;
(function (DESCRIPTIVE_CONTEXT) {
    DESCRIPTIVE_CONTEXT["RESERVATION"] = "reservation policies";
    DESCRIPTIVE_CONTEXT["COST"] = "cost per person";
    DESCRIPTIVE_CONTEXT["DURATION"] = "duration in hours";
    DESCRIPTIVE_CONTEXT["CATEGORIES"] = "categories";
})(DESCRIPTIVE_CONTEXT || (exports.DESCRIPTIVE_CONTEXT = DESCRIPTIVE_CONTEXT = {}));
const getMostSimilarResponseConversation = ({ context, offSchemaValue, possibleValues }) => {
    const chat = [
        {
            role: 'system',
            content: 'Normalize data to a schema. Given a context, an off-schema value, and acceptable values, choose the closest match. Only respond with your selection.',
        },
    ];
    chat.push({
        role: 'user',
        content: `Context: ${context}. Off-schema value: ${offSchemaValue}. Acceptable values: ${possibleValues.join(', ')}`,
    });
    return chat;
};
const getMostSimilarResponseFunctions = (validValues) => {
    const functions = [
        {
            name: 'log_valid_value',
            description: 'Provided a valid value, log it to the console',
            parameters: {
                type: 'object',
                properties: {
                    validValue: {
                        type: 'string',
                        description: 'A valid value that conforms to the schema',
                        enum: validValues,
                    },
                },
                required: ['validValue'],
            },
        },
    ];
    return functions;
};
const getMostSimilarResponse = async ({ context, offSchemaValue, possibleValues, }) => {
    const chatMessages = getMostSimilarResponseConversation({
        context,
        offSchemaValue,
        possibleValues,
    });
    const functions = getMostSimilarResponseFunctions(possibleValues);
    const mostSimilarResponse = await (0, askOpenAIChat_1.askOpenAIChat)({
        messages: chatMessages,
        functions,
        model: constants_1.CHAT_MODELS.NEW_GPT_4,
        temperature: 0,
        callFunction: {
            // force openai to call the function
            type: 'function',
            function: {
                name: 'log_valid_value',
            },
        },
        maxTokensForAnswer: 50,
        context: `${context}: getMostSimilarResponse gpt-4 fallback`,
    });
    const { validValue } = mostSimilarResponse;
    return validValue;
};
exports.getMostSimilarResponse = getMostSimilarResponse;
const determineLogisticsConversation = (description) => {
    const chat = [
        {
            role: 'system',
            content: `Provided a description of an attraction, output logistics values that conform to the schema.`,
        },
        {
            role: 'user',
            content: description,
        },
    ];
    return chat;
};
const determineLogisticsFunctions = ({ possibleTravaCategories, possibleReservationValues, possibleTargetGroups, }) => {
    // for each argument, add "UNKNOWN" as a possible value
    // if onlineLLM doesn't provide this info, then we'll fallback to user reviews to determine the logistics
    const possibleTravaCategoriesWithUnknown = [...possibleTravaCategories, constants_1.UNKNOWN];
    const possibleReservationValuesWithUnknown = [...possibleReservationValues, constants_1.UNKNOWN];
    const possibleTargetGroupsWithUnknown = [...possibleTargetGroups, constants_1.UNKNOWN];
    const functions = [
        {
            name: 'log_logistics',
            description: 'Provided values for logistics, log them to the console',
            parameters: {
                type: 'object',
                properties: {
                    categories: {
                        type: 'array',
                        description: 'An array of one or two categories',
                        items: {
                            type: 'string',
                            enum: possibleTravaCategoriesWithUnknown,
                        },
                    },
                    reservations: {
                        type: 'string',
                        description: 'Reservation policy',
                        enum: possibleReservationValuesWithUnknown,
                    },
                    targetGroups: {
                        type: 'array',
                        description: 'An array of one or more target groups',
                        items: {
                            type: 'string',
                            enum: possibleTargetGroupsWithUnknown,
                        },
                    },
                },
                required: ['categories', 'reservations', 'targetGroups'],
            },
        },
    ];
    return functions;
};
const determineLogistics = async ({ description, possibleTravaCategories, possibleReservationValues, possibleTargetGroups, }) => {
    const chatMessages = determineLogisticsConversation(description);
    const functions = determineLogisticsFunctions({
        possibleTravaCategories,
        possibleReservationValues,
        possibleTargetGroups,
    });
    const logistics = (await (0, askOpenAIChat_1.askOpenAIChat)({
        messages: chatMessages,
        functions,
        model: constants_1.CHAT_MODELS.NEW_GPT_4,
        temperature: 0,
        callFunction: {
            // force openai to call the function
            type: 'function',
            function: {
                name: 'log_logistics',
            },
        },
        maxTokensForAnswer: 100,
        context: `determine logistics from onlineLLM descriptions`,
    }));
    // for each of the logistics, filter out UNKNOWN
    const { categories, reservations, targetGroups } = logistics;
    const validCategories = categories.filter((category) => category !== constants_1.UNKNOWN);
    const validReservations = reservations !== constants_1.UNKNOWN ? reservations : undefined;
    const validTargetGroups = targetGroups.filter((group) => group !== constants_1.UNKNOWN);
    const validLogistics = {
        categories: validCategories,
        reservations: validReservations,
        targetGroups: validTargetGroups,
    };
    return validLogistics;
};
exports.determineLogistics = determineLogistics;
const getMostSimilarMultiResponseConversation = ({ context, offSchemaValue, possibleValues }) => {
    const chat = [
        {
            role: 'system',
            content: 'Normalize data to a schema. Given a context, an off-schema value, and acceptable values, choose the closest matches. Only respond with your selection.',
        },
    ];
    chat.push({
        role: 'user',
        content: `Context: ${context}. Off-schema value: ${offSchemaValue}. Acceptable values: ${possibleValues.join(', ')}`,
    });
    return chat;
};
const getMostSimilarMultiResponseFunctions = (validValues) => {
    const functions = [
        {
            name: 'log_valid_values',
            description: 'Provided one or more valid values, log them to the console',
            parameters: {
                type: 'object',
                properties: {
                    selectedValues: {
                        type: 'array',
                        description: 'An array of one or more valid values that conform to the schema',
                        items: {
                            type: 'string',
                            enum: validValues,
                        },
                    },
                },
                required: ['selectedValues'],
            },
        },
    ];
    return functions;
};
const getMostSimilarMultiResponses = async ({ context, offSchemaValue, possibleValues, }) => {
    const chatMessages = getMostSimilarMultiResponseConversation({
        context,
        offSchemaValue,
        possibleValues,
    });
    const functions = getMostSimilarMultiResponseFunctions(possibleValues);
    const mostSimilarResponse = await (0, askOpenAIChat_1.askOpenAIChat)({
        messages: chatMessages,
        functions,
        model: constants_1.CHAT_MODELS.NEW_GPT_4,
        temperature: 0,
        callFunction: {
            // force openai to call the function
            type: 'function',
            function: {
                name: 'log_valid_values',
            },
        },
        maxTokensForAnswer: 50,
        context: `${context}: getMostSimilarMultiResponse gpt-4 fallback`,
    });
    const { selectedValues } = mostSimilarResponse;
    return selectedValues;
};
exports.getMostSimilarMultiResponses = getMostSimilarMultiResponses;
