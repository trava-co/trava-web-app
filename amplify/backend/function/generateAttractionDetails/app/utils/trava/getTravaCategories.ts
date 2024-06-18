import { ATTRACTION_TYPE, ATTRACTION_CUISINE_TYPE } from 'shared-types/API'
import { AttractionCategoryOrCuisineType, CHAT_MODELS } from '../constants'
import { createEmbeddings } from '../createEmbeddings'
import { cosineSimilarity } from '../cosineSimilarities'
import { attractionCategoryEmbeddings, attractionCuisineEmbeddings } from '../../embeddings'
import { questions } from '../prompts/questions'
import { getCategoriesChatThread, possibleCategories } from '../prompts/categories'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import { ChatCompletionCreateParams } from 'openai/resources'
import { TravaCategoriesError } from '../TravaCardCreationErrors'

const categoryOrCuisineEmbeddings = {
  DO: attractionCategoryEmbeddings,
  EAT: attractionCuisineEmbeddings,
}

const RESPONSE_TOKENS = 100 // 100 is the max tokens for a chat response

interface GetTravaCategoriesInput {
  attractionId: string
  attractionName: string
  destinationName: string
  recommendationSourceCategories?: string[]
  attractionType: ATTRACTION_TYPE
  relevanceMap: Record<string, Record<string, number>>
}

