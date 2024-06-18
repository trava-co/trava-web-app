import { getOpenAIClient } from './getOpenAIClient'
import {
  ChatCompletionMessageParam,
  ChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionToolChoiceOption,
  ChatCompletionContentPart,
} from 'openai/resources/chat'
import { retryOpenAIWithExponentialBackoff, ChatErrors } from './retryOpenAIWithExponentialBackoff'
import { CHAT_MODELS, OpenAITokenTracker } from '../constants'
import { countTokensApproximation } from './countTokensApproximation'
export const MAX_TOKENS = 4096
export const DEFAULT_MAX_RESPONSE_TOKENS = 500

const costPerToken = {
  gpt3: {
    input: 0.001 / 1000,
    output: 0.002 / 1000,
  },
  gpt4: {
    input: 0.01 / 1000,
    output: 0.03 / 1000,
  },
}

let lastTokenTracker: OpenAITokenTracker | null = null

function updateTokenTracker(
  inputTokensUsed: number,
  outputTokensUsed: number,
  model: string,
  lastTokenTracker: OpenAITokenTracker | null,
  firstMessageContent: string | ChatCompletionContentPart[],
  context: string,
): OpenAITokenTracker {
  return {
    timestamp: new Date(),
    currentRequest: {
      estimatedCost:
        inputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.input : costPerToken.gpt3.input) +
        outputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.output : costPerToken.gpt3.output),
      inputTokensUsed: inputTokensUsed,
      outputTokensUsed: outputTokensUsed,
      model,
    },
    cumulative: {
      estimatedCost:
        (lastTokenTracker?.cumulative.estimatedCost ?? 0) +
        inputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.input : costPerToken.gpt3.input) +
        outputTokensUsed * (model === 'gpt-4' ? costPerToken.gpt4.output : costPerToken.gpt3.output),
      inputTokensUsed: (lastTokenTracker?.cumulative.inputTokensUsed ?? 0) + inputTokensUsed,
      outputTokensUsed: (lastTokenTracker?.cumulative.outputTokensUsed ?? 0) + outputTokensUsed,
      requestsMade: (lastTokenTracker?.cumulative.requestsMade ?? 0) + 1,
    },
    firstMessageContent,
    context,
  }
}

export interface AskOpenAIChatInput {
  messages: ChatCompletionMessageParam[]
  functions?: ChatCompletionCreateParams.Function[]
  callFunction?: ChatCompletionToolChoiceOption
  temperature?: number
  topP?: number
  maxTokensForAnswer?: number
  context: string
  model: CHAT_MODELS
  logging?: boolean
  allowEmptyResponse?: boolean
}

