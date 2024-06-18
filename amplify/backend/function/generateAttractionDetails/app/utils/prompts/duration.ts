import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ATTRACTION_DURATION, ATTRACTION_TYPE } from 'shared-types/API'

export const possibleDurations: Record<string, Record<string, string>> = {
  [ATTRACTION_TYPE.DO]: {
    [ATTRACTION_DURATION.LESS_THAN_AN_HOUR]: ATTRACTION_DURATION.LESS_THAN_AN_HOUR,
    [ATTRACTION_DURATION.ONE_TWO_HOURS]: ATTRACTION_DURATION.ONE_TWO_HOURS,
    [ATTRACTION_DURATION.TWO_THREE_HOURS]: ATTRACTION_DURATION.TWO_THREE_HOURS,
    [ATTRACTION_DURATION.MORE_THAN_THREE_HOURS]: ATTRACTION_DURATION.MORE_THAN_THREE_HOURS,
  },
  [ATTRACTION_TYPE.EAT]: {
    [ATTRACTION_DURATION.LESS_THAN_AN_HOUR]: ATTRACTION_DURATION.LESS_THAN_AN_HOUR,
    [ATTRACTION_DURATION.ONE_TWO_HOURS]: ATTRACTION_DURATION.ONE_TWO_HOURS,
    [ATTRACTION_DURATION.TWO_THREE_HOURS]: ATTRACTION_DURATION.TWO_THREE_HOURS,
  },
}

export const getTravaDurationChatThread = (
  attractionName: string,
  destinationName: string,
  attractionType: ATTRACTION_TYPE,
  attractionDescription: string,
) => {
  if (attractionType === ATTRACTION_TYPE.DO) {
    const DO: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided an attraction, your job is to determine the suggested duration, using any research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of the following comma-separated options:${Object.values(
          possibleDurations[ATTRACTION_TYPE.DO],
        ).join(',')}.`,
      },
      {
        role: 'user',
        content: 'Determine the suggested duration for the attraction "Dip into the Barton Springs Pool" in Austin.',
      },
      {
        role: 'assistant',
        content: ATTRACTION_DURATION.TWO_THREE_HOURS,
      },
      {
        role: 'user',
        content: 'Determine the suggested duration for the attraction "Watch A Red Sox Game at Fenway Park" in Boston.',
      },
      {
        role: 'assistant',
        content: ATTRACTION_DURATION.MORE_THAN_THREE_HOURS,
      },
      {
        role: 'user',
        content: `Determine the suggested duration for the attraction ${attractionName} in ${destinationName}. Here's my research:${attractionDescription}.`,
      },
    ]
    return DO
  } else {
    const EAT: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided a place, your job is to determine the suggested duration, using any research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of the following comma-separated options:${Object.values(
          possibleDurations[ATTRACTION_TYPE.EAT],
        ).join(',')}`,
      },
      {
        role: 'user',
        content: "Determine the suggested duration for dining at Lou Malnati's in Chicago.",
      },
      {
        role: 'assistant',
        content: ATTRACTION_DURATION.ONE_TWO_HOURS,
      },
      {
        role: 'user',
        content: `Determine the suggested duration for dining at ${attractionName} in ${destinationName}. Here's my research:${attractionDescription}.`,
      },
    ]
    return EAT
  }
}
