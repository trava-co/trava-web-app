import { ATTRACTION_TYPE, ATTRACTION_COST } from 'shared-types/API'
import { CHAT_MODELS, UNKNOWN } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import { questions } from '../prompts/questions'
import { cosineSimilarity } from '../cosineSimilarities'
import { createEmbeddings } from '../createEmbeddings'
import { doCostEmbeddings, eatCostEmbeddings } from '../../embeddings'
import { getCostChatThread, possibleCosts } from '../prompts/cost'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { ChatCompletionCreateParams } from 'openai/resources/chat'
import { TravaCostError } from '../TravaCardCreationErrors'
import { logError } from '../logError'
import { DESCRIPTIVE_CONTEXT, getMostSimilarResponse } from '../prompts/mostSimilarResponse'

const travaCostEmbeddings = { DO: doCostEmbeddings, EAT: eatCostEmbeddings }

const RESPONSE_TOKENS = 100 // 100 is the max tokens for a chat response

interface GetTravaCostInput {
  attractionId: string
  attractionName: string
  destinationName: string
  recSourcePrice?: number | null
  attractionType: ATTRACTION_TYPE
  relevanceMap: Record<string, Record<string, number>>
  onlineLLMDescription?: string
}

export const getTravaCost = async ({
  attractionId,
  attractionName,
  destinationName,
  recSourcePrice,
  attractionType,
  relevanceMap,
  onlineLLMDescription,
}: GetTravaCostInput) => {
  console.log(`getTravaCost for ${attractionName}`)

  const isTypeDo = attractionType === ATTRACTION_TYPE.DO
  const isTypeEat = attractionType === ATTRACTION_TYPE.EAT

  const possibleCostValuesByType = Object.values(possibleCosts[attractionType])

  if (isTypeDo && onlineLLMDescription) {
    // query openai for categories from onlineLLM descriptions
    // necessary because for DO, categories from rec sources aren't always available/more variable
    // if value does not conform, then ask gpt-4 functions api
    const possibleCostValuesByTypeWithUnknown = [...possibleCostValuesByType, UNKNOWN]

    const possiblyValidValue = await getMostSimilarResponse({
      context: DESCRIPTIVE_CONTEXT.COST,
      offSchemaValue: onlineLLMDescription,
      possibleValues: possibleCostValuesByTypeWithUnknown,
    })

    console.log(
      `gpt-4 chat completions for ${attractionName} in ${destinationName} responded with cost: ${possiblyValidValue} as being most similar to onlineLLM description`,
    )

    if (possibleCostValuesByType.includes(possiblyValidValue)) {
      return possiblyValidValue as ATTRACTION_COST
    }
    console.log("gpt-4 didn't return a valid value for cost from onlineLLM description. Falling back to reviews.")
  }

  if (isTypeEat && recSourcePrice) {
    // recSourcePrice exists, which will be the case for > 2/3 of restaurants
    // likely can't trust for type DO. Only 1/35 attractions have recSourcePrice, anyways
    if (recSourcePrice > 4) {
      throw new TravaCostError({
        message: 'recSourcePrice is greater than 4',
        attractionId,
        attractionName,
        destinationName,
      })
    }
    return possibleCostValuesByType[recSourcePrice - 1] as ATTRACTION_COST
  }

  const costQuestion = questions[attractionType].COST

  const reviewSentencesAboutCost = Object.keys(relevanceMap[costQuestion])

  const buildChatThread = (inputWithNewSentence: string) => {
    return getCostChatThread(attractionName, destinationName, attractionType, inputWithNewSentence)
  }

  let functions: ChatCompletionCreateParams.Function[] | null = null

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
    ]
  } else if (isTypeEat) {
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
    ]
  }

  let openAICostInput: RelevantInputText

  try {
    openAICostInput = buildRelevantInputText({
      relevantSentences: reviewSentencesAboutCost,
      buildChatThread,
      functions: functions as ChatCompletionCreateParams.Function[],
      responseTokens: RESPONSE_TOKENS,
      maxDiscretionaryInputTokens: 500,
    })
  } catch (error) {
    console.error('Error building relevant input text for getTravaCost')
    throw error
  }

  const { messages } = openAICostInput

  let response: Record<string, string>

  try {
    // Ask GPT to take its best guess at the cost given its own knowledge and the input
    response = await askOpenAIChat({
      messages,
      functions: functions as ChatCompletionCreateParams.Function[],
      model: CHAT_MODELS.NEW_GPT_3,
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
    })
  } catch (error) {
    console.error('Error asking OpenAI chat for getTravaCost')
    throw error
  }

  // parse the response's function call arguments
  const { cost } = response

  console.log(`chat completions for ${attractionName} in ${destinationName} responded with trava cost: ${cost}`)

  if (possibleCostValuesByType.includes(cost)) {
    return cost as ATTRACTION_COST
  }

  logError({
    error: new Error(`getTravaCost: GPT-3 returned an improper value: ${cost}. Falling back to GPT-4.`),
  })

  // if value does not conform, then ask gpt-4 functions api
  const possiblyValidValue = await getMostSimilarResponse({
    context: DESCRIPTIVE_CONTEXT.COST,
    offSchemaValue: cost,
    possibleValues: possibleCostValuesByType,
  })

  console.log(
    `gpt-4 chat completions for ${attractionName} in ${destinationName} responded with cost: ${possiblyValidValue} as being most similar to ${cost}`,
  )

  if (possibleCostValuesByType.includes(possiblyValidValue)) {
    return possiblyValidValue as ATTRACTION_COST
  }

  logError({
    error: new Error(
      `getTravaCost GPT-4 returned an improper value: ${possiblyValidValue}. Falling back to cosine similarity.`,
    ),
  })

  let nonTravaCostEmbeddings: number[][]

  try {
    nonTravaCostEmbeddings = await createEmbeddings({
      input: [cost],
      attractionId,
      attractionName,
      destinationName,
      context: 'get embeddings for nonTravaCostEmbeddings',
    })
  } catch (error) {
    console.error('Error creating embeddings for getTravaCost')
    throw error
  }

  const nonTravaCostEmbedding = nonTravaCostEmbeddings[0]
  const possibleTravaCostEmbeddings = travaCostEmbeddings[attractionType]
  // find closest cost value in possibleTravaCostEmbeddings to nonTravaCostEmbedding
  // note: possibleTravaCostEmbeddings is of type { [key: string]: number[]}, where key is the cost value and value is the embedding
  // so perform cosineSimilarity on each value in possibleTravaCostEmbeddings, and return the key with the highest cosineSimilarity
  const travaCost = Object.keys(possibleTravaCostEmbeddings).reduce((a, b) =>
    cosineSimilarity(nonTravaCostEmbedding, (possibleTravaCostEmbeddings as { [key: string]: number[] })[a]) >
    cosineSimilarity(nonTravaCostEmbedding, (possibleTravaCostEmbeddings as { [key: string]: number[] })[b])
      ? a
      : b,
  ) as ATTRACTION_COST

  // log the closest cost value
  console.log(`getTravaCost travaCost final classification: ${travaCost}`)
  return travaCost
}
