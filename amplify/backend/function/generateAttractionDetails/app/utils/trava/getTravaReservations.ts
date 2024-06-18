import { ATTRACTION_RESERVATION, ATTRACTION_TYPE } from 'shared-types/API'
import { CHAT_MODELS } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import {
  getTravaReservationsInfoChatThread,
  reservationsMap,
  DESCRIPTIVE_RESERVATION_NAMES,
} from '../prompts/reservations'
import { questions } from '../prompts/questions'
import { reservationEmbeddings } from '../../embeddings'
import { cosineSimilarity } from '../cosineSimilarities'
import { createEmbeddings } from '../createEmbeddings'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { ChatCompletionCreateParams } from 'openai/resources/chat'
import { InfoItemInput } from 'shared-types/API'
import { DESCRIPTIVE_CONTEXT, getMostSimilarResponse } from '../prompts/mostSimilarResponse'
import { logError } from '../logError'

const RESPONSE_TOKENS = 100 // 100 is the max tokens for a chat response

interface GetTravaReservationsInput {
  attractionId: string
  attractionName: string
  destinationName: string
  relevanceMap: Record<string, Record<string, number>>
  attractionType: ATTRACTION_TYPE
  reservable: boolean
  planning?: InfoItemInput[]
}

export const getTravaReservations = async ({
  attractionId,
  attractionName,
  destinationName,
  relevanceMap,
  attractionType,
  reservable, // google maps attribute. if falsy, then we know it's not reservable. else, it's reservable.
  planning,
}: GetTravaReservationsInput): Promise<ATTRACTION_RESERVATION> => {
  console.log(`getting trava reservations for ${attractionName} in ${destinationName}`)

  const isTypeDo = attractionType === ATTRACTION_TYPE.DO
  const isTypeEat = attractionType === ATTRACTION_TYPE.EAT

  if (isTypeEat && !reservable) {
    // if reservable is false or undefined, then we know that reservations are not taken
    return ATTRACTION_RESERVATION.NOT_TAKEN
  }

  // create deep copy of reservations so that deletions don't affect the original
  const possibleReservationValues = JSON.parse(JSON.stringify(reservationsMap)) as Record<
    string,
    ATTRACTION_RESERVATION
  >

  // examine planning array, searching for an element with case insensitive substring "reservations required". if found, return REQUIRED
  const planningItemWithReservationsRequired = planning?.find((item) =>
    item.name.toLowerCase().includes('reservations required'),
  )

  if (planningItemWithReservationsRequired) {
    return ATTRACTION_RESERVATION.REQUIRED
  }

  // examine planning array, searching for an element with case insensitive substring "reservations recommended". if found, return RECOMMENDED
  const planningItemWithReservationsRecommended = planning?.find((item) =>
    item.name.toLowerCase().includes('reservations recommended'),
  )

  if (planningItemWithReservationsRecommended) {
    return ATTRACTION_RESERVATION.RECOMMENDED
  }

  // else, fallback to using openai
  if (isTypeEat) {
    // reservable is true, so we know that reservations are taken
    delete possibleReservationValues[DESCRIPTIVE_RESERVATION_NAMES.RESERVATIONS_NOT_TAKEN]
  }

  const reservationQuestion = questions[attractionType].RESERVATIONS

  const reviewSentencesAboutReservations = Object.keys(relevanceMap[reservationQuestion])

  const buildChatThread = (inputWithNewSentence: string) => {
    return getTravaReservationsInfoChatThread({
      attractionName,
      destinationName,
      attractionType,
      relevantDescription: inputWithNewSentence,
      reservable,
      possibleOptions: Object.keys(possibleReservationValues),
    })
  }

  let functions: ChatCompletionCreateParams.Function[]

  if (attractionType === ATTRACTION_TYPE.DO) {
    functions = [
      {
        name: 'log_reservation_info',
        description: 'Provided the appropriate reservation info for a given attraction, logs it to the console',
        parameters: {
          type: 'object',
          properties: {
            reservation: {
              type: 'string',
              description:
                'Whether this attraction requires, recommends, optionally takes, or does not take reservations',
              enum: Object.keys(possibleReservationValues),
            },
          },
          required: ['reservation'],
        },
      },
    ]
  } else {
    functions = [
      {
        name: 'log_reservation_info',
        description: 'Provided the appropriate reservation info for a restaurant, logs it to the console',
        parameters: {
          type: 'object',
          properties: {
            reservation: {
              type: 'string',
              description:
                'Whether this restaurant requires, recommends, optionally takes, or does not take reservations',
              enum: Object.keys(possibleReservationValues),
            },
          },
          required: ['reservation'],
        },
      },
    ]
  }

  let openAIReservationsInput: RelevantInputText

  try {
    openAIReservationsInput = buildRelevantInputText({
      relevantSentences: reviewSentencesAboutReservations,
      buildChatThread,
      functions,
      responseTokens: RESPONSE_TOKENS,
      maxDiscretionaryInputTokens: 500,
    })
  } catch (error) {
    console.error('Error building relevant input text for getTravaReservations')
    throw error
  }

  const { messages } = openAIReservationsInput

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
          name: 'log_reservation_info',
        },
      },
      maxTokensForAnswer: RESPONSE_TOKENS,
      context: `${attractionName} in ${destinationName}: getTravaReservations`,
    })
  } catch (error) {
    console.error('Error asking openAI chat for getTravaReservations')
    throw error
  }

  // parse the response's function call arguments
  const { reservation } = response

  console.log(
    `chat completions for ${attractionName} in ${destinationName} responded with reservation status: ${reservation}`,
  )

  if (possibleReservationValues[reservation]) {
    return possibleReservationValues[reservation]
  }

  logError({
    error: new Error(
      `getTravaReservations GPT-3 returned an improper value: ${reservation}. Falling back to GPT-4. Attraction name: ${attractionName}. Destination name: ${destinationName}.`,
    ),
  })

  // if value does not conform, then ask gpt-4 functions api
  const possiblyValidValue = await getMostSimilarResponse({
    context: DESCRIPTIVE_CONTEXT.RESERVATION,
    offSchemaValue: reservation,
    possibleValues: Object.keys(possibleReservationValues),
  })

  console.log(
    `gpt-4 chat completions for ${attractionName} in ${destinationName} responded with reservation status: ${possiblyValidValue} as being most similar to ${reservation}`,
  )

  if (possibleReservationValues[possiblyValidValue]) {
    return possibleReservationValues[possiblyValidValue]
  }

  logError({
    error: new Error(
      `getTravaReservations GPT-4 returned an improper value: ${possiblyValidValue}. Falling back to cosine similarity.`,
    ),
  })

  // Cosine Similarity is the final fallback. It isn't great at understanding context, so it will make mistakes like thinking NOT_TAKEN's closest value is REQUIRED. But it will definitely conform to the schema.

  let nonTravaReservationEmbeddings: number[][]

  try {
    nonTravaReservationEmbeddings = await createEmbeddings({
      input: [reservation],
      attractionId,
      attractionName,
      destinationName,
      context: 'get embeddings for nonTravaReservationEmbeddings',
    })
  } catch (error) {
    console.error('Error creating embeddings for getTravaReservations')
    throw error
  }

  const nonTravaReservationEmbedding = nonTravaReservationEmbeddings[0]

  // find closest reservation value in possibleTravaReservationEmbeddings to nonTravaReservationEmbedding
  // note: possibleTravaReservationEmbeddings is of type { [key: string]: number[]}, where key is the reservation value and value is the embedding
  // so perform cosineSimilarity on each value in possibleTravaReservationEmbeddings, and return the key with the highest cosineSimilarity
  const similarities: Record<string, number> = {}
  for (let key of Object.keys(possibleReservationValues)) {
    const similarity = cosineSimilarity(
      nonTravaReservationEmbedding,
      reservationEmbeddings[key as keyof typeof reservationEmbeddings],
    )
    similarities[key] = similarity

    console.log(`Cosine similarity for ${key}: ${similarity}`)
  }

  const travaReservationDescriptiveName = Object.keys(similarities).reduce((a, b) =>
    similarities[a] > similarities[b] ? a : b,
  ) as ATTRACTION_RESERVATION

  const travaReservation = reservationsMap[travaReservationDescriptiveName]

  console.log(`closest reservation value to ${reservation} is ${travaReservation}`)

  return travaReservation
}
