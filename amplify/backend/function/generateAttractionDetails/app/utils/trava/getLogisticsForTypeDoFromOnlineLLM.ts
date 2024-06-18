import {
  ATTRACTION_TYPE,
  ATTRACTION_CATEGORY_TYPE,
  ATTRACTION_RESERVATION,
  ATTRACTION_TARGET_GROUP,
} from 'shared-types/API'
import { possibleCategories } from '../prompts/categories'
import { Logistics, determineLogistics } from '../prompts/mostSimilarResponse'
import { reservationsMap } from '../prompts/reservations'
import { targetGroupMap } from '../prompts/targetGroup'

interface GetLogisticsForTypeDoFromBingInput {
  attractionId: string
  attractionName: string
  destinationName: string
  onlineLLMDescription: string
}

export async function getLogisticsForTypeDoFromOnlineLLM({
  attractionId,
  attractionName,
  destinationName,
  onlineLLMDescription,
}: GetLogisticsForTypeDoFromBingInput) {
  const possibleTravaCategories = Object.values(possibleCategories[ATTRACTION_TYPE.DO]) as ATTRACTION_CATEGORY_TYPE[]
  const possibleReservationValues = Object.values(reservationsMap) as ATTRACTION_RESERVATION[]
  const possibleTargetGroups = Object.values(targetGroupMap[ATTRACTION_TYPE.DO]) as ATTRACTION_TARGET_GROUP[]

  let logistics: Logistics

  try {
    // query openai for logistics from onlineLLM descriptions
    // necessary because categories from rec sources aren't always available/more variable
    logistics = await determineLogistics({
      description: onlineLLMDescription,
      possibleTravaCategories,
      possibleReservationValues,
      possibleTargetGroups,
    })
  } catch (error) {
    console.error('Error querying GPT-4 for logistics from onlineLLM description for type DO')
    throw error
  }

  // for each of the logistics, if it is a valid value, then add it to the object to return
  const { categories, reservations, targetGroups } = logistics
  const validCategories: ATTRACTION_CATEGORY_TYPE[] = []

  // check if categories is valid
  categories.forEach((category) => {
    if (possibleTravaCategories.includes(category as ATTRACTION_CATEGORY_TYPE)) {
      validCategories.push(category as ATTRACTION_CATEGORY_TYPE)
    }
  })

  // check if reservations is valid
  const validReservations = possibleReservationValues.includes(reservations as ATTRACTION_RESERVATION)
    ? (reservations as ATTRACTION_RESERVATION)
    : undefined

  // check if targetGroups is valid
  const validTargetGroups: ATTRACTION_TARGET_GROUP[] = []
  targetGroups.forEach((group) => {
    if (possibleTargetGroups.includes(group as ATTRACTION_TARGET_GROUP)) {
      validTargetGroups.push(group as ATTRACTION_TARGET_GROUP)
    }
  })

  // if there are no valid categories, reservations, or targetGroups from GPT-4, throw an error
  if (validCategories.length === 0 && !validReservations && validTargetGroups.length === 0) {
    throw new Error(
      `No valid categories, reservations, or targetGroups from GPT-4 for ${attractionName} in ${destinationName}. attractionId: ${attractionId}. onlineLLM description: ${onlineLLMDescription}`,
    )
  }

  const validLogistics = {
    attractionCategories: validCategories,
    reservation: validReservations,
    attractionTargetGroups: validTargetGroups,
  }

  // console.log(`validLogistics for ${attractionName}: ${JSON.stringify(validLogistics, null, 2)}`)

  // return the logistics
  return validLogistics
}
