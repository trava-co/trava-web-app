import { ATTRACTION_TARGET_GROUP, ATTRACTION_TYPE, AboutBusinessInput, InfoItemInput } from 'shared-types/API'
import { CHAT_MODELS } from '../constants'
import { askOpenAIChat } from '../openai/askOpenAIChat'
import { ChatCompletionCreateParams } from 'openai/resources/chat'
import { DESCRIPTIVE_TARGET_GROUP_NAMES, getTravaTargetGroupChatThread } from '../prompts/targetGroup'
import { questions } from '../prompts/questions'
import { cosineSimilarity } from '../cosineSimilarities'
import { createEmbeddings } from '../createEmbeddings'
import { doTargetGroupEmbeddings, eatTargetGroupEmbeddings } from '../../embeddings'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { targetGroupMap } from '../prompts/targetGroup'
import { TravaTargetGroupError } from '../TravaCardCreationErrors'

const targetGroupEmbeddings = {
  DO: doTargetGroupEmbeddings,
  EAT: eatTargetGroupEmbeddings,
}

const RESPONSE_TOKENS = 100 // 100 is the max tokens for a chat response

interface GetTravaTargetGroupsInput {
  attractionId: string
  attractionName: string
  attractionType: ATTRACTION_TYPE
  relevanceMap: Record<string, Record<string, number>>
  destinationName: string
  yelpAmenities?: InfoItemInput[]
  aboutBusiness?: AboutBusinessInput | null
  servesVegetarianFood?: boolean | null
}

