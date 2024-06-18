import { AttractionSeason } from 'shared-types/API'

export const getSeasonsObjectsFromStrings = (seasons_str: string[]): AttractionSeason[] =>
  seasons_str.map((season_str) => {
    const [startMonth, startDay, endMonth, endDay] = season_str.split('-').map((s) => parseInt(s) - 1)

    return {
      __typename: 'AttractionSeason',
      startMonth: startMonth,
      startDay: startDay,
      endMonth: endMonth,
      endDay: endDay,
    }
  })
