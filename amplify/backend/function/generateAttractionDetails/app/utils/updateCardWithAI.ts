import {
  ATTRACTION_COST_TYPE,
  ATTRACTION_PRIVACY,
  ATTRACTION_TYPE,
  CURRENCY_TYPE,
  ATTRACTION_CUISINE_TYPE,
  ATTRACTION_CATEGORY_TYPE,
  BADGES,
  HoursInput,
  MealServicesInput,
  ATTRACTION_BEST_VISIT_TIME,
  InfoItemInput,
  AboutBusinessInput,
  AUTHOR_TYPE,
  CreateAttractionInput,
  AttractionLabel,
} from 'shared-types/API'
import { getTravaCategories } from './trava/getTravaCategories'
import { getTravaCost } from './trava/getTravaCost'
import { IMealsServed, getTravaBestVisited } from './trava/getTravaBestVisited'
import { getSentenceRelevanceMap } from './getMostRelevantSentences'
import { getTravaReservations } from './trava/getTravaReservations'
import { getTravaDuration } from './trava/getTravaDuration'
import { getTravaTargetGroups } from './trava/getTravaTargetGroups'
import { generateTravaDescriptions } from './trava/generateTravaDescriptions'
import { logError } from './logError'
import * as TravaCardCreationErrors from './TravaCardCreationErrors'
import { infoItemsToString } from './infoItemToString'
import { getLogisticsForTypeDoFromBing } from './trava/getLogisticsForTypeDoFromBing'

export type TravaDescriptions = {
  existingDescriptionShort?: string
  existingDescriptionLong?: string
}

export interface IUpdateCardWithAIInput {
  name: string
  attractionId: string
  travaDestinationId: string
  attractionType: ATTRACTION_TYPE
  destinationName: string
  hours?: HoursInput | null
  editorialSummary?: string
  reservable?: boolean
  reviews?: string[]
  mealServices?: MealServicesInput | null
  price?: number | null
  categories?: string[]
  duration?: string
  descriptions?: string[]
  existingTravaDescriptions?: TravaDescriptions // for attractions, we'll generate descriptions in a separate initial request. Subsequent requests will use the existing descriptions.
  bingDescription?: string
  recommendationBadges?: BADGES[]
  generateLogistics?: boolean // for type do, this should be true on second pass
  bestVisitedByPopularTimes?: ATTRACTION_BEST_VISIT_TIME[]
  aboutBusiness?: AboutBusinessInput | null // google about page
  yelpAmenities?: InfoItemInput[]
  authorType: AUTHOR_TYPE
}

let commonCardFields = {
  costType: ATTRACTION_COST_TYPE.PERSON,
  costCurrency: CURRENCY_TYPE.USD,
  isTravaCreated: 1,
  privacy: ATTRACTION_PRIVACY.PUBLIC,
  bucketListCount: 0,
}

const now = new Date().toISOString()

type UpdateCardWithAIResponse = {
  attraction: CreateAttractionInput
  generatedSummary?: string
}

