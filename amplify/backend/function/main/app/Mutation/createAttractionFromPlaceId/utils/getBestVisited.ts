import { ATTRACTION_BEST_VISIT_TIME, ATTRACTION_TYPE, MealServicesInput, PeriodInput } from 'shared-types/API'

interface IGetBestVisited {
  periods: PeriodInput[] | null | undefined
  mealServices: MealServicesInput | null | undefined
  attractionType: ATTRACTION_TYPE
}

const daypartToTimeMapping: Record<ATTRACTION_BEST_VISIT_TIME, { start: number; end: number }> = {
  [ATTRACTION_BEST_VISIT_TIME.MORNING]: { start: 400, end: 1200 },
  [ATTRACTION_BEST_VISIT_TIME.AFTERNOON]: { start: 1200, end: 1800 },
  [ATTRACTION_BEST_VISIT_TIME.EVENING]: { start: 1800, end: 2400 },
  [ATTRACTION_BEST_VISIT_TIME.BREAKFAST]: { start: 600, end: 1200 },
  [ATTRACTION_BEST_VISIT_TIME.LUNCH]: { start: 1200, end: 1600 },
  [ATTRACTION_BEST_VISIT_TIME.DINNER]: { start: 1600, end: 2400 },
  [ATTRACTION_BEST_VISIT_TIME.SNACK]: { start: 0, end: 2400 },
  [ATTRACTION_BEST_VISIT_TIME.NON_APPLICABLE]: { start: 0, end: 0 },
}

// Construct new enums for DO and EAT attraction types that exclude NON_APPLICABLE from ATTRACTION_BEST_VISIT_TIME
enum ApplicableBestVisitTimeDo {
  MORNING = ATTRACTION_BEST_VISIT_TIME.MORNING,
  AFTERNOON = ATTRACTION_BEST_VISIT_TIME.AFTERNOON,
  EVENING = ATTRACTION_BEST_VISIT_TIME.EVENING,
}

enum ApplicableBestVisitTimeEat {
  BREAKFAST = ATTRACTION_BEST_VISIT_TIME.BREAKFAST,
  LUNCH = ATTRACTION_BEST_VISIT_TIME.LUNCH,
  DINNER = ATTRACTION_BEST_VISIT_TIME.DINNER,
  // SNACK = ATTRACTION_BEST_VISIT_TIME.SNACK,
}

export function getBestVisited({ periods, mealServices, attractionType }: IGetBestVisited) {
  const possibleBestVisited = Object.values(
    attractionType === ATTRACTION_TYPE.DO ? ApplicableBestVisitTimeDo : ApplicableBestVisitTimeEat,
  ) as ATTRACTION_BEST_VISIT_TIME[]

  // if type ATTRACTION_TYPE.DO, then get best visited from hours of operation
  if (attractionType === ATTRACTION_TYPE.DO) {
    return filterBestVisitedByOperatingHours(possibleBestVisited, periods)
  }

  // else ATTRACTION_TYPE.EAT, then get best visited from serves_breakfast, serves_brunch, serves_lunch, serves_dinner, dine_in, takeout, delivery
  else {
    const googleMealsServed: Record<any, any> = {
      breakfast: mealServices?.servesBreakfast,
      brunch: mealServices?.servesBrunch,
      lunch: mealServices?.servesLunch,
      dinner: mealServices?.servesDinner,
    }

    return filterBestVisitedByMealsServed(possibleBestVisited, googleMealsServed)
  }
}

// Filter out best visited times that are outside of the attraction's operating hours
function filterBestVisitedByOperatingHours(
  travaBestVisited: ATTRACTION_BEST_VISIT_TIME[],
  periods?: PeriodInput[] | null,
) {
  const bestVisited = Array.from(travaBestVisited).filter((visitTime) => {
    const { start: daypartStartTime, end: daypartEndTime } = daypartToTimeMapping[visitTime]

    if (!periods) {
      // If there are no opening hours, assume the attraction is open 24 hours
      // ex: neighborhoods like North End, Boston
      return true
    }

    return periods.some((period) => {
      // if the 'close' key is missing, the attraction is open 24 hours
      if (!period.close) {
        return true
      }

      let attractionOpenTime = parseInt(period.open.time)
      let attractionCloseTime = parseInt(period.close.time)

      // If closing time is smaller than opening time, add 2400 to represent the next day
      if (attractionCloseTime < attractionOpenTime) {
        attractionCloseTime += 2400
      }

      // Adjust daypartEndTime for next day scenarios
      const adjustedDaypartEndTime = daypartEndTime <= daypartStartTime ? daypartEndTime + 2400 : daypartEndTime

      // At least some part of the visit time should fall within the operating hours
      return daypartStartTime < attractionCloseTime && adjustedDaypartEndTime > attractionOpenTime
    })
  })

  if (bestVisited.length === 0) {
    // If no best visited times are within operating hours, return afternoon as the default
    return [ATTRACTION_BEST_VISIT_TIME.AFTERNOON]
  }

  return bestVisited
}

const filterBestVisitedByMealsServed = (
  candidatesForBestVisitedTimes: ATTRACTION_BEST_VISIT_TIME[],
  googleMealsServed?: Record<any, any>,
) => {
  const validTimes: ATTRACTION_BEST_VISIT_TIME[] = []

  if (!googleMealsServed) {
    return [ATTRACTION_BEST_VISIT_TIME.DINNER]
  }

  const { breakfast, brunch, lunch, dinner } = googleMealsServed
  candidatesForBestVisitedTimes.forEach((popularTime) => {
    if (popularTime === ATTRACTION_BEST_VISIT_TIME.BREAKFAST && (breakfast || brunch)) {
      validTimes.push(popularTime)
    } else if (popularTime === ATTRACTION_BEST_VISIT_TIME.LUNCH && (lunch || brunch)) {
      validTimes.push(popularTime)
    } else if (popularTime === ATTRACTION_BEST_VISIT_TIME.DINNER && dinner) {
      validTimes.push(popularTime)
    }
    // else if (popularTime === ATTRACTION_BEST_VISIT_TIME.SNACK) {
    //   validTimes.push(popularTime)
    // }
  })

  if (validTimes.length === 0) {
    // If no best visited times are within operating hours, return dinner as the default
    return [ATTRACTION_BEST_VISIT_TIME.DINNER]
  }

  return validTimes
}

export { filterBestVisitedByMealsServed, filterBestVisitedByOperatingHours }
