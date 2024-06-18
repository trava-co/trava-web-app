import { LambdaGetUserAttractionSwipesQuery, LambdaGetUserAttractionSwipesQueryVariables } from 'shared-types/API'
import { lambdaGetUserAttractionSwipes } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'
import getAllPaginatedData from './getAllPaginatedData'

const ATTRACTION_SWIPES_BY_USER_LIMIT = 20

async function getUserAttractionSwipes(variables: LambdaGetUserAttractionSwipesQueryVariables) {
  const attractionIds: string[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaGetUserAttractionSwipesQueryVariables,
        LambdaGetUserAttractionSwipesQuery
      >({
        query: lambdaGetUserAttractionSwipes,
        variables: {
          ...variables,
          attractionSwipesByUserLimit: ATTRACTION_SWIPES_BY_USER_LIMIT,
          attractionSwipesByUserNextToken: nextToken,
        },
      })

      return {
        nextToken: res.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipesByUser?.nextToken,
        data: res.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipesByUser?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (item?.attractionId) attractionIds.push(item.attractionId)
      })
    },
  )

  return attractionIds
}

export default getUserAttractionSwipes
