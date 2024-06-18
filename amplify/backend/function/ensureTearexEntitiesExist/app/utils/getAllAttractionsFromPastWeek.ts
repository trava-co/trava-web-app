import { Attraction, LambdaListAttractionsQuery, LambdaListAttractionsQueryVariables } from 'shared-types/API'
import ApiClient from './ApiClient'
import getAllPaginatedData from './getAllPaginatedData'
import { lambdaListAttractions } from 'shared-types/graphql/lambda'

const LIMIT = 500

const oneWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

async function getAllAttractionsFromPastWeek() {
  const attractions: Attraction[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListAttractionsQueryVariables, LambdaListAttractionsQuery>({
        query: lambdaListAttractions,
        variables: {
          filter: {
            deletedAt: { notContains: '' },
            createdAt: { ge: oneWeekAgo() },
          },
          limit: LIMIT,
          nextToken: nextToken,
        },
      })

      return {
        nextToken: res.data.listAttractions?.nextToken,
        data: res.data.listAttractions?.items,
      }
    },
    (data) => {
      if (!data) return

      data.forEach((item) => {
        if (!item) return
        attractions.push(item)
      })
    },
  )

  return attractions
}

export default getAllAttractionsFromPastWeek