export async function updateCardWithAI(cardInput: IUpdateCardWithAIInput): Promise<UpdateCardWithAIResponse> {
  const {
    name,
    attractionId,
    travaDestinationId,
    attractionType,
    destinationName,
    hours,
    editorialSummary,
    reservable,
    reviews,
    mealServices,
    price,
    categories,
    duration,
    descriptions,
    existingTravaDescriptions,
    bingDescription,
    recommendationBadges,
    generateLogistics,
    bestVisitedByPopularTimes,
    aboutBusiness,
    yelpAmenities,
    authorType,
  } = cardInput
  const isTypeDo = attractionType === ATTRACTION_TYPE.DO
  const isTypeEat = attractionType === ATTRACTION_TYPE.EAT

  const { existingDescriptionShort, existingDescriptionLong } = existingTravaDescriptions || {}

  let travaAttraction: CreateAttractionInput = {
    ...commonCardFields,
    id: attractionId,
    name,
    type: attractionType,
    destinationId: travaDestinationId,
    recommendationBadges,
    descriptionShort: existingDescriptionShort ?? '',
    descriptionLong: existingDescriptionLong ?? '',
    bestVisited: null,
    createdAt: now,
    updatedAt: now,
    seasons: [
      {
        startMonth: 0,
        startDay: 0,
        endMonth: 11,
        endDay: 30,
      },
    ],
    authorType,
    label: AttractionLabel.ATTRACTION,
  }

  let generatedSummary = '' // to be populated with input to gpt-4's description generation

  const travaDescriptionsExist = travaAttraction.descriptionShort && travaAttraction.descriptionLong

  // if type DO, and generateLogistics is true, we only need to generate logistics, which require bingDescription
  if (isTypeDo) {
    if (generateLogistics && !bingDescription) {
      throw new TravaCardCreationErrors.TravaDoAttractionMissingBingInfoError({
        attractionId,
        attractionName: name,
        destinationName,
        message: `Trava DO attraction is missing bingDescription`,
      })
    } else if (!generateLogistics && travaDescriptionsExist) {
      throw new TravaCardCreationErrors.TravaDoAttractionAlreadyHasDescriptionsError({
        attractionId,
        attractionName: name,
        destinationName,
        message: `Trava DO attraction already has descriptions; next step is to generate logistics`,
      })
    }
  }

  // if google reviews don't exist, throw error
  if (!reviews || reviews.length === 0) {
    throw new TravaCardCreationErrors.TravaAttractionMissingGoogleReviewsError({
      attractionId,
      attractionName: name,
      destinationName,
      message: `Trava attraction is missing google reviews`,
    })
  }

  const { amenities, atmosphere, crowd, planning } = aboutBusiness || {}

  const aboutDetails = [
    infoItemsToString(amenities, 'Amenities'),
    infoItemsToString(atmosphere, 'Atmosphere'),
    infoItemsToString(crowd, 'Crowd'),
    infoItemsToString(planning, 'Planning'),
  ].filter(Boolean)

  // Join the aboutDetails into a single string with periods in between.
  const aboutDetailsString = aboutDetails.join('. ')

  // chunks of potentially relevant text to include as input to openai request
  const allSegments = [
    aboutDetailsString,
    ...(reviews ?? []),
    ...(descriptions ?? []),
    bingDescription,
  ].filter((item): item is string => Boolean(item))

  const relevanceMap = await getSentenceRelevanceMap({
    segments: allSegments,
    attractionId,
    attractionName: name,
    destinationName,
    attractionType,
  })

  console.log('got relevanceMap')

  const currentInputForSummary = editorialSummary ? editorialSummary : ''

  if (!travaDescriptionsExist) {
    // if trava descriptions don't exist, generate them
    try {
      const response = await generateTravaDescriptions({
        attractionId,
        attractionName: name,
        destinationName,
        attractionType,
        currentInputForSummary, // definitely want to include (e.g. editorial overview)
        relevanceMap,
      })

      console.log('got generated descriptions')

      travaAttraction = {
        ...travaAttraction,
        descriptionShort: response.descriptionShort,
        descriptionLong: response.descriptionLong,
      }

      generatedSummary = response.inputToSummary as string
    } catch (error) {
      await logError({
        error: error as Error,
        context: `generateTravaDescriptions for ${name} in ${destinationName}`,
        shouldThrow: true,
      })
    }
  }

  if (isTypeDo) {
    // must rely on bingDescription for logistics
    if (generateLogistics) {
      try {
        console.log('updateCardWithAI second pass for type do: using bing response to get logistics from openai')
        const { attractionCategories, reservation, attractionTargetGroups } = await getLogisticsForTypeDoFromBing({
          attractionId,
          attractionName: name,
          destinationName,
          bingDescription: bingDescription as string, // must be defined because generateLogistics is true
        })

        travaAttraction = {
          ...travaAttraction,
          attractionCategories,
          reservation,
          attractionTargetGroups,
        }
      } catch (error) {
        await logError({
          error: error as Error,
          context: `getLogisticsForTypeDoFromBing for ${name} in ${destinationName}`,
          shouldThrow: true,
        })
      }
    } else {
      // if bingDescription doesn't exist, return travaAttraction with trava descriptions & w/o logistics. Generate bingDescription with trava descriptions, then re-invoke this fn with bingDescription
      return {
        attraction: travaAttraction,
        generatedSummary,
      }
    }
  }

  // categories, reservations, targetGroups may already exist from bingDescription
  if (
    (isTypeDo && !travaAttraction.attractionCategories?.length) ||
    (isTypeEat && !travaAttraction.attractionCuisine?.length)
  ) {
    try {
      const travaCategories = await getTravaCategories({
        attractionId,
        attractionName: name,
        destinationName,
        recommendationSourceCategories: categories,
        attractionType,
        relevanceMap,
      })

      if (isTypeDo) {
        travaAttraction = {
          ...travaAttraction,
          attractionCategories: travaCategories as ATTRACTION_CATEGORY_TYPE[],
        }
      } else if (isTypeEat) {
        travaAttraction = {
          ...travaAttraction,
          attractionCuisine: travaCategories as ATTRACTION_CUISINE_TYPE[],
        }
      }
    } catch (error) {
      await logError({
        error: error as Error,
        context: `getTravaCategories for ${name} in ${destinationName}`,
        shouldThrow: true,
      })
    }
  } else {
    console.log('Skipping getTravaCategories because categories already exist')
  }

  const mealsServed: IMealsServed = {
    breakfast: mealServices?.servesBreakfast,
    brunch: mealServices?.servesBrunch,
    lunch: mealServices?.servesLunch,
    dinner: mealServices?.servesDinner,
  }

  try {
    const travaBestVisited = await getTravaBestVisited({
      attractionId,
      attractionName: name,
      attractionType,
      relevanceMap,
      hours,
      destinationName,
      bestVisitedByPopularTimes,
      mealsServed,
      travaCuisines: travaAttraction.attractionCuisine as ATTRACTION_CUISINE_TYPE[],
    })

    console.log(`travaBestVisited: ${JSON.stringify(travaBestVisited, null, 2)}`)

    travaAttraction = {
      ...travaAttraction,
      bestVisited: travaBestVisited,
    }
  } catch (error) {
    await logError({
      error: error as Error,
      context: `getTravaBestVisited for ${name} in ${destinationName}`,
      shouldThrow: true,
    })
  }

  try {
    const travaDuration = await getTravaDuration({
      attractionId,
      attractionName: name,
      destinationName,
      attractionType,
      relevanceMap,
      travaBestVisited: travaAttraction.bestVisited as ATTRACTION_BEST_VISIT_TIME[],
      recSourceDuration: duration,
    })

    travaAttraction = {
      ...travaAttraction,
      duration: travaDuration,
    }
  } catch (error) {
    await logError({
      error: error as Error,
      context: `getTravaDuration for ${name} in ${destinationName}`,
      shouldThrow: true,
    })
  }

  if (!travaAttraction.cost) {
    try {
      const travaCost = await getTravaCost({
        attractionId,
        attractionName: name,
        destinationName,
        recSourcePrice: price,
        attractionType,
        relevanceMap,
        bingDescription,
      })

      travaAttraction = {
        ...travaAttraction,
        cost: travaCost,
      }
    } catch (error) {
      await logError({
        error: error as Error,
        context: `getTravaCost for ${name} in ${destinationName}`,
        shouldThrow: true,
      })
    }
  } else {
    console.log('Skipping getTravaCost because cost already exists')
  }

  if (!travaAttraction.reservation) {
    try {
      const travaReservation = await getTravaReservations({
        attractionId,
        attractionName: name,
        destinationName,
        relevanceMap,
        attractionType,
        reservable: Boolean(reservable), // google maps returns this boolean
        planning: planning?.filter((item): item is InfoItemInput => Boolean(item)),
      })

      travaAttraction = {
        ...travaAttraction,
        reservation: travaReservation,
      }
    } catch (error) {
      await logError({
        error: error as Error,
        context: `getTravaReservations for ${name} in ${destinationName}`,
        shouldThrow: true,
      })
    }
  } else {
    console.log('Skipping getTravaReservations because reservation already exists')
  }

  if (!travaAttraction.attractionTargetGroups?.length) {
    try {
      const travaTargetGroup = await getTravaTargetGroups({
        attractionId,
        attractionName: name,
        attractionType,
        relevanceMap,
        destinationName,
        yelpAmenities,
        aboutBusiness,
        servesVegetarianFood: mealServices?.servesVegetarianFood,
      })

      travaAttraction = {
        ...travaAttraction,
        attractionTargetGroups: travaTargetGroup,
      }
    } catch (error) {
      await logError({
        error: error as Error,
        context: `getTravaTargetGroups for ${name} in ${destinationName}`,
        shouldThrow: true,
      })
    }
  } else {
    console.log('Skipping getTravaTargetGroups because targetGroups already exist')
  }

  return {
    attraction: travaAttraction,
    generatedSummary,
  }
}
