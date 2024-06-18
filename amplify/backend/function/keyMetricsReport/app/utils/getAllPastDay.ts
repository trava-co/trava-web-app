import {
  User,
  LambdaListUsersQuery,
  LambdaListUsersQueryVariables,
  LambdaPrivateListAttractionSwipesByUpdatedAtQuery,
  LambdaPrivateListAttractionSwipesByUpdatedAtQueryVariables,
  AttractionSwipeLabel,
  LambdaPrivateListAttractionsByCreatedAtQuery,
  LambdaPrivateListAttractionsByCreatedAtQueryVariables,
  AttractionLabel,
  LambdaPrivateListTripDestinationUsersQuery,
  LambdaPrivateListTripDestinationUsersQueryVariables,
  TripDestinationUser,
  LambdaPrivateListUserSessionsByCreatedAtQuery,
  LambdaPrivateListUserSessionsByCreatedAtQueryVariables,
  UserSessionLabel,
  AUTHOR_TYPE,
  UserSession,
} from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import {
  lambdaListUsers,
  lambdaPrivateListAttractionSwipesByUpdatedAt,
  lambdaPrivateListAttractionsByCreatedAt,
  lambdaPrivateListTripDestinationUsers,
  lambdaPrivateListUserSessionsByCreatedAt,
} from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const tz = 'America/New_York'

// 24 hours ago from the current time, in eastern time, accounting for daylight savings period during year
const yesterday = () => {
  const date = dayjs().tz(tz).subtract(24, 'hour')
  return date.toISOString()
}

const getAllUsersPastDay = async () => {
  console.log(`getting all users created in past day`)
  const users: Pick<User, 'id' | 'username' | 'name' | 'email' | 'phone'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListUsersQueryVariables, LambdaListUsersQuery>({
        query: lambdaListUsers,
        variables: {
          nextToken,
          limit: 500,
          filter: {
            createdAt: { ge: yesterday() },
          },
        },
      })

      return {
        nextToken: res.data.listUsers?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.listUsers?.items.forEach((item) => {
        if (item) users.push(item)
      })
    },
  )

  return users
}

type Swipe = {
  userId: string
  user?: {
    username: string
    name: string
    email: string
  }
  destinationId: string
  destination: {
    name: string
  }
}

const getAllAttractionSwipesPastDay = async () => {
  console.log(`getting all attraction swipes in past day`)
  const attractionSwipes: Swipe[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListAttractionSwipesByUpdatedAtQueryVariables,
        LambdaPrivateListAttractionSwipesByUpdatedAtQuery
      >({
        query: lambdaPrivateListAttractionSwipesByUpdatedAt,
        variables: {
          nextToken,
          label: AttractionSwipeLabel.SWIPE,
          updatedAt: { ge: yesterday() },
          limit: 500,
        },
      })
      return {
        nextToken: res.data.privateListAttractionSwipesByUpdatedAt?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.privateListAttractionSwipesByUpdatedAt?.items.forEach((item) => {
        if (item) {
          attractionSwipes.push({
            userId: item.userId,
            user: {
              username: item.user?.username ?? '',
              name: item.user?.name ?? '',
              email: item.user?.email ?? '',
            },
            destinationId: item.destinationId,
            destination: {
              name: item.destination?.name ?? item.destinationId,
            },
          })
        }
      })
    },
  )

  console.log(`attractionSwipes length: ${attractionSwipes.length}\n`)

  return attractionSwipes
}

type AttractionCreated = {
  id: string
  name: string
  authorId: string | null | undefined
  author: {
    username: string
    name: string
    email: string
  }
  authorType: AUTHOR_TYPE
  destinationId: string
  destination: {
    name: string
  }
}

// attractions created
const getAllAttractionsCreatedPastDay = async () => {
  console.log(`getting all attractions created in past day`)
  const attractionsCreated: AttractionCreated[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const result = await ApiClient.get().apiFetch<
        LambdaPrivateListAttractionsByCreatedAtQueryVariables,
        LambdaPrivateListAttractionsByCreatedAtQuery
      >({
        query: lambdaPrivateListAttractionsByCreatedAt,
        variables: {
          nextToken,
          label: AttractionLabel.ATTRACTION,
          createdAt: { ge: yesterday() },
          limit: 500,
        },
      })
      return {
        nextToken: result.data.privateListAttractionsByCreatedAt?.nextToken,
        data: result.data,
      }
    },
    (data) => {
      data?.privateListAttractionsByCreatedAt?.items.forEach((item) => {
        if (item) {
          attractionsCreated.push({
            id: item.id,
            name: item.name,
            authorId: item.authorId,
            author: {
              username: item.author?.username ?? '',
              name: item.author?.name ?? '',
              email: item.author?.email ?? '',
            },
            authorType: item.authorType,
            destinationId: item.destinationId,
            destination: {
              name: item.destination?.name ?? item.destinationId,
            },
          })
        }
      })
    },
  )

  console.log(`attractions created length ${attractionsCreated.length} \n`)

  return attractionsCreated
}

// itineraries viewed in past 24 hours
// get all trip destination users with tripPlanViewwedAt > 24 hours ago
const getAllItineraryViewsPastDay = async () => {
  console.log(`getting all itinerary views in past day`)
  const itineraries: TripDestinationUser[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListTripDestinationUsersQueryVariables,
        LambdaPrivateListTripDestinationUsersQuery
      >({
        query: lambdaPrivateListTripDestinationUsers,
        variables: {
          nextToken,
          limit: 500,
          filter: {
            tripPlanViewedAt: { ge: yesterday() },
          },
        },
      })

      return {
        nextToken: res.data.privateListTripDestinationUsers?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.privateListTripDestinationUsers?.items.forEach((item: TripDestinationUser | null) => {
        if (item) itineraries.push(item)
      })
    },
  )

  console.log(`itinerary views: ${itineraries.length} \n`)
  return itineraries
}

const getAllAppSessionsPastDay = async () => {
  const sessions: UserSession[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListUserSessionsByCreatedAtQueryVariables,
        LambdaPrivateListUserSessionsByCreatedAtQuery
      >({
        query: lambdaPrivateListUserSessionsByCreatedAt,
        variables: {
          nextToken,
          label: UserSessionLabel.SESSION,
          createdAt: { ge: yesterday() },
          limit: 500,
        },
      })

      return {
        nextToken: res.data.privateListUserSessionsByCreatedAt?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.privateListUserSessionsByCreatedAt?.items.forEach((item) => {
        if (item) sessions.push(item)
      })
    },
  )

  console.log(`sessions: ${sessions.length} \n`)

  return sessions
}

export {
  getAllUsersPastDay,
  getAllAttractionSwipesPastDay,
  getAllAttractionsCreatedPastDay,
  getAllItineraryViewsPastDay,
  getAllAppSessionsPastDay,
}
