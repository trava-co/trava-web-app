import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  LambdaHomeTabsFeedGetFollowingUsersQuery,
  LambdaHomeTabsFeedGetFollowingUsersQueryVariables,
} from 'shared-types/API'
import { lambdaHomeTabsFeedGetFollowingUsers } from 'shared-types/graphql/lambda'

const getFollowsIds = async (userId: string) => {
  const followsIds: string[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaHomeTabsFeedGetFollowingUsersQueryVariables,
        LambdaHomeTabsFeedGetFollowingUsersQuery
      >({
        query: lambdaHomeTabsFeedGetFollowingUsers,
        variables: {
          id: userId,
          followsNextToken: nextToken,
          followsLimit: 50,
        },
      })

      return {
        nextToken: res.data.getUser?.follows?.nextToken,
        data: res.data.getUser?.follows?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (item?.followedUserId && item?.approved) followsIds.push(item.followedUserId)
      })
    },
  )

  return followsIds
}

export default getFollowsIds
