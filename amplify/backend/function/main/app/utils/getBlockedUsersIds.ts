import {
  LambdaListBlockedByByUserQuery,
  LambdaListBlockedByByUserQueryVariables,
  LambdaListBlocksByUserQuery,
  LambdaListBlocksByUserQueryVariables,
} from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import getAllPaginatedData from './getAllPaginatedData'
import { lambdaListBlockedByByUser, lambdaListBlocksByUser } from 'shared-types/graphql/lambda'

const getBlockedUsersIds = async (
  userId: string,
): Promise<{
  blockedByIds: string[]
  blocksIds: string[]
}> => {
  const blockedByIds: string[] = []
  const blocksIds: string[] = []

  // userBlock.blockedBy
  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaListBlockedByByUserQueryVariables,
        LambdaListBlockedByByUserQuery
      >({
        query: lambdaListBlockedByByUser,
        variables: {
          userId,
          nextToken,
          limit: 50,
        },
      })

      return {
        nextToken: res.data.getUser?.blockedBy?.nextToken,
        data: res.data.getUser?.blockedBy?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (item?.userId) blockedByIds.push(item.userId)
      })
    },
  )

  // userBlock.blocks
  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListBlocksByUserQueryVariables, LambdaListBlocksByUserQuery>({
        query: lambdaListBlocksByUser,
        variables: {
          userId,
          nextToken,
          limit: 50,
        },
      })

      return {
        nextToken: res.data.getUser?.blocks?.nextToken,
        data: res.data.getUser?.blocks?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (item?.blockedUserId) blocksIds.push(item.blockedUserId)
      })
    },
  )

  return {
    blockedByIds,
    blocksIds,
  }
}

export default getBlockedUsersIds