export async function getTravaCategories({
  attractionId,
  attractionName,
  destinationName,
  recommendationSourceCategories,
  attractionType,
  relevanceMap,
}: GetTravaCategoriesInput): Promise<AttractionCategoryOrCuisineType[]> {
  console.log(
    `getTravaCategories for ${attractionName} \nrecommendationSourceCategories: ${recommendationSourceCategories}`,
  )

  const isTypeDo = attractionType === ATTRACTION_TYPE.DO
  const isTypeEat = attractionType === ATTRACTION_TYPE.EAT

  // create deep copy of possibleCategories so that deletions don't affect the original
  const possibleTravaCategories = JSON.parse(JSON.stringify(possibleCategories[attractionType])) as Record<
    string,
    AttractionCategoryOrCuisineType
  >

  const travaCategories: string[] = []
  const nonTravaCategories: string[] = []

  recommendationSourceCategories?.forEach((recSourceCategory) => {
    if (isTypeEat) {
      nonTravaCategories.push(`Restaurant Cuisine: ${recSourceCategory.toUpperCase()}`)
    } else if (isTypeDo) {
      nonTravaCategories.push(`Attraction Category: ${recSourceCategory.toUpperCase()}`)
    }
  })

  if (!nonTravaCategories.length) {
    // if recommendationSourceCategories is not provided, then we need to query openai for the categories
    const categoriesQuestion = isTypeDo ? questions.DO.CATEGORIES : questions.EAT.CUISINES

    const reviewSentencesAboutCategories = Object.keys(relevanceMap[categoriesQuestion])

    const buildChatThread = (inputWithNewSentence: string) => {
      return getCategoriesChatThread(attractionName, destinationName, attractionType, inputWithNewSentence)
    }

    let functions: ChatCompletionCreateParams.Function[] | null = null

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
      ]
    } else if (isTypeEat) {
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
      ]
    }

    let openAICategoriesInput: RelevantInputText

    try {
      openAICategoriesInput = buildRelevantInputText({
        relevantSentences: reviewSentencesAboutCategories,
        buildChatThread,
        functions: functions as ChatCompletionCreateParams.Function[],
        responseTokens: RESPONSE_TOKENS,
        maxDiscretionaryInputTokens: 750,
      })
    } catch (error) {
      console.error('Error building relevant input text for getTravaCategories')
      throw error
    }

    const { messages } = openAICategoriesInput

    let response: Record<string, string[]>

    try {
      response = await askOpenAIChat({
        messages,
        functions: functions as ChatCompletionCreateParams.Function[],
        temperature: 0,
        model: CHAT_MODELS.NEW_GPT_3,
        callFunction: {
          // force openai to call the function
          type: 'function',
          function: {
            name: isTypeDo ? 'log_attraction_categories' : 'log_restaurant_cuisines',
          },
        },
        maxTokensForAnswer: RESPONSE_TOKENS,
        context: `${attractionName} in ${destinationName}: getTravaCategories`,
      })
    } catch (error) {
      console.error('Error asking openai for categories in getTravaCategories')
      throw error
    }

    // parse the response's function call arguments
    const categories = isTypeDo ? response.attractionCategories : response.restaurantCuisines

    console.log(
      `chat completions for ${attractionName} in ${destinationName} responded with trava categories: ${categories}`,
    )

    categories.forEach((categoryOrCuisine: string) => {
      if (Object.values(possibleTravaCategories).includes(categoryOrCuisine as AttractionCategoryOrCuisineType)) {
        travaCategories.push(categoryOrCuisine)
        // remove the category from possibleTravaCategories, so that later similarity score computed for categories not already included. If most similar category is above threshold, will be added.
        delete possibleTravaCategories[categoryOrCuisine]
      } else {
        // if chat response contains a category that isn't in the trava categories, add it to the nonTravaCategories
        nonTravaCategories.push(`${isTypeDo ? 'Attraction Category' : 'Restaurant Cuisine'}: ${categoryOrCuisine}`)
      }
    })

    // if there are travaCategories and no nonTravaCategories, then we can just return the travaCategories
    if (travaCategories.length && !nonTravaCategories.length) {
      return travaCategories as ATTRACTION_CUISINE_TYPE[]
    }

    // if there are no nonTravaCategories or possibleTravaCategories, no use in continuing
    if (nonTravaCategories.length === 0 || Object.keys(possibleTravaCategories).length === 0) {
      if (!travaCategories.length) {
        throw new TravaCategoriesError({
          message: 'no trava categories or cuisines found, and none returned by openai',
          attractionId,
          attractionName,
          destinationName,
        })
      }
      return travaCategories as ATTRACTION_CUISINE_TYPE[]
    }
  }

  let nonTravaCategoryEmbeddings: number[][]
  try {
    // process the nonTravaCategories, finding the best trava category for each
    nonTravaCategoryEmbeddings = await createEmbeddings({
      input: nonTravaCategories,
      attractionId,
      attractionName,
      destinationName,
      context: 'get embeddings for nonTravaCategories',
    })
  } catch (error) {
    console.error('Error creating embeddings for nonTravaCategories in getTravaCategories')
    throw error
  }

  const travaCategoryOrCuisineWithEmbeddings = categoryOrCuisineEmbeddings[attractionType]

  const travaCategoriesWithScores = nonTravaCategoryEmbeddings.map(
    (nonTravaCategoryEmbedding, nonTravaCategoryIndex) => {
      const bestMatch = Object.keys(possibleTravaCategories).reduce(
        (best: { categoryOrCuisine: string; similarity: number }, travaCategoryOrCuisineName: string) => {
          const similarity = cosineSimilarity(
            nonTravaCategoryEmbedding,
            (travaCategoryOrCuisineWithEmbeddings as { [key: string]: number[] })[travaCategoryOrCuisineName],
          )
          // determines the best Trava category for the given nonTrava category
          return similarity > best.similarity ? { categoryOrCuisine: travaCategoryOrCuisineName, similarity } : best
        },
        { categoryOrCuisine: '', similarity: -Infinity },
      )

      console.log(
        `Best match for ${nonTravaCategories[nonTravaCategoryIndex]} is ${bestMatch.categoryOrCuisine} with a similarity of ${bestMatch.similarity}`,
      )

      return bestMatch
    },
  )

  // the categories are ordered by relevance. if score is above .93, we've found a great trava category match, so we maintain the order. otherwise, we sort by similarity.
  travaCategoriesWithScores.sort((a, b) => {
    if (a.similarity > 0.93 && b.similarity > 0.93) {
      return 0
    } else {
      return b.similarity - a.similarity
    }
  })

  travaCategoriesWithScores.forEach((category) => {
    let similarityThreshold = 0
    // low bar for first category, then high bar for the rest
    if (travaCategories.length === 0) {
      if (isTypeEat) {
        similarityThreshold = 0.8
      } // else it will be 0 for ATTRACTION_TYPE.DO, since DO does not have OTHER
    } else {
      similarityThreshold = 0.95
    }

    if (category.similarity >= similarityThreshold) {
      travaCategories.push(category.categoryOrCuisine)
    }
  })

  // if there are no travaCategories, and attractionType is EAT, then add ATTRACTION_CUISINE_TYPE.OTHER
  if (!travaCategories.length && isTypeEat) {
    travaCategories.push(ATTRACTION_CUISINE_TYPE.OTHER)
  }

  // Dedupe categories
  const uniqueTravaCategories = [...new Set(travaCategories)]

  return uniqueTravaCategories as AttractionCategoryOrCuisineType[]
}
