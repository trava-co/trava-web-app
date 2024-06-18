import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ATTRACTION_TYPE, ATTRACTION_COST } from 'shared-types/API'

export const possibleCosts: Record<string, Record<string, string>> = {
  [ATTRACTION_TYPE.DO]: {
    [ATTRACTION_COST.FREE]: ATTRACTION_COST.FREE,
    [ATTRACTION_COST.UNDER_TWENTY_FIVE]: ATTRACTION_COST.UNDER_TWENTY_FIVE,
    [ATTRACTION_COST.TWENTY_FIVE_TO_FIFTY]: ATTRACTION_COST.TWENTY_FIVE_TO_FIFTY,
    [ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE]: ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE,
    [ATTRACTION_COST.OVER_SEVENTY_FIVE]: ATTRACTION_COST.OVER_SEVENTY_FIVE,
  },
  [ATTRACTION_TYPE.EAT]: {
    [ATTRACTION_COST.UNDER_TEN]: ATTRACTION_COST.UNDER_TEN,
    [ATTRACTION_COST.TEN_TO_THIRTY]: ATTRACTION_COST.TEN_TO_THIRTY,
    [ATTRACTION_COST.THIRTY_TO_SIXTY]: ATTRACTION_COST.THIRTY_TO_SIXTY,
    [ATTRACTION_COST.OVER_SIXTY]: ATTRACTION_COST.OVER_SIXTY,
  },
}

export const getCostChatThread = (
  attractionName: string,
  destinationName: string,
  attractionType: ATTRACTION_TYPE,
  attractionDescription: string,
) => {
  if (attractionType === ATTRACTION_TYPE.DO) {
    const DO: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided an attraction, estimate the average cost per person, selecting exactly one of these cost options: ${Object.values(
          possibleCosts[attractionType],
        ).join(',')}. Use your own knowledge and any information provided.`,
      },
      {
        role: 'user',
        content: `For the attraction Dip into the Barton Springs Pool in Austin, estimate the average cost per person. Use your preexisting knowledge on the attraction.`,
      },
      {
        role: 'assistant',
        content: ATTRACTION_COST.UNDER_TWENTY_FIVE,
      },
      {
        role: 'user',
        content: `For the attraction Watch A Red Sox Game at Fenway Park in Boston, estimate the average cost per person. Use your preexisting knowledge on the attraction.`,
      },
      {
        role: 'assistant',
        content: ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE,
      },
      {
        role: 'user',
        content: `For the attraction ${attractionName} in ${destinationName}, estimate the average cost per person. Use your preexisting knowledge on the attraction, avoiding hallucination at all costs. You should also use the following information I've gathered:${attractionDescription}.`,
      },
    ]
    return DO
  } else {
    const EAT: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided a restaurant, estimate the average cost per person, selecting exactly one of these cost options: ${Object.values(
          possibleCosts[attractionType],
        ).join(',')}. Use your own knowledge and any information provided.`,
      },
      {
        role: 'user',
        content:
          "For the restaurant Lou Malnati's in Chicago, estimate the average cost per person. Use your preexisting knowledge on the restaurant.",
      },
      {
        role: 'assistant',
        content: ATTRACTION_COST.TEN_TO_THIRTY,
      },
      {
        role: 'user',
        content:
          'For the restaurant Odd Duck in Austin, estimate the average cost per person. Use your preexisting knowledge on the restaurant.',
      },
      {
        role: 'assistant',
        content: ATTRACTION_COST.THIRTY_TO_SIXTY,
      },
      {
        role: 'user',
        content: `For the restaurant ${attractionName} in ${destinationName}, estimate the average cost per person. Use your preexisting knowledge on the restaurant, in addition to the following info I've gathered:${attractionDescription}.`,
      },
    ]
    return EAT
  }
}
