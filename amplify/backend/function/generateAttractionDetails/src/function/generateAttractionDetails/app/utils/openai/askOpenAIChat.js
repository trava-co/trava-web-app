"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenAIChat = exports.DEFAULT_MAX_RESPONSE_TOKENS = exports.MAX_TOKENS = void 0;
const getOpenAIClient_1 = require("./getOpenAIClient");
const retryOpenAIWithExponentialBackoff_1 = require("./retryOpenAIWithExponentialBackoff");
const countTokensApproximation_1 = require("./countTokensApproximation");
exports.MAX_TOKENS = 4096;
exports.DEFAULT_MAX_RESPONSE_TOKENS = 500;
const costPerToken = {
    gpt3: {
        input: 0.001 / 1000,
        output: 0.002 / 1000,
    },
    gpt4: {
        input: 0.01 / 1000,
        output: 0.03 / 1000,
    },
};
let lastTokenTracker = null;
function updateTokenTracker(inputTokensUsed, outputTokensUsed, model, lastTokenTracker, firstMessageContent, context) {
    return {
        timestamp: new Date(),
        currentRequest: {
            estimatedCost: inputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.input : costPerToken.gpt3.input) +
                outputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.output : costPerToken.gpt3.output),
            inputTokensUsed: inputTokensUsed,
            outputTokensUsed: outputTokensUsed,
            model,
        },
        cumulative: {
            estimatedCost: (lastTokenTracker?.cumulative.estimatedCost ?? 0) +
                inputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.input : costPerToken.gpt3.input) +
                outputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.output : costPerToken.gpt3.output),
            inputTokensUsed: (lastTokenTracker?.cumulative.inputTokensUsed ?? 0) + inputTokensUsed,
            outputTokensUsed: (lastTokenTracker?.cumulative.outputTokensUsed ?? 0) + outputTokensUsed,
            requestsMade: (lastTokenTracker?.cumulative.requestsMade ?? 0) + 1,
        },
        firstMessageContent,
        context,
    };
}
const askOpenAIChat = async ({ messages, functions, callFunction, temperature, topP, maxTokensForAnswer, context, model, logging = false, allowEmptyResponse = false, }) => {
    const openai = await (0, getOpenAIClient_1.getOpenAIClient)();
    const task = async () => {
        let messagesWithFunctions = messages;
        if (functions) {
            // stringify the functions and add them to the messages for token counting purposes
            const functionsString = JSON.stringify(functions);
            const functionsMessage = {
                content: functionsString,
                role: 'function',
                name: 'placeholder',
            };
            messagesWithFunctions = [...messages, functionsMessage];
        }
        let response;
        try {
            response = await openai.chat.completions.create({
                model,
                messages,
                max_tokens: maxTokensForAnswer || exports.DEFAULT_MAX_RESPONSE_TOKENS,
                temperature: temperature || 0.5,
                top_p: topP || 1,
                ...(functions?.length && {
                    tools: functions.map((func) => ({
                        function: func,
                        type: 'function',
                    })),
                }),
                ...(callFunction && { tool_choice: callFunction }), // forces openai to call the function
            });
        }
        catch (error) {
            const inputTokensUsed = (0, countTokensApproximation_1.countTokensApproximation)(JSON.stringify(messagesWithFunctions));
            // update token tracker with the input tokens
            lastTokenTracker = updateTokenTracker(inputTokensUsed, 0, model, lastTokenTracker, messages[0]?.content ?? '', context);
            logging && console.log(`\n\nGPT token tracker: ${JSON.stringify(lastTokenTracker, null, 2)}\n\n`);
            throw error;
        }
        const message = response.choices[0].message;
        const promptTokensUsed = response.usage?.prompt_tokens ?? 0;
        const outputTokensUsed = response.usage?.completion_tokens ?? 0;
        lastTokenTracker = updateTokenTracker(promptTokensUsed, outputTokensUsed, model, lastTokenTracker, messages[0]?.content ?? '', context);
        logging && console.log(`\n\nGPT token tracker: ${JSON.stringify(lastTokenTracker, null, 2)}\n\n`);
        const tool_calls = message.tool_calls;
        if (callFunction !== 'none' &&
            callFunction !== 'auto' &&
            callFunction?.function?.name &&
            !tool_calls?.some((tool) => tool.function.name === callFunction?.function?.name)) {
            throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.ExpectedFunctionCallError(callFunction.function.name, context);
        }
        if (tool_calls) {
            if (tool_calls.length !== 1) {
                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.TooManyCallsError(tool_calls.length, context);
            }
            const functionCalled = tool_calls[0].function;
            // check that the response's arguments are valid JSON
            try {
                let returnedArguments = {};
                try {
                    returnedArguments = JSON.parse(functionCalled.arguments);
                }
                catch (error) {
                    throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.InvalidJsonArgumentsError(error.message, context);
                }
                // use the function that was actually called.
                const functionCalledName = functionCalled.name;
                const calledFunctionDefinition = functions?.find((f) => f.name === functionCalledName); // find the function definition
                if (!calledFunctionDefinition) {
                    throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.FunctionNotFoundError(functionCalledName, context);
                }
                const { parameters } = calledFunctionDefinition;
                const requiredParameters = parameters?.required || [];
                const missingParameters = requiredParameters.filter((expectedParameter) => !(expectedParameter in returnedArguments));
                if (missingParameters.length) {
                    throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.MissingRequiredParametersError(missingParameters, context);
                }
                else {
                    // for each requiredParameters, check that the returnedArguments are of the correct type
                    for (const requiredParameter of requiredParameters) {
                        const parameter = parameters?.properties?.[requiredParameter]; // e.g., restaurantCuisines
                        if (parameter?.type === 'array') {
                            // check if the actual parameter is an array
                            if (!Array.isArray(returnedArguments[requiredParameter])) {
                                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.ExpectedArrayTypeError(requiredParameter, typeof returnedArguments[requiredParameter], context);
                            }
                            // if array is empty, throw an error
                            if (!allowEmptyResponse && returnedArguments[requiredParameter].length === 0) {
                                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.EmptyArrayError(requiredParameter, context);
                            }
                            // for each item in the actual array, check that it is of the correct type
                            const itemParameterType = parameter?.items?.type;
                            // const itemParameterEnum = parameter?.items?.enum;
                            for (const item of returnedArguments[requiredParameter]) {
                                if (typeof item !== itemParameterType) {
                                    throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.ExpectedItemTypeError(requiredParameter, itemParameterType, typeof item, context);
                                }
                                // if enum is provided, check that the item is in the enum
                                /*
                                // proved to be too strict for openai to handle
                                if (itemParameterEnum && !itemParameterEnum.includes(item)) {
                                  throw new ChatErrors.UnexpectedEnumValueError(requiredParameter, itemParameterType, itemParameterEnum, item);
                                }
                                */
                            }
                        }
                        else if (parameter?.type === 'string') {
                            if (typeof returnedArguments[requiredParameter] !== 'string') {
                                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.ExpectedStringTypeError(requiredParameter, typeof returnedArguments[requiredParameter], context);
                            }
                            // if string is empty, throw an error
                            if (!allowEmptyResponse && returnedArguments[requiredParameter].length === 0) {
                                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.EmptyStringError(requiredParameter, context);
                            }
                        }
                    }
                }
                return returnedArguments;
            }
            catch (error) {
                if (error instanceof retryOpenAIWithExponentialBackoff_1.ChatErrors.ChatError) {
                    throw error;
                }
                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.ChatError(`Unidentified error when parsing JSON arguments of chat completions' function call.`, context);
            }
        }
        else {
            // if string is empty, throw an error
            if (!message.content?.length) {
                throw new retryOpenAIWithExponentialBackoff_1.ChatErrors.EmptyStringError('message', context);
            }
        }
        return message.content;
    };
    return await (0, retryOpenAIWithExponentialBackoff_1.retryOpenAIWithExponentialBackoff)(task);
};
exports.askOpenAIChat = askOpenAIChat;
