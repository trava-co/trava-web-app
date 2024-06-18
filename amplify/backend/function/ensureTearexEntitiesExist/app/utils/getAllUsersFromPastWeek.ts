import { User, ListUsersQuery, ListUsersQueryVariables } from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import { listUsers } from 'shared-types/graphql/queries'
import ApiClient from './ApiClient'

const LIMIT = 500

const oneWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

export default async () => {
  const users: Pick<User, 'id'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<ListUsersQueryVariables, ListUsersQuery>({
        query: listUsers,
        variables: {
          nextToken,
          filter: {
            createdAt: { ge: oneWeekAgo() },
          },
          limit: LIMIT,
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