export const getTravaTargetGroups = async ({
  attractionId,
  attractionName,
  attractionType,
  relevanceMap,
  destinationName,
  yelpAmenities,
  aboutBusiness,
  servesVegetarianFood,
}: GetTravaTargetGroupsInput) => {
  console.log(`getting trava target groups for ${attractionName} in ${destinationName}`)

  let travaTargetGroups: ATTRACTION_TARGET_GROUP[] = []
  let nonTravaTargetGroups: string[] = []

  // create deep copy of targetGroupMap so that deletions don't affect the original
  const possibleTargetGroups = JSON.parse(JSON.stringify(targetGroupMap[attractionType])) as Record<
    string,
    ATTRACTION_TARGET_GROUP
  >

  if (attractionType === ATTRACTION_TYPE.EAT) {
    // pets and outdoor seating must be determined by yelp or google. we won't fallback to openai api for these.
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.PETS]
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.OUTDOOR_SEATING]

    // VEGETARIAN: covers 2975/6883 restaurants
    const yelpVegetarianAmenity =
      yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'many vegetarian options') ||
      yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'limited vegetarian options')

    if (yelpVegetarianAmenity) {
      // remove vegetarian from possible target groups
      delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.VEGETARIAN]

      // if amenity.name is "Many Vegetarian Options", then it's great for vegetarians
      if (yelpVegetarianAmenity.name.toLowerCase() === 'many vegetarian options' && !yelpVegetarianAmenity.negative) {
        travaTargetGroups.push(ATTRACTION_TARGET_GROUP.VEGETARIAN)
      }
    } else {
      // if we don't have yelp vegetarian info, then use servesVegetarianFood to remove vegetarian from possible target groups
      if (servesVegetarianFood === false) {
        delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.VEGETARIAN]
      }
    }

    // OUTDOOR SEATING covers 5427/6883 restaurants
    const outdoorSeatingAmenity =
      yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'outdoor seating') ||
      yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'no outdoor seating') ||
      aboutBusiness?.serviceOptions?.find((serviceOption) => serviceOption?.name.toLowerCase() === 'outdoor seating')

    if (outdoorSeatingAmenity) {
      // if amenity.name is "Outdoor Seating", then it's great for outdoor seating
      if (outdoorSeatingAmenity.name?.toLowerCase() === 'outdoor seating' && !outdoorSeatingAmenity.negative) {
        travaTargetGroups.push(ATTRACTION_TARGET_GROUP.OUTDOOR)
      }
    }
  }

  // KIDS: covers 5031/6883 restaurants
  const kidsAmenity =
    yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'good for kids') ||
    yelpAmenities?.find(
      (amenity) =>
        amenity.name.toLowerCase() === 'not good for kids' ||
        aboutBusiness?.amenities?.find((amenity) => amenity?.name.toLowerCase() === 'good for kids'),
    )

  if (kidsAmenity) {
    // remove kids from possible target groups
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS]
    // if amenity.name is "Good for Kids", then it's great for kids
    if (kidsAmenity.name?.toLowerCase() === 'good for kids' && !kidsAmenity.negative) {
      travaTargetGroups.push(ATTRACTION_TARGET_GROUP.KID)
    }
  }

  // PETS: 800 have "dogs allowed", 2361 "dogs not allowed", 3500 no info
  const petsAmenity = yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'dogs allowed')

  if (petsAmenity) {
    // if amenity.name is "Dogs Allowed", then it's great for pets
    if (!petsAmenity.negative) {
      travaTargetGroups.push(ATTRACTION_TARGET_GROUP.PET)
    }
  }

  // COUPLE: 2286 have romantic
  const coupleAmenity =
    yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'romantic') ||
    aboutBusiness?.atmosphere?.find((atmosphere) => atmosphere?.name.toLowerCase() === 'romantic')

  if (coupleAmenity) {
    // remove couple from possible target groups
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES]
    // if amenity.name is "Romantic", then it's great for couples
    if (!coupleAmenity.negative) {
      travaTargetGroups.push(ATTRACTION_TARGET_GROUP.COUPLE)
    }
  }

  // LARGE GROUPS & BACHELOR. 4002 good for groups, 799 not good for groups
  const notGreatForGroups =
    yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'not good for groups') ||
    yelpAmenities?.find((amenity) => amenity.name.toLowerCase() === 'good for groups' && amenity.negative)

  if (notGreatForGroups) {
    // remove LARGE_GROUP and BACHELOR from possible target groups
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS]
    delete possibleTargetGroups[DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES]
  }

  const targetGroupQuestion = questions[attractionType].TARGET_GROUP

  const reviewSentencesAboutTargetGroup = Object.keys(relevanceMap[targetGroupQuestion])

  const buildChatThread = (inputWithNewSentence: string) => {
    return getTravaTargetGroupChatThread(
      attractionName,
      destinationName,
      attractionType,
      Object.keys(possibleTargetGroups),
      inputWithNewSentence,
    )
  }

  let functions: ChatCompletionCreateParams.Function[]

  if (attractionType === ATTRACTION_TYPE.DO) {
    functions = [
      {
        name: 'log_suitable_groups',
        description: 'Logs to the console the groups the attraction is suitable for',
        parameters: {
          type: 'object',
          properties: {
            suitableGroups: {
              type: 'array',
              description: 'The groups the attraction is suitable for',
              items: {
                type: 'string',
                enum: Object.keys(possibleTargetGroups),
              },
            },
          },
          required: ['suitableGroups'],
        },
      },
    ]
  } else {
    functions = [
      {
        name: 'log_suitable_groups',
        description: 'Logs to the console the groups the restaurant is suitable for',
        parameters: {
          type: 'object',
          properties: {
            suitableGroups: {
              type: 'array',
              description: 'The groups the restaurant is suitable for',
              items: {
                type: 'string',
                enum: Object.keys(possibleTargetGroups),
              },
            },
          },
          required: ['suitableGroups'],
        },
      },
    ]
  }

  let openAITargetGroupsInput: RelevantInputText

  try {
    openAITargetGroupsInput = buildRelevantInputText({
      relevantSentences: reviewSentencesAboutTargetGroup,
      buildChatThread,
      functions,
      responseTokens: RESPONSE_TOKENS,
      maxDiscretionaryInputTokens: 750,
    })
  } catch (error) {
    console.error('Error building relevant input text for getTravaTargetGroups')
    throw error
  }

  const { messages } = openAITargetGroupsInput

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
          name: 'log_suitable_groups',
        },
      },
      maxTokensForAnswer: RESPONSE_TOKENS,
      context: `${attractionName} in ${destinationName}: getTargetGroup`,
    })) as Record<string, string[]>
  } catch (error) {
    console.error('Error asking OpenAI chat for getTravaTargetGroups')
    throw error
  }

  // parse the response's function call arguments
  const { suitableGroups } = response

  console.log(
    `chat completions for ${attractionName} in ${destinationName} responded with trava target groups: ${suitableGroups}`,
  )

  suitableGroups.forEach((targetGroup) => {
    // handles the mapping of INDOOR_DINING to RAINY, etc.
    if (possibleTargetGroups[targetGroup]) {
      // add the target group to the attraction's target groups
      travaTargetGroups.push(possibleTargetGroups[targetGroup])
      // remove the target group from possibleTargetGroups
      delete possibleTargetGroups[targetGroup]
    } else if (!(DESCRIPTIVE_TARGET_GROUP_NAMES as Record<string, string>)[targetGroup]) {
      nonTravaTargetGroups.push(targetGroup)
    }
  })

  // if there are no nonTravaTargetGroups or possibleTargetGroups, no use in continuing
  if (nonTravaTargetGroups.length === 0 || Object.keys(possibleTargetGroups).length === 0) {
    if (!travaTargetGroups.length) {
      throw new TravaTargetGroupError({
        message: 'no trava target groups found, and none returned by openai',
        attractionId,
        attractionName,
        destinationName,
      })
    }
    return travaTargetGroups
  }

  // process the nonTravaTargetGroups
  // for each nonTravaTargetGroup, find the most similar travaTargetGroup
  // create embeddings for all nonTravaTargetGroups
  let nonTravaTargetGroupEmbeddings: number[][]

  try {
    nonTravaTargetGroupEmbeddings = await createEmbeddings({
      input: nonTravaTargetGroups,
      attractionId,
      attractionName,
      destinationName,
      context: 'get embeddings for nonTravaTargetGroupEmbeddings',
    })
  } catch (error) {
    console.error('Error creating embeddings for getTravaTargetGroups')
    throw error
  }

  const travaTargetGroupsWithEmbeddings = targetGroupEmbeddings[attractionType]

  const travaTargetGroupsWithScores = nonTravaTargetGroupEmbeddings.map(
    (nonTravaTargetGroupEmbedding, nonTravaTargetGroupIndex) => {
      const bestMatch = Object.keys(possibleTargetGroups).reduce(
        (best: { targetGroup: string; score: number }, travaTargetGroup: string) => {
          const similarity = cosineSimilarity(
            nonTravaTargetGroupEmbedding,
            travaTargetGroupsWithEmbeddings[travaTargetGroup as keyof typeof travaTargetGroupsWithEmbeddings],
          )
          // determines the best Trava target group for the given nonTravaTargetGroup
          return similarity > best.score ? { targetGroup: travaTargetGroup, score: similarity } : best
        },
        { targetGroup: '', score: -Infinity },
      )
      console.log(
        `Best match for ${nonTravaTargetGroups[nonTravaTargetGroupIndex]} is ${bestMatch.targetGroup} with a score of ${bestMatch.score}`,
      )
      return bestMatch
    },
  )

  // Sort the travaTargetGroupsWithScores by score
  // target groups aren't outputted in order of relevance, but rather select all, so we can just sort by score here
  travaTargetGroupsWithScores.sort((a, b) => b.score - a.score)

  travaTargetGroupsWithScores.forEach((travaTargetGroupWithScore) => {
    const similarityThreshold = travaTargetGroups.length === 0 ? 0 : 0.9

    if (travaTargetGroupWithScore.score > similarityThreshold) {
      travaTargetGroups.push(possibleTargetGroups[travaTargetGroupWithScore.targetGroup])
    }
  })

  // Dedupe the array
  const uniqueTravaTargetGroups = [...new Set(travaTargetGroups)]

  console.log(`Final travaTargetGroups: ${JSON.stringify(uniqueTravaTargetGroups, null, 2)}`)

  return uniqueTravaTargetGroups
}