export const askOpenAIChat = async ({
  messages,
  functions,
  callFunction,
  temperature,
  topP,
  maxTokensForAnswer,
  context,
  model,
  logging = false,
  allowEmptyResponse = false,
}: AskOpenAIChatInput) => {
  const openai = await getOpenAIClient()

  const task = async () => {
    let messagesWithFunctions = messages
    if (functions) {
      // stringify the functions and add them to the messages for token counting purposes
      const functionsString = JSON.stringify(functions)
      const functionsMessage: ChatCompletionMessageParam = {
        content: functionsString,
        role: 'function',
        name: 'placeholder',
      }
      messagesWithFunctions = [...messages, functionsMessage]
    }

    let response: ChatCompletion

    try {
      response = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokensForAnswer || DEFAULT_MAX_RESPONSE_TOKENS,
        temperature: temperature || 0.5,
        top_p: topP || 1,
        ...(functions?.length && {
          tools: functions.map((func) => ({
            function: func,
            type: 'function',
          })),
        }),
        ...(callFunction && { tool_choice: callFunction }), // forces openai to call the function
      })
    } catch (error) {
      const inputTokensUsed = countTokensApproximation(JSON.stringify(messagesWithFunctions))

      // update token tracker with the input tokens
      lastTokenTracker = updateTokenTracker(
        inputTokensUsed,
        0,
        model,
        lastTokenTracker,
        messages[0]?.content ?? '',
        context,
      )
      logging && console.log(`\n\nGPT token tracker: ${JSON.stringify(lastTokenTracker, null, 2)}\n\n`)
      throw error
    }

    const message = response.choices[0].message

    const promptTokensUsed = response.usage?.prompt_tokens ?? 0
    const outputTokensUsed = response.usage?.completion_tokens ?? 0

    lastTokenTracker = updateTokenTracker(
      promptTokensUsed,
      outputTokensUsed,
      model,
      lastTokenTracker,
      messages[0]?.content ?? '',
      context,
    )

    logging && console.log(`\n\nGPT token tracker: ${JSON.stringify(lastTokenTracker, null, 2)}\n\n`)

    const tool_calls = message.tool_calls

    if (
      callFunction !== 'none' &&
      callFunction !== 'auto' &&
      callFunction?.function?.name &&
      !tool_calls?.some((tool) => tool.function.name === callFunction?.function?.name)
    ) {
      throw new ChatErrors.ExpectedFunctionCallError(callFunction.function.name, context)
    }

    if (tool_calls) {
      if (tool_calls.length !== 1) {
        throw new ChatErrors.TooManyCallsError(tool_calls.length, context)
      }

      const functionCalled = tool_calls[0].function

      // check that the response's arguments are valid JSON
      try {
        let returnedArguments: Record<string, any> = {}
        try {
          returnedArguments = JSON.parse(functionCalled.arguments)
        } catch (error) {
          throw new ChatErrors.InvalidJsonArgumentsError((error as Error).message, context)
        }

        // use the function that was actually called.
        const functionCalledName = functionCalled.name
        const calledFunctionDefinition = functions?.find((f) => f.name === functionCalledName) // find the function definition

        if (!calledFunctionDefinition) {
          throw new ChatErrors.FunctionNotFoundError(functionCalledName, context)
        }

        const { parameters } = calledFunctionDefinition
        const requiredParameters: string[] = (parameters?.required as string[]) || []
        const missingParameters = requiredParameters.filter(
          (expectedParameter) => !(expectedParameter in returnedArguments),
        )

        if (missingParameters.length) {
          throw new ChatErrors.MissingRequiredParametersError(missingParameters, context)
        } else {
          // for each requiredParameters, check that the returnedArguments are of the correct type
          for (const requiredParameter of requiredParameters) {
            const parameter = (parameters?.properties as Record<string, any>)?.[requiredParameter] // e.g., restaurantCuisines
            if (parameter?.type === 'array') {
              // check if the actual parameter is an array
              if (!Array.isArray(returnedArguments[requiredParameter])) {
                throw new ChatErrors.ExpectedArrayTypeError(
                  requiredParameter,
                  typeof returnedArguments[requiredParameter],
                  context,
                )
              }
              // if array is empty, throw an error
              if (!allowEmptyResponse && returnedArguments[requiredParameter].length === 0) {
                throw new ChatErrors.EmptyArrayError(requiredParameter, context)
              }
              // for each item in the actual array, check that it is of the correct type
              const itemParameterType = parameter?.items?.type
              // const itemParameterEnum = parameter?.items?.enum;
              for (const item of returnedArguments[requiredParameter]) {
                if (typeof item !== itemParameterType) {
                  throw new ChatErrors.ExpectedItemTypeError(requiredParameter, itemParameterType, typeof item, context)
                }
                // if enum is provided, check that the item is in the enum
                /*
				// proved to be too strict for openai to handle
				if (itemParameterEnum && !itemParameterEnum.includes(item)) {
				  throw new ChatErrors.UnexpectedEnumValueError(requiredParameter, itemParameterType, itemParameterEnum, item);
				}
				*/
              }
            } else if (parameter?.type === 'string') {
              if (typeof returnedArguments[requiredParameter] !== 'string') {
                throw new ChatErrors.ExpectedStringTypeError(
                  requiredParameter,
                  typeof returnedArguments[requiredParameter],
                  context,
                )
              }
              // if string is empty, throw an error
              if (!allowEmptyResponse && returnedArguments[requiredParameter].length === 0) {
                throw new ChatErrors.EmptyStringError(requiredParameter, context)
              }
            }
          }
        }

        return returnedArguments
      } catch (error) {
        if (error instanceof ChatErrors.ChatError) {
          throw error
        }
        throw new ChatErrors.ChatError(
          `Unidentified error when parsing JSON arguments of chat completions' function call.`,
          context,
        )
      }
    } else {
      // if string is empty, throw an error
      if (!message.content?.length) {
        throw new ChatErrors.EmptyStringError('message', context)
      }
    }

    return message.content
  }

  return await retryOpenAIWithExponentialBackoff(task)
}
