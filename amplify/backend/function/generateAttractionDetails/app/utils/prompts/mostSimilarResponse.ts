import { ChatCompletionMessageParam, ChatCompletionCreateParams } from 'openai/resources/chat'
import { ATTRACTION_CATEGORY_TYPE, ATTRACTION_RESERVATION, ATTRACTION_TARGET_GROUP } from 'shared-types/API'
import { CHAT_MODELS, UNKNOWN } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'

export enum DESCRIPTIVE_CONTEXT {
  RESERVATION = 'reservation policies',
  COST = 'cost per person',
  DURATION = 'duration in hours',
  CATEGORIES = 'categories',
}

interface MostSimilarResponse {
  context: DESCRIPTIVE_CONTEXT
  offSchemaValue: string
  possibleValues: string[]
}

const getMostSimilarResponseConversation = ({ context, offSchemaValue, possibleValues }: MostSimilarResponse) => {
  const chat: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'Normalize data to a schema. Given a context, an off-schema value, and acceptable values, choose the closest match. Only respond with your selection.',
    },
  ]

  chat.push({
    role: 'user',
    content: `Context: ${context}. Off-schema value: ${offSchemaValue}. Acceptable values: ${possibleValues.join(
      ', ',
    )}`,
  })

  return chat
}

const getMostSimilarResponseFunctions = (validValues: string[]) => {
  const functions: ChatCompletionCreateParams.Function[] = [
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
  ]

  return functions
}

export const getMostSimilarResponse = async ({
  context,
  offSchemaValue,
  possibleValues,
}: MostSimilarResponse): Promise<string> => {
  const chatMessages = getMostSimilarResponseConversation({
    context,
    offSchemaValue,
    possibleValues,
  })

  const functions = getMostSimilarResponseFunctions(possibleValues)

  const mostSimilarResponse = await askOpenAIChat({
    messages: chatMessages,
    functions,
    model: CHAT_MODELS.NEW_GPT_4,
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
  })

  const { validValue } = mostSimilarResponse

  return validValue
}

const determineLogisticsConversation = (description: string) => {
  const chat: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `Provided a description of an attraction, output logistics values that conform to the schema.`,
    },
    {
      role: 'user',
      content: description,
    },
  ]
  return chat
}

interface IDetermineLogisticsFunctionsInput {
  possibleTravaCategories: ATTRACTION_CATEGORY_TYPE[]
  possibleReservationValues: ATTRACTION_RESERVATION[]
  possibleTargetGroups: ATTRACTION_TARGET_GROUP[]
}

const determineLogisticsFunctions = ({
  possibleTravaCategories,
  possibleReservationValues,
  possibleTargetGroups,
}: IDetermineLogisticsFunctionsInput) => {
  // for each argument, add "UNKNOWN" as a possible value
  // if onlineLLM doesn't provide this info, then we'll fallback to user reviews to determine the logistics
  const possibleTravaCategoriesWithUnknown = [...possibleTravaCategories, UNKNOWN]
  const possibleReservationValuesWithUnknown = [...possibleReservationValues, UNKNOWN]
  const possibleTargetGroupsWithUnknown = [...possibleTargetGroups, UNKNOWN]

  const functions: ChatCompletionCreateParams.Function[] = [
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
  ]
  return functions
}

export type Logistics = {
  categories: string[]
  reservations?: string
  targetGroups: string[]
}

interface IDetermineLogisticsInput extends IDetermineLogisticsFunctionsInput {
  description: string
}

export const determineLogistics = async ({
  description,
  possibleTravaCategories,
  possibleReservationValues,
  possibleTargetGroups,
}: IDetermineLogisticsInput): Promise<Logistics> => {
  const chatMessages = determineLogisticsConversation(description)

  const functions = determineLogisticsFunctions({
    possibleTravaCategories,
    possibleReservationValues,
    possibleTargetGroups,
  })

  const logistics = (await askOpenAIChat({
    messages: chatMessages,
    functions,
    model: CHAT_MODELS.NEW_GPT_4,
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
  })) as Logistics

  // for each of the logistics, filter out UNKNOWN
  const { categories, reservations, targetGroups } = logistics
  const validCategories = categories.filter((category) => category !== UNKNOWN)
  const validReservations = reservations !== UNKNOWN ? reservations : undefined
  const validTargetGroups = targetGroups.filter((group) => group !== UNKNOWN)

  const validLogistics = {
    categories: validCategories,
    reservations: validReservations,
    targetGroups: validTargetGroups,
  }

  return validLogistics
}

const getMostSimilarMultiResponseConversation = ({ context, offSchemaValue, possibleValues }: MostSimilarResponse) => {
  const chat: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'Normalize data to a schema. Given a context, an off-schema value, and acceptable values, choose the closest matches. Only respond with your selection.',
    },
  ]

  chat.push({
    role: 'user',
    content: `Context: ${context}. Off-schema value: ${offSchemaValue}. Acceptable values: ${possibleValues.join(
      ', ',
    )}`,
  })

  return chat
}

const getMostSimilarMultiResponseFunctions = (validValues: string[]) => {
  const functions: ChatCompletionCreateParams.Function[] = [
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
  ]

  return functions
}

export const getMostSimilarMultiResponses = async ({
  context,
  offSchemaValue,
  possibleValues,
}: MostSimilarResponse): Promise<string[]> => {
  const chatMessages = getMostSimilarMultiResponseConversation({
    context,
    offSchemaValue,
    possibleValues,
  })

  const functions = getMostSimilarMultiResponseFunctions(possibleValues)

  const mostSimilarResponse = await askOpenAIChat({
    messages: chatMessages,
    functions,
    model: CHAT_MODELS.NEW_GPT_4,
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
  })

  const { selectedValues } = mostSimilarResponse

  return selectedValues
}
