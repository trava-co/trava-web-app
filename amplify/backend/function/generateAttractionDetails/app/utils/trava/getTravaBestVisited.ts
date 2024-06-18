import { ChatCompletionCreateParams } from 'openai/resources/chat'
import { ATTRACTION_TYPE, ATTRACTION_BEST_VISIT_TIME, ATTRACTION_CUISINE_TYPE, HoursInput } from 'shared-types/API'
import { CHAT_MODELS } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import { getTravaBestVisitedChatThread, possibleBestVisitedTimes } from '../prompts/bestVisited'
import { questions } from '../prompts/questions'
import { cosineSimilarity } from '../cosineSimilarities'
import { createEmbeddings } from '../createEmbeddings'
import { doBestVisitedEmbeddings, eatBestVisitedEmbeddings } from '../../embeddings'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { filterBestVisitedByOperatingHours, filterBestVisitedByMealsServed } from './filterBestVisitedByGoogleInfo'

const bestVisitedEmbeddings = {
  DO: doBestVisitedEmbeddings,
  EAT: eatBestVisitedEmbeddings,
}

const RESPONSE_TOKENS = 100 // 100 is the max tokens for a chat response

export interface IMealsServed {
  breakfast?: boolean | null
  brunch?: boolean | null
  lunch?: boolean | null
  dinner?: boolean | null
}

interface GetTravaBestVisitedInput {
  attractionId: string
  attractionName: string
  attractionType: ATTRACTION_TYPE
  relevanceMap: Record<string, Record<string, number>>
  hours?: HoursInput | null
  destinationName: string
  bestVisitedByPopularTimes?: ATTRACTION_BEST_VISIT_TIME[]
  mealsServed?: IMealsServed
  travaCuisines: ATTRACTION_CUISINE_TYPE[]
}

