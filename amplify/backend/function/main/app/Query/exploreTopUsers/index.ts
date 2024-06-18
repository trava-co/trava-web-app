import { AppSyncResolverHandler } from 'aws-lambda'
import {
  ExploreTopUsersResponse,
  LambdaPrivateListUserAttractionsQuery,
  LambdaPrivateListUserAttractionsQueryVariables,
  LambdaCustomSearchUsersQuery,
  LambdaCustomSearchUsersQueryVariables,
  SearchUser,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaPrivateListUserAttractions, lambdaCustomSearchUsers } from 'shared-types/graphql/lambda'
import getAllPaginatedData from '../../utils/getAllPaginatedData'
import { USER_DELETED_STRING } from '../../utils/constants'

const oneWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

const exploreTopUsers: AppSyncResolverHandler<null, ExploreTopUsersResponse> = async () => {
  console.log('exploreTopUsers')
  ApiClient.get().useIamAuth()

  const userBucketListMap = new Map()

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListUserAttractionsQueryVariables,
        LambdaPrivateListUserAttractionsQuery
      >({
        query: lambdaPrivateListUserAttractions,
        variables: {
          nextToken,
          filter: {
            createdAt: { ge: oneWeekAgo() },
          },
        },
      })

      return {
        data: res.data?.privateListUserAttractions?.items,
        nextToken: res.data?.privateListUserAttractions?.nextToken,
      }
    },
    (data) => {
      data?.forEach((userAttraction) => {
        if (userAttraction?.authorId) {
          const count = userBucketListMap.get(userAttraction.authorId) || 0
          userBucketListMap.set(userAttraction.authorId, count + 1)
        }
      })
    },
  )

  const sortedUsers = Array.from(userBucketListMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const userIds = sortedUsers.map(([userId]) => userId)

  const users = await getUsersMatchingUserIds(userIds)

  const topUserItems = sortedUsers.map(([userId, bucketListsCollected]) => {
    const user = users.find((user) => user.id === userId)

    const topUserItem = {
      ...user,
      bucketListsCollected,
    } as SearchUser
    return topUserItem
  })

  return {
    __typename: 'ExploreTopUsersResponse',
    users: topUserItems,
  }
}

export const getUsersMatchingUserIds = async (userIds: string[]): Promise<SearchUser[]> => {
  const users: SearchUser[] = []

  if (userIds.length === 0) {
    return users
  }

  const res = await ApiClient.get().apiFetch<LambdaCustomSearchUsersQueryVariables, LambdaCustomSearchUsersQuery>({
    query: lambdaCustomSearchUsers,
    variables: {
      filter: {
        and: [
          {
            name: {
              ne: USER_DELETED_STRING,
            },
          },
          {
            or: [
              ...userIds.map((userId) => {
                return {
                  id: {
                    eq: userId,
                  },
                }
              }),
            ],
          },
        ],
      },
    },
  })

  res.data?.searchUsers?.items.forEach((user) => {
    if (user) {
      users.push({
        __typename: 'SearchUser',
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    }
  })

  return users
}

export default exploreTopUsers
