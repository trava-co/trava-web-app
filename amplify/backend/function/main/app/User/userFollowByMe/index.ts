import { AppSyncResolverHandler } from 'aws-lambda'
import { GetUserFollowQueryVariables, User, UserFollow } from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'

const getUserFollow = /* GraphQL */ `
  query GetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
    }
  }
`

type GetUserFollowQuery = {
  getUserFollow?: {
    __typename: 'UserFollow'
    userId: string
    followedUserId: string
    approved: boolean
    createdAt: string
    updatedAt: string
  } | null
}

async function get(variables: GetUserFollowQueryVariables) {
  const res = await ApiClient.get().apiFetch<GetUserFollowQueryVariables, GetUserFollowQuery>({
    query: getUserFollow,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUserFollow
}

const userFollowByMe: AppSyncResolverHandler<{}, UserFollow | null | undefined, User> = async (event) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (event.identity && 'sub' in event.identity) {
    const myUserId = event.identity.sub

    return await get({
      userId: myUserId,
      followedUserId: event.source.id,
    })
  }

  return null
}

export default userFollowByMe
