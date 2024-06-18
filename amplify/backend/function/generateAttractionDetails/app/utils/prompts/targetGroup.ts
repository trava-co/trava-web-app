import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ATTRACTION_TYPE, ATTRACTION_TARGET_GROUP } from 'shared-types/API'

export enum DESCRIPTIVE_TARGET_GROUP_NAMES {
  RAINY_DAYS = 'RAINY_DAYS',
  COUPLES = 'COUPLES',
  LARGE_GROUPS = 'LARGE_GROUPS',
  KIDS = 'KIDS',
  PETS = 'PETS',
  BACHELORETTE_PARTIES = 'BACHELORETTE_PARTIES',
  OUTDOOR_SEATING = 'OUTDOOR_SEATING',
  VEGETARIAN = 'VEGETARIAN',
}

export const targetGroupMap: Record<ATTRACTION_TYPE, Record<string, ATTRACTION_TARGET_GROUP>> = {
  [ATTRACTION_TYPE.DO]: {
    [DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS]: ATTRACTION_TARGET_GROUP.RAINY,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES]: ATTRACTION_TARGET_GROUP.COUPLE,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS]: ATTRACTION_TARGET_GROUP.LARGE_GROUP,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS]: ATTRACTION_TARGET_GROUP.KID,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.PETS]: ATTRACTION_TARGET_GROUP.PET,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES]: ATTRACTION_TARGET_GROUP.BACHELOR,
  },
  [ATTRACTION_TYPE.EAT]: {
    [DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS]: ATTRACTION_TARGET_GROUP.RAINY,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES]: ATTRACTION_TARGET_GROUP.COUPLE,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS]: ATTRACTION_TARGET_GROUP.LARGE_GROUP,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS]: ATTRACTION_TARGET_GROUP.KID,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.PETS]: ATTRACTION_TARGET_GROUP.PET,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES]: ATTRACTION_TARGET_GROUP.BACHELOR,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.OUTDOOR_SEATING]: ATTRACTION_TARGET_GROUP.OUTDOOR,
    [DESCRIPTIVE_TARGET_GROUP_NAMES.VEGETARIAN]: ATTRACTION_TARGET_GROUP.VEGETARIAN,
  },
}

export const getTravaTargetGroupChatThread = (
  attractionName: string,
  destinationName: string,
  attractionType: ATTRACTION_TYPE,
  possibleGroups: string[],
  attractionDescription: string,
) => {
  if (attractionType === ATTRACTION_TYPE.DO) {
    const DO: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided an attraction, your job is to determine the groups and attributes the attraction would be suitable for, using any research provided to you and if insufficient, falling back to your own knowledge. Limit your response to only print an array consisting of elements that are one of these comma-separated values: ${possibleGroups.join(
          ',',
        )}.`,
      },
      {
        role: 'user',
        content:
          'For the attraction Lady Bird Lake in Austin, determine the groups and attributes the attraction would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.PETS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES}]`,
      },
      {
        role: 'user',
        content:
          "For the attraction Esther's Follies in Austin, determine the groups and attributes the attraction would be suitable for.",
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES}]`,
      },
      {
        role: 'user',
        content:
          'For the attraction The Thinkery in Austin, determine the groups and attributes the attraction would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS}]`,
      },
      {
        role: 'user',
        content:
          'For the attraction Shop at the Domain in Austin, determine the groups and attributes the attraction would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.PETS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES}]`,
      },
      {
        role: 'user',
        content: `For the attraction ${attractionName} in ${destinationName}, determine the groups and attributes the attraction would be suitable for. Here is my research:${attractionDescription}.`,
      },
    ]
    return DO
  } else {
    const EAT: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Provided a restaurant, your job is to determine the groups and attributes the restaurant would be suitable for, using any research provided to you and if insufficient, falling back to your own knowledge. Limit your response to only print an array consisting of elements that are one of these comma-separated values:${possibleGroups.join(
          ',',
        )}. Be slightly lenient -- but still sensible -- with your inclusions.`,
      },
      {
        role: 'user',
        content:
          'For the restaurant Odd Duck in Austin, determine the groups and attributes the restaurant would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.OUTDOOR_SEATING}]`,
      },
      {
        role: 'user',
        content:
          'For the restaurant Batter & Berries in Chicago, determine the groups and attributes the restaurant would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.COUPLES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS}]`,
      },
      {
        role: 'user',
        content:
          'For the restaurant Magnolia Cafe in Austin, determine the groups and attributes the restaurant would be suitable for.',
      },
      {
        role: 'assistant',
        content: `[${DESCRIPTIVE_TARGET_GROUP_NAMES.RAINY_DAYS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.LARGE_GROUPS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.KIDS}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.BACHELORETTE_PARTIES}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.OUTDOOR_SEATING}, ${DESCRIPTIVE_TARGET_GROUP_NAMES.VEGETARIAN}]`,
      },
      {
        role: 'user',
        content: `For the restaurant ${attractionName} in ${destinationName}, determine the groups and attributes the restaurant would be suitable for. Here's my research: ${attractionDescription}.`,
      },
    ]
    return EAT
  }
}
