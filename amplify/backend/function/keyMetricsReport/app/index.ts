import { ScheduledHandler } from 'aws-lambda'
import ApiClient from './utils/ApiClient'
import {
  getAllAttractionSwipesPastDay,
  getAllUsersPastDay,
  getAllAttractionsCreatedPastDay,
  getAllItineraryViewsPastDay,
  getAllAppSessionsPastDay,
} from './utils/getAllPastDay'
import { sendSlackMessage } from './utils/sendSlackMessage'
import { AUTHOR_TYPE, UserSession } from 'shared-types/API'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekday)

const tz = 'America/New_York'
const date = dayjs().tz(tz).subtract(1, 'day')

const formattedDate = `${date.format('dddd')}, ${date.format('MMMM')}, ${date.format('D')}, ${date.format('YYYY')}`

export const handler: ScheduledHandler = async () => {
  // only run this function in production
  if (process.env.ENV !== 'prod') return

  console.log('Running key metrics report function...')

  ApiClient.get().useIamAuth()

  // new users
  const newUsersToday = await getAllUsersPastDay()
  const newUsersTodayLength = newUsersToday?.length ?? 0
  console.log(`New users today: ${newUsersTodayLength}`)

  const newUsersCsv = newUsersToday
    .map((user) => `${user.id},${user.username},${user.name},${user.email},${user.phone}`)
    .join('\n')

  // user sessions (app opens)
  const userSessionsToday = await getAllAppSessionsPastDay()
  const userSessionsTodayLength = userSessionsToday?.length ?? 0
  console.log(`User sessions today: ${userSessionsTodayLength}`)

  const userSessionsCsv = userSessionsToday
    .filter((userSession): userSession is UserSession => !!userSession)
    .map(
      (userSession) =>
        `${userSession.id},${userSession.userId},${userSession.user?.username},${userSession.user?.name},${userSession.user?.email},${userSession.deviceType},${userSession.appVersion},${userSession.createdAt}`,
    )
    .join('\n')

  const usersOpeningApp = userSessionsToday
    .filter((userSession): userSession is UserSession => !!userSession)
    .reduce((acc: Record<string, boolean>, userSession) => {
      if (userSession?.userId) {
        return {
          ...acc,
          [userSession.userId]: true,
        }
      } else {
        return acc
      }
    }, {} as Record<string, boolean>)

  const numberOfUsersOpeningApp = Object.keys(usersOpeningApp).length

  // new attraction swipes
  const newAttractionSwipesToday = await getAllAttractionSwipesPastDay()
  const newAttractionSwipesTodayLength = newAttractionSwipesToday?.length ?? 0
  console.log(`New swipes today: ${newAttractionSwipesTodayLength}`)
  const newAttractionSwipesByAuthorId = newAttractionSwipesToday.reduce(
    (acc: Record<string, { swipeCount: number; username: string; name: string; email: string }>, swipe) => {
      if (swipe?.userId) {
        return {
          ...acc,
          [swipe.userId]: {
            swipeCount: (acc[swipe.userId]?.swipeCount ?? 0) + 1,
            username: swipe.user?.username ?? '',
            name: swipe.user?.name ?? '',
            email: swipe.user?.email ?? '',
          },
        }
      } else {
        return acc
      }
    },
    {} as Record<string, { swipeCount: number; username: string; name: string; email: string }>,
  )

  const newAttractionSwipesByDestinationId = newAttractionSwipesToday.reduce(
    (acc: Record<string, { destinationName: string; swipeCount: number }>, swipe) => {
      if (swipe?.destinationId) {
        return {
          ...acc,
          [swipe.destinationId]: {
            destinationName: swipe.destination?.name ?? '',
            swipeCount: (acc[swipe.destinationId]?.swipeCount ?? 0) + 1,
          },
        }
      } else {
        return acc
      }
    },
    {} as Record<string, { destinationName: string; swipeCount: number }>,
  )

  const newAttractionSwipesCsv = Object.entries(newAttractionSwipesByAuthorId)
    .map(([id, { swipeCount, username, name, email }]) => `${id},${username},${name},${email},${swipeCount}`)
    .join('\n')
  const newAttractionSwipesByDestinationCsv = Object.entries(newAttractionSwipesByDestinationId)
    .map(([id, { destinationName, swipeCount }]) => `${id},${destinationName},${swipeCount}`)
    .join('\n')

  // new attractions created
  const newAttractionsCreatedToday = await getAllAttractionsCreatedPastDay()

  const newAttractionsCreatedTodayLength = newAttractionsCreatedToday?.length ?? 0
  console.log(`New attractions created today: ${newAttractionsCreatedTodayLength}`)

  const adminAttractions = newAttractionsCreatedToday.filter(
    (attraction) => attraction?.authorType === AUTHOR_TYPE.ADMIN,
  )
  const userAttractions = newAttractionsCreatedToday.filter((attraction) => attraction?.authorType === AUTHOR_TYPE.USER)
  // assemble dictionary of authorIds to number of attractions created from userAttractions
  const userAttractionsByAuthorId = userAttractions.reduce(
    (acc: Record<string, { count: number; username: string; name: string; email: string }>, attraction) => {
      if (attraction?.authorId) {
        return {
          ...acc,
          [attraction.authorId]: {
            count: (acc[attraction.authorId]?.count ?? 0) + 1,
            username: attraction.author?.username ?? '',
            name: attraction.author?.name ?? '',
            email: attraction.author?.email ?? '',
          },
        }
      } else {
        return acc
      }
    },
    {} as Record<string, { count: number; username: string; name: string; email: string }>,
  )

  // assemble a dictionary of destinationIds to number of attractions created, one col for userAttractions and one col for adminAttractions. So like: destinationId, userAttractions, adminAttractions
  const destinationIdsToAttractionsCreated = newAttractionsCreatedToday.reduce(
    (
      acc: Record<string, { destinationName: string; userAttractions: number; adminAttractions: number }>,
      attraction,
    ) => {
      if (attraction?.destinationId) {
        const { userAttractions, adminAttractions } = acc[attraction.destinationId] ?? {
          destinationName: attraction.destination?.name ?? '',
          userAttractions: 0,
          adminAttractions: 0,
        }
        if (attraction.authorType === AUTHOR_TYPE.USER) {
          return {
            ...acc,
            [attraction.destinationId]: {
              destinationName: attraction.destination?.name ?? '',
              userAttractions: userAttractions + 1,
              adminAttractions,
            },
          }
        } else {
          return {
            ...acc,
            [attraction.destinationId]: {
              destinationName: attraction.destination?.name ?? '',
              userAttractions,
              adminAttractions: adminAttractions + 1,
            },
          }
        }
      } else {
        return acc
      }
    },
    {} as Record<string, { destinationName: string; userAttractions: number; adminAttractions: number }>,
  )

  const attractionsCreatedByUserCsv = Object.entries(userAttractionsByAuthorId)
    .map(([id, { count, username, name, email }]) => `${id},${username},${name},${email},${count}`)
    .join('\n')
  const attractionsCreatedByDestinationCsv = Object.entries(destinationIdsToAttractionsCreated)
    .map(
      ([id, { destinationName, userAttractions, adminAttractions }]) =>
        `${id},${destinationName},${userAttractions},${adminAttractions}`,
    )
    .join('\n')

  // new itinerary views
  const tripDestinationUserViewingItineraryInPastDay = await getAllItineraryViewsPastDay()
  const tripDestinationUserViewingItineraryInPastDayLength = tripDestinationUserViewingItineraryInPastDay?.length ?? 0

  const itineraryFirstTimeViewsCsv = tripDestinationUserViewingItineraryInPastDay
    .map(
      (user) =>
        `${user?.userId},${user?.user?.username},${user?.user?.name}, ${user?.user?.email},${user?.tripId},${user?.destinationId},${user?.destination?.name},${user?.tripPlanViewedAt}`,
    )
    .join('\n')

  // assemble message
  const message = `Metrics Report for ${formattedDate}:\n- New Users: ${newUsersTodayLength}\n- App sessions: ${userSessionsTodayLength} sessions from ${numberOfUsersOpeningApp} different users\n- New Swipes: ${newAttractionSwipesTodayLength} swipes from ${
    Object.keys(newAttractionSwipesByAuthorId)?.length ?? 0
  } different users\n- New Attractions (Admin): ${adminAttractions.length}\n- New Attractions (User): ${
    userAttractions.length
  } attractions from ${
    Object.keys(userAttractionsByAuthorId)?.length ?? 0
  } different users\n- Users who viewed a new itinerary: ${tripDestinationUserViewingItineraryInPastDayLength}\n--------------------------------------------------------------------------------------------------------------------------------------------------\n`

  // Send Slack message
  await sendSlackMessage({
    text: message,
    newUsersCsv,
    userSessionsCsv,
    newAttractionSwipesCsv,
    newAttractionSwipesByDestinationCsv,
    attractionsCreatedByDestinationCsv,
    attractionsCreatedByUserCsv,
    itineraryFirstTimeViewsCsv,
  })

  console.log('Finished key metrics report function')
}
