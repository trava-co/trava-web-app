import { Post, LambdaPrivateListPostsQuery, LambdaPrivateListPostsQueryVariables } from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import { lambdaPrivateListPosts } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient'

const LIMIT = 500

const oneWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

export default async () => {
  const destinations: Pick<Post, 'id'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaPrivateListPostsQueryVariables, LambdaPrivateListPostsQuery>({
        query: lambdaPrivateListPosts,
        variables: {
          filter: {
            deletedAt: { notContains: '' },
            createdAt: { ge: oneWeekAgo() },
          },
          nextToken,
          limit: LIMIT,
        },
      })

      return {
        nextToken: res.data.privateListPosts?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.privateListPosts?.items.forEach((item) => {
        if (item) destinations.push(item)
      })
    },
  )

  return destinations
}
