import {
  ATTRACTION_BEST_VISIT_TIME,
  ATTRACTION_DURATION,
  ATTRACTION_TYPE,
  AttractionSwipeResult,
  GetDataForGenerateTripPlanQuery,
  CustomGenerateTripPlanQueryVariables,
  TripDestination,
  TripPlanAttraction,
  UserTripStatus,
  AUTHOR_TYPE,
  CustomGetAttractionsForSchedulerQuery,
} from './API'
import * as dayjs from 'dayjs'
import { DateFormat } from './dateFormat'

enum planGeneratorPreferredTime {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

const attractionDuration = {
  [ATTRACTION_DURATION.LESS_THAN_AN_HOUR]: 1,
  [ATTRACTION_DURATION.ONE_TWO_HOURS]: 2,
  [ATTRACTION_DURATION.TWO_THREE_HOURS]: 3,
  [ATTRACTION_DURATION.MORE_THAN_THREE_HOURS]: 4,
}

const planGeneratorTypeEat = 'eat'

export const NON_VOTING_DECK_ATTRACTIONS_RANGE = 15 // in miles

// Array containing some or all of ['morning', 'afternoon', 'evening'] if 'do' else some or all of ['breakfast', lunch', 'dinner']. In order of preference i.e. [BestVisited 1#, BestVistied 2# etc.]
const getAttractionPreferredTime = (
  attractionType: ATTRACTION_TYPE,
  attractionBestVisited: ATTRACTION_BEST_VISIT_TIME[],
) => {
  const queryGeneratorBestVisitVariables =
    attractionType === ATTRACTION_TYPE.DO
      ? [planGeneratorPreferredTime.MORNING, planGeneratorPreferredTime.AFTERNOON, planGeneratorPreferredTime.EVENING]
      : [
          planGeneratorPreferredTime.BREAKFAST,
          planGeneratorPreferredTime.LUNCH,
          planGeneratorPreferredTime.DINNER,
          planGeneratorPreferredTime.SNACK,
        ]

  return attractionBestVisited
    .filter((bestVisitTime) =>
      queryGeneratorBestVisitVariables.includes(bestVisitTime.toLowerCase() as planGeneratorPreferredTime),
    )
    .map((el) => el.toLowerCase())
}

const getInputForTripPlan = (
  trip: GetDataForGenerateTripPlanQuery['getUser']['userTrips']['items'][0]['trip'],
  attractionsForScheduler: CustomGetAttractionsForSchedulerQuery['getAttractionsForScheduler']['attractions'],
  endDate: TripDestination['endDate'],
  startDate: TripDestination['startDate'],
  startTime: TripDestination['startTime'],
  endTime: TripDestination['endTime'],
): CustomGenerateTripPlanQueryVariables => {
  if (!trip) return null

  const approvedMembers = trip.members?.items?.filter((el) => el.status === UserTripStatus.APPROVED)

  const attractionCandidates = attractionsForScheduler?.map((attraction) => ({
    ...attraction,
    locations: attraction.locations
      .filter((location) => !location.deleted)
      .map((loc) => ({
        id: loc.id,
        startLoc: {
          id: loc.startLoc.id,
          googlePlaceId: loc.startLoc.googlePlaceId,
          coords: {
            lat: loc.startLoc.googlePlace.data.coords.lat,
            long: loc.startLoc.googlePlace.data.coords.long,
          },
          ...(loc.startLoc.googlePlace.data.hours && {
            hours: { periods: loc.startLoc.googlePlace.data.hours.periods },
          }),
        },
        endLoc: {
          id: loc.endLoc.id,
          googlePlaceId: loc.endLoc.googlePlaceId,
          coords: {
            lat: loc.endLoc.googlePlace.data.coords.lat,
            long: loc.endLoc.googlePlace.data.coords.long,
          },
          ...(loc.endLoc.googlePlace.data.hours && { hours: { periods: loc.endLoc.googlePlace.data.hours.periods } }),
        },
      })),
  }))

  // Send to TPG: all public cards that are either < 15 mi from destination, tagged to the destinationId, or has right swipes
  // Currently, TPG only considers a) trava admin created cards w/ 0 swipes or b) cards with 1+ right swipe(s)
  const attractionPossibilities = attractionCandidates?.filter(
    (attraction) => attraction.locations.length > 0, // only pass attractions with at least one non-deleted location
  )

  const attractions = attractionPossibilities?.map((attraction) => {
    const attractionObj: TripPlanAttraction = {
      attractionId: attraction.id,
      name: attraction.name,
      locations: attraction.locations,
      travaCard: attraction.isTravaCreated === 1 && attraction.authorType === AUTHOR_TYPE.ADMIN,
    }

    const preferredTime = getAttractionPreferredTime(attraction.type, attraction.bestVisited)
    if (preferredTime?.length) {
      attractionObj.preferredTime = preferredTime // Array containing some or all of ['morning', 'afternoon', 'evening'] if 'do' else some or all of ['breakfast', lunch', 'dinner']. In order of preference i.e. [BestVisited 1#, BestVistied 2# etc.]. TPG considers up to top 3.
    }

    if (attraction.duration) {
      attractionObj.duration = attractionDuration[attraction.duration] || 1 // Int = 1 // Hours
    }

    if (attraction.attractionCategories) {
      // Name of the category of attraction. Any are accepted. Not required, if no category is provided then this attraction is not influenced by category distribution flattening.
      attractionObj.category = attraction.attractionCategories?.[0]
    }

    if (attraction.seasons) {
      attractionObj.seasons = attraction.seasons
    }

    return attraction.type === ATTRACTION_TYPE.EAT ? { ...attractionObj, type: planGeneratorTypeEat } : attractionObj
  })

  const attractionsIds = attractions.map((el) => el.attractionId)

  const nDays =
    dayjs(endDate.toString(), DateFormat.YYYYMMDD).diff(dayjs(startDate.toString(), DateFormat.YYYYMMDD), 'd') + 1

  const ratings = approvedMembers?.map((member) => {
    return attractionsIds.map((attractionId) => {
      const found = trip.attractionSwipes?.items?.find(
        (swipe) => swipe.attractionId === attractionId && swipe.userId === member.userId,
      )
      return !found ? 0 : found.swipe === AttractionSwipeResult.LIKE ? 1 : -1
    })
  })

  return {
    attractions,
    group: {
      startDate,
      nDays,
      ratings,
      startTime: startTime.toLowerCase(),
      endTime: endTime.toLowerCase(),
    },
  }
}

export default getInputForTripPlan
