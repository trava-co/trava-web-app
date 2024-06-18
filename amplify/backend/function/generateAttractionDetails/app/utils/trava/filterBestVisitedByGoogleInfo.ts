import { ATTRACTION_BEST_VISIT_TIME, PeriodInput } from 'shared-types/API'
import { IMealsServed } from './getTravaBestVisited'

const daypartToTimeMapping: Partial<Record<ATTRACTION_BEST_VISIT_TIME, { start: number; end: number }>> = {
  [ATTRACTION_BEST_VISIT_TIME.MORNING]: { start: 400, end: 1200 },
  [ATTRACTION_BEST_VISIT_TIME.AFTERNOON]: { start: 1200, end: 1800 },
  [ATTRACTION_BEST_VISIT_TIME.EVENING]: { start: 1800, end: 2400 },
  [ATTRACTION_BEST_VISIT_TIME.BREAKFAST]: { start: 600, end: 1000 },
  [ATTRACTION_BEST_VISIT_TIME.LUNCH]: { start: 1200, end: 1600 },
  [ATTRACTION_BEST_VISIT_TIME.DINNER]: { start: 1600, end: 2400 },
  [ATTRACTION_BEST_VISIT_TIME.SNACK]: { start: 0, end: 2400 },
}

// Filter out best visited times that are outside of the attraction's operating hours
function filterBestVisitedByOperatingHours(
  travaBestVisited: ATTRACTION_BEST_VISIT_TIME[],
  periods: PeriodInput[] | null | undefined,
) {
  return Array.from(travaBestVisited).filter((visitTime) => {
    const daypartTime = daypartToTimeMapping[visitTime]
    if (!daypartTime) {
      return false
    }
    const { start: daypartStartTime, end: daypartEndTime } = daypartTime

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

      // if time is missing, assume the attraction is open 24 hours
      if (!period.open.time || !period.close.time) {
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
}

const filterBestVisitedByMealsServed = (
  candidatesForBestVisitedTimes: ATTRACTION_BEST_VISIT_TIME[],
  googleMealsServed?: IMealsServed,
): Set<ATTRACTION_BEST_VISIT_TIME> => {
  let validTimes = new Set<ATTRACTION_BEST_VISIT_TIME>()
  // check restaurant.google.breakfast,
  const { breakfast, brunch, lunch, dinner } = googleMealsServed ?? {}
  candidatesForBestVisitedTimes.forEach((popularTime) => {
    if (popularTime === ATTRACTION_BEST_VISIT_TIME.BREAKFAST && (breakfast !== false || brunch !== false)) {
      validTimes.add(popularTime)
    } else if (popularTime === ATTRACTION_BEST_VISIT_TIME.LUNCH && (lunch !== false || brunch !== false)) {
      validTimes.add(popularTime)
    } else if (popularTime === ATTRACTION_BEST_VISIT_TIME.DINNER && dinner !== false) {
      validTimes.add(popularTime)
    } else if (popularTime === ATTRACTION_BEST_VISIT_TIME.SNACK) {
      validTimes.add(popularTime)
    }
  })
  return validTimes
}

export { filterBestVisitedByMealsServed, filterBestVisitedByOperatingHours }
