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

const getAllAttractionSwipesPastDay = async () => {
  const result = await ApiClient.get().apiFetch<
    LambdaPrivateListAttractionSwipesByUpdatedAtQueryVariables,
    LambdaPrivateListAttractionSwipesByUpdatedAtQuery
  >({
    query: lambdaPrivateListAttractionSwipesByUpdatedAt,
    variables: {
      label: AttractionSwipeLabel.SWIPE,
      updatedAt: { ge: yesterday() },
    },
  })

  console.log(`result: ${JSON.stringify(result, null, 2)}\n`)

  return result.data?.privateListAttractionSwipesByUpdatedAt?.items ?? []
}

// attractions created
const getAllAttractionsCreatedPastDay = async () => {
  console.log(`getting all attractions created in past day`)
  const result = await ApiClient.get().apiFetch<
    LambdaPrivateListAttractionsByCreatedAtQueryVariables,
    LambdaPrivateListAttractionsByCreatedAtQuery
  >({
    query: lambdaPrivateListAttractionsByCreatedAt,
    variables: {
      label: AttractionLabel.ATTRACTION,
      createdAt: { ge: yesterday() },
    },
  })

  console.log(`result: ${JSON.stringify(result, null, 2)}\n`)

  return result.data?.privateListAttractionsByCreatedAt?.items ?? []
}

// itineraries viewed in past 24 hours
// get all trip destination users with tripPlanViewwedAt > 24 hours ago
const getAllItineraryViewsPastDay = async () => {
  console.log(`yesterday: ${yesterday()}`)
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

  console.log(`result: ${JSON.stringify(itineraries, null, 2)}\n`)
  return itineraries
}

const getAllAppSessionsPastDay = async () => {
  const result = await ApiClient.get().apiFetch<
    LambdaPrivateListUserSessionsByCreatedAtQueryVariables,
    LambdaPrivateListUserSessionsByCreatedAtQuery
  >({
    query: lambdaPrivateListUserSessionsByCreatedAt,
    variables: {
      label: UserSessionLabel.SESSION,
      createdAt: { ge: yesterday() },
    },
  })

  console.log(`result: ${JSON.stringify(result, null, 2)}\n`)

  return result.data?.privateListUserSessionsByCreatedAt?.items ?? []
}

export {
  getAllUsersPastDay,
  getAllAttractionSwipesPastDay,
  getAllAttractionsCreatedPastDay,
  getAllItineraryViewsPastDay,
  getAllAppSessionsPastDay,
}
