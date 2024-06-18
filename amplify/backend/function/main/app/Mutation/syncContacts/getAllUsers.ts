import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { LambdaListUsersQuery, LambdaListUsersQueryVariables, SearchUser } from 'shared-types/API'
import { lambdaListUsers } from 'shared-types/graphql/lambda'
import { USER_DELETED_STRING } from '../../utils/constants'

const getAllUsers = async (userId: string) => {
  const users: SearchUser[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListUsersQueryVariables, LambdaListUsersQuery>({
        query: lambdaListUsers,
        variables: {
          nextToken,
          limit: 1000,
          filter: {
            id: {
              ne: userId,
            },
            name: {
              ne: USER_DELETED_STRING,
            },
          },
        },
      })

      return {
        nextToken: res.data.listUsers?.nextToken,
        data: res.data.listUsers?.items,
      }
    },
    (data) => {
      data?.forEach((user) => {
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
    },
  )

  return users
}

export default getAllUsers
