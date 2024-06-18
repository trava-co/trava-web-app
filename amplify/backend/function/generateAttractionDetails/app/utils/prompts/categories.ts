import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ATTRACTION_TYPE, ATTRACTION_CATEGORY_TYPE, ATTRACTION_CUISINE_TYPE } from 'shared-types/API'
import { AttractionCategoryOrCuisineType } from '../constants'

export const possibleCategories: Record<string, Record<string, AttractionCategoryOrCuisineType>> = {
  [ATTRACTION_TYPE.DO]: ATTRACTION_CATEGORY_TYPE,
  [ATTRACTION_TYPE.EAT]: ATTRACTION_CUISINE_TYPE,
}

// removed "Only use the functions you have been provided with.", since we're force-calling
export const getCategoriesChatThread = (
  attractionName: string,
  destinationName: string,
  attractionType: ATTRACTION_TYPE,
  attractionDescription: string,
) => {
  if (attractionType === ATTRACTION_TYPE.DO) {
    const DO: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided an attraction, select one or two categories that best describe it, using any research provided to you and if insufficient, falling back to your own knowledge. Respond with an array consisting of one or two of these elements: ${Object.values(
          possibleCategories[attractionType],
        ).join(',')}. Order your selection(s) by best, first.`,
      },
      {
        role: 'user',
        content: `For the attraction Dip into the Barton Springs Pool in Austin, select one or two of the following categories that best describe it.`,
      },
      {
        role: 'assistant',
        content: `[${ATTRACTION_CATEGORY_TYPE.NATURE},${ATTRACTION_CATEGORY_TYPE.LEISURE}]`,
      },
      {
        role: 'user',
        content: `For the attraction Watch A Red Sox Game at Fenway Park in Boston, select one or two of the following categories that best describe it.`,
      },
      {
        role: 'assistant',
        content: `[${ATTRACTION_CATEGORY_TYPE.ENTERTAINMENT}]`,
      },
      {
        role: 'user',
        content: `For the attraction ${attractionName} in ${destinationName}, select one or two of the following categories that best describe it. Order your selection(s) by best, first. Use this research:${attractionDescription}.`,
      },
    ]
    return DO
  } else {
    const EAT: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided a restaurant, select a maximum of three cuisine types that best describe the food served, using any research provided to you and if insufficient, falling back to your own knowledge. Respond with an array consisting of up to three of these elements: ${Object.values(
          possibleCategories[attractionType],
        ).join(',')}. Order your selection(s) by best, first.`,
      },
      {
        role: 'user',
        content:
          "For the restaurant Lou Malnati's in Chicago, select a maximum of three cuisine types that best describe the food served.",
      },
      {
        role: 'assistant',
        content: `[${ATTRACTION_CUISINE_TYPE.PIZZA}]`,
      },
      {
        role: 'user',
        content:
          'For the restaurant Odd Duck in Austin, select a maximum of three cuisine types that best describe the food served.',
      },
      {
        role: 'assistant',
        content: `[${ATTRACTION_CUISINE_TYPE.AMERICAN_NEW},${ATTRACTION_CUISINE_TYPE.TAPAS_AND_SMALL_PLATES}]`,
      },
      {
        role: 'user',
        content: `For the restaurant ${attractionName} in ${destinationName}, select a maximum of three cuisine types that best describe the food served. Order your selection(s) by best, first. Use this research:${attractionDescription}.`,
      },
    ]
    return EAT
  }
}