export const getTravaBestVisited = async ({
  attractionId,
  attractionName,
  attractionType,
  relevanceMap,
  hours,
  destinationName,
  bestVisitedByPopularTimes,
  mealsServed,
  travaCuisines,
}: GetTravaBestVisitedInput): Promise<ATTRACTION_BEST_VISIT_TIME[]> => {
  console.log(`getTravaBestVisited for ${attractionName} in ${destinationName}`)

  const possibleBestVisitedTimesByType = Object.values(possibleBestVisitedTimes[attractionType])

  // travaBestVisited is a set of ATTRACTION_BEST_VISIT_TIME
  let travaBestVisited = new Set<ATTRACTION_BEST_VISIT_TIME>()

  // if attractionType is EAT and travaCuisines contains ICE_CREAM_AND_DESSERTS, return SNACK
  if (
    attractionType === ATTRACTION_TYPE.EAT &&
    travaCuisines.includes(ATTRACTION_CUISINE_TYPE.ICE_CREAM_AND_DESSERTS)
  ) {
    return [ATTRACTION_BEST_VISIT_TIME.SNACK]
  }

  if (bestVisitedByPopularTimes?.length ?? 0 > 0) {
    if (attractionType === ATTRACTION_TYPE.DO) {
      // for type DO, we already have the ordered popular times in the proper format
      return bestVisitedByPopularTimes as ATTRACTION_BEST_VISIT_TIME[]
    } else {
      const bestVisitedTimesMealsServedByRestaurant = filterBestVisitedByMealsServed(
        bestVisitedByPopularTimes as ATTRACTION_BEST_VISIT_TIME[],
        mealsServed,
      )
      // add the valid best visited times to the set
      bestVisitedTimesMealsServedByRestaurant.forEach((bestVisitedTime) => {
        travaBestVisited.add(bestVisitedTime)
      })
    }
  }

  // no information about snacks, so fallback to asking openai and then using cosine similarity to ensure arguments conform to our data schema. Also, need to validate the best times to visit are open and that google says they serve the meal.

  const bestVisitedQuestion = questions[attractionType].BEST_VISITED

  const reviewSentencesAboutBestVisited = Object.keys(relevanceMap[bestVisitedQuestion])

  const buildChatThread = (inputWithNewSentence: string) => {
    return getTravaBestVisitedChatThread(
      attractionName,
      destinationName,
      attractionType,
      inputWithNewSentence,
      hours?.weekdayText,
    )
  }

  let functions: ChatCompletionCreateParams.Function[]

  if (attractionType === ATTRACTION_TYPE.DO) {
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
    ]
  } else {
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
    ]
  }

  let openAIBestVisitedInput: RelevantInputText

  try {
    openAIBestVisitedInput = buildRelevantInputText({
      relevantSentences: reviewSentencesAboutBestVisited,
      buildChatThread,
      functions,
      responseTokens: RESPONSE_TOKENS,
      maxDiscretionaryInputTokens: 500,
    })
  } catch (error) {
    console.error('Error building relevant input text for getTravaBestVisited')
    throw error
  }

  const { messages } = openAIBestVisitedInput

  let response: Record<string, string[]>

  try {
    response = (await askOpenAIChat({
      messages,
      functions,
      temperature: 0,
      model: CHAT_MODELS.NEW_GPT_3,
      callFunction: {
        // force openai to call the function
        type: 'function',
        function: {
          name: 'log_best_times_to_visit',
        },
      },
      maxTokensForAnswer: RESPONSE_TOKENS,
      context: `${attractionName} in ${destinationName}: getTravaBestVisited`,
    })) as Record<string, string[]>
  } catch (error) {
    console.error(`Error asking openai for best visited in getTravaBestVisited`)
    throw error
  }

  // parse the response's function call arguments
  const { bestVisited } = response

  console.log(
    `chat completions for ${attractionName} in ${destinationName} responded with trava best visited: ${bestVisited}`,
  )

  let compliantBestVisitedFromChat: Set<ATTRACTION_BEST_VISIT_TIME> = new Set<ATTRACTION_BEST_VISIT_TIME>()
  let incompliantBestVisitedFromChat = new Set<string>()

  bestVisited.forEach((bestVisitedTime) => {
    if (possibleBestVisitedTimesByType.includes(bestVisitedTime)) {
      compliantBestVisitedFromChat.add(bestVisitedTime as ATTRACTION_BEST_VISIT_TIME)
    } else {
      incompliantBestVisitedFromChat.add(bestVisitedTime)
    }
  })

  if (incompliantBestVisitedFromChat.size > 0) {
    // for each incompliantBestVisitedFromChat, find the most similar travaBestVisitedTime
    // create embeddings for all incompliantBestVisitedFromChat

    let nonTravaBestVisitedEmbeddings: number[][]

    try {
      nonTravaBestVisitedEmbeddings = await createEmbeddings({
        input: Array.from(incompliantBestVisitedFromChat),
        attractionId,
        attractionName,
        destinationName,
        context: `get embeddings for nonTravaBestVisitedEmbeddings`,
      })
    } catch (error) {
      console.error(`Error creating embeddings for nonTravaBestVisitedEmbeddings in getTravaBestVisited`)
      throw error
    }

    const possibleBestVisitedTimesForAttractionType = bestVisitedEmbeddings[attractionType]

    // for each nonTravaBestVisitedEmbedding, use cosineSimilarity to find the most similar possible best visited time
    for (let nonTravaBestVisitedEmbedding of nonTravaBestVisitedEmbeddings) {
      let maxSimilarity = -Infinity
      let mostSimilarBestVisitedTime = null

      for (let [possibleBestVisitedTime, possibleBestVisitedEmbedding] of Object.entries(
        possibleBestVisitedTimesForAttractionType,
      )) {
        let similarity = cosineSimilarity(nonTravaBestVisitedEmbedding, possibleBestVisitedEmbedding)

        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          mostSimilarBestVisitedTime = possibleBestVisitedTime
        }
      }

      compliantBestVisitedFromChat.add(mostSimilarBestVisitedTime as ATTRACTION_BEST_VISIT_TIME)
    }
  }

  // Filter out best visited times that are outside of the attraction's operating hours
  const bestVisitedTimesFilteredByOperatingHours = filterBestVisitedByOperatingHours(
    Array.from(compliantBestVisitedFromChat),
    hours?.periods,
  )

  // if type do, return the filtered best visited times
  if (attractionType === ATTRACTION_TYPE.DO) {
    return bestVisitedTimesFilteredByOperatingHours
  } else {
    // type EAT
    // if google meals served is defined, filter out best visited times that are not served by the restaurant
    const bestVisitedTimesMealsServedByRestaurant = Array.from(
      filterBestVisitedByMealsServed(bestVisitedTimesFilteredByOperatingHours, mealsServed),
    )

    if ((bestVisitedByPopularTimes?.length ?? 0) > 0 && travaBestVisited?.size > 0) {
      // determine the index of SNACK in bestVisitedTimesMealsServedByRestaurant, and place into travaBestVisited at that index
      const snackIndex = bestVisitedTimesMealsServedByRestaurant.indexOf(ATTRACTION_BEST_VISIT_TIME.SNACK)

      const travaBestVisitedArray = Array.from(travaBestVisited)

      if (snackIndex > -1) {
        travaBestVisitedArray.splice(snackIndex, 0, ATTRACTION_BEST_VISIT_TIME.SNACK)
      }

      return travaBestVisitedArray
    } else {
      return bestVisitedTimesMealsServedByRestaurant
    }
  }
}
