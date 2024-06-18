import { User, LambdaListUsersQuery, LambdaListUsersQueryVariables } from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import { lambdaListUsers } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const tz = 'America/New_York'

// today's date, starting at midnight eastern time, accounting for daylight savings period during year
const today = () => {
  const date = dayjs().tz(tz).startOf('day')
  return date.toISOString()
}

export default async () => {
  const users: Pick<User, 'id' | 'username'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListUsersQueryVariables, LambdaListUsersQuery>({
        query: lambdaListUsers,
        variables: {
          nextToken,
          limit: 500,
          filter: {
            createdAt: { ge: today() },
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
