import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  LambdaGetUserFollowedByQuery,
  LambdaGetUserFollowedByQueryVariables,
  LambdaPrivateUpdateUserFollowMutation,
  LambdaPrivateUpdateUserFollowMutationVariables,
  PRIVACY,
  UpdateUserFollowMutationVariables,
  UpdateUserMutationVariables,
  User,
  UserFollow,
} from 'shared-types/API'
import getAllPaginatedData from '../../../utils/getAllPaginatedData'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaGetUserFollowedBy, lambdaPrivateUpdateUserFollow } from 'shared-types/graphql/lambda'
import chunk from 'lodash.chunk'

const CHUNK_SIZE = 25

async function _privateUpdateUserFollow(variables: UpdateUserFollowMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateUpdateUserFollowMutationVariables,
    LambdaPrivateUpdateUserFollowMutation
  >({
    query: lambdaPrivateUpdateUserFollow,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateUserFollow
}

async function _lambdaGetUserFollowedBy(variables: LambdaGetUserFollowedByQueryVariables) {
  const userFollows: UserFollow[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaGetUserFollowedByQueryVariables, LambdaGetUserFollowedByQuery>({
        query: lambdaGetUserFollowedBy,
        variables: {
          userId: variables.userId,
          followedByNextToken: nextToken,
        },
      })

      return {
        nextToken: res.data.getUser?.followedBy?.nextToken,
        data: res.data.getUser?.followedBy?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (!item) return

        userFollows.push(item)
      })
    },
  )

  return userFollows
}

const acceptPendingFollowRequests = async (event: AppSyncResolverEvent<UpdateUserMutationVariables>, user: User) => {
  console.log('event', event)

  // trigger only when a user sets privacy to PUBLIC
  if ('privacy' in event.arguments.input && event.arguments.input.privacy === PRIVACY.PUBLIC) {
    const userFollows = await _lambdaGetUserFollowedBy({ userId: user.id })

    const updateUserFollowPromises = userFollows
      .filter((userFollow) => !userFollow.approved)
      .map((userFollow) =>
        _privateUpdateUserFollow({
          input: {
            userId: userFollow.userId,
            followedUserId: userFollow.followedUserId,
            approved: true,
          },
        }),
      )

    const chunks = chunk(updateUserFollowPromises, CHUNK_SIZE)

    for (const chunkOfPromises of chunks) {
      await Promise.all(chunkOfPromises)
    }
  }

  return null
}

export default acceptPendingFollowRequests
