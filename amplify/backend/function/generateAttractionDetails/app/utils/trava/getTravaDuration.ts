import { ATTRACTION_TYPE, ATTRACTION_DURATION, ATTRACTION_BEST_VISIT_TIME } from 'shared-types/API'
import { CHAT_MODELS } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import { questions } from '../prompts/questions'
import { getTravaDurationChatThread, possibleDurations } from '../prompts/duration'
import { cosineSimilarity } from '../cosineSimilarities'
import { createEmbeddings } from '../createEmbeddings'
import { doDurationEmbeddings, eatDurationEmbeddings } from '../../embeddings'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { ChatCompletionCreateParams } from 'openai/resources/chat'
import { logError } from '../logError'
import { DESCRIPTIVE_CONTEXT, getMostSimilarResponse } from '../prompts/mostSimilarResponse'

const travaDurationEmbeddings = {
  DO: doDurationEmbeddings,
  EAT: eatDurationEmbeddings,
}

const RESPONSE_TOKENS = 100

interface GetTravaDurationInput {
  attractionId: string
  attractionName: string
  destinationName: string
  attractionType: ATTRACTION_TYPE
  relevanceMap: Record<string, Record<string, number>>
  travaBestVisited: ATTRACTION_BEST_VISIT_TIME[]
  recSourceDuration?: string
}

export const getTravaDuration = async ({
  attractionId,
  attractionName,
  destinationName,
  attractionType,
  relevanceMap,
  travaBestVisited,
  recSourceDuration,
}: GetTravaDurationInput) => {
  console.log(`getting trava duration for ${attractionName} in ${destinationName}`)

  if (travaBestVisited[0] === ATTRACTION_BEST_VISIT_TIME.SNACK) {
    // snacks must be less than an hour
    return ATTRACTION_DURATION.LESS_THAN_AN_HOUR
  }

  const possibleDurationValuesByType = Object.values(possibleDurations[attractionType])

  let duration = recSourceDuration
  // if duration is not provided, get it from gpt 3.5
  if (!duration) {
    const durationQuestion = questions[attractionType].DURATION

    const reviewSentencesAboutDuration = Object.keys(relevanceMap[durationQuestion])

    const buildChatThread = (inputWithNewSentence: string) => {
      return getTravaDurationChatThread(attractionName, destinationName, attractionType, inputWithNewSentence)
    }

    let functions: ChatCompletionCreateParams.Function[]

    if (attractionType === ATTRACTION_TYPE.DO) {
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
      ]
    } else {
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
      ]
    }

    let openAIDurationInput: RelevantInputText

    try {
      openAIDurationInput = buildRelevantInputText({
        relevantSentences: reviewSentencesAboutDuration,
        buildChatThread,
        functions,
        responseTokens: RESPONSE_TOKENS,
        maxDiscretionaryInputTokens: 500,
      })
    } catch (error) {
      console.error('Error building relevant input text for getTravaDuration')
      throw error
    }

    const { messages } = openAIDurationInput

    let response: Record<string, string>

    try {
      response = await askOpenAIChat({
        messages,
        functions,
        temperature: 0,
        model: CHAT_MODELS.NEW_GPT_3,
        callFunction: {
          // force openai to call the function
          type: 'function',
          function: {
            name: 'log_duration',
          },
        },
        maxTokensForAnswer: RESPONSE_TOKENS,
        context: `${attractionName} in ${destinationName}: getTravaDuration`,
      })
    } catch (error) {
      console.error('Error asking OpenAI chat for getTravaDuration')
      throw error
    }

    // parse the openAIDurationClassification for the duration value
    duration = response.duration

    console.log(`chat completions for ${attractionName} in ${destinationName} responded with duration: ${duration}`)

    if (possibleDurationValuesByType.includes(duration)) {
      return duration as ATTRACTION_DURATION
    }

    logError({
      error: new Error(`getTravaDuration: GPT-3 returned an improper value: ${duration}. Falling back to GPT-4.`),
    })
  }

  // if value does not conform, then ask gpt-4 functions api
  const possiblyValidValue = await getMostSimilarResponse({
    context: DESCRIPTIVE_CONTEXT.DURATION,
    offSchemaValue: duration,
    possibleValues: possibleDurationValuesByType,
  })

  console.log(
    `gpt-4 chat completions for ${attractionName} in ${destinationName} responded with duration: ${possiblyValidValue} as being most similar to ${duration}`,
  )

  if (possibleDurationValuesByType.includes(possiblyValidValue)) {
    return possiblyValidValue as ATTRACTION_DURATION
  }

  logError({
    error: new Error(
      `getTravaDuration GPT-4 returned an improper value: ${possiblyValidValue}. Falling back to cosine similarity.`,
    ),
  })

  let nonTravaDurationEmbeddings: number[][]

  try {
    // create embedding for openAIDurationClassification
    nonTravaDurationEmbeddings = await createEmbeddings({
      input: [duration],
      attractionId,
      attractionName,
      destinationName,
      context: 'get embeddings for nonTravaDurationEmbeddings',
    })
  } catch (error) {
    console.error('Error creating embeddings for getTravaDuration')
    throw error
  }

  const nonTravaDurationEmbedding = nonTravaDurationEmbeddings[0]
  const possibleTravaDurationEmbeddings = travaDurationEmbeddings[attractionType]
  // find closest duration value in possibleTravaDurationEmbeddings to nonTravaDurationEmbedding
  // note: possibleTravaDurationEmbeddings is of type { [key: string]: number[]}, where key is the duration value and value is the embedding
  // so perform cosineSimilarity on each value in possibleTravaDurationEmbeddings, and return the key with the highest cosineSimilarity
  const travaDuration = Object.keys(possibleTravaDurationEmbeddings).reduce((a, b) =>
    cosineSimilarity(nonTravaDurationEmbedding, (possibleTravaDurationEmbeddings as { [key: string]: number[] })[a]) >
    cosineSimilarity(nonTravaDurationEmbedding, (possibleTravaDurationEmbeddings as { [key: string]: number[] })[b])
      ? a
      : b,
  ) as ATTRACTION_DURATION

  // log the closest duration value
  console.log(`getTravaDuration travaDuration: ${travaDuration}`)
  return travaDuration
}
