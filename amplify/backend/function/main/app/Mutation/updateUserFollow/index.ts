import { AppSyncResolverHandler } from 'aws-lambda'
import {
  GetUserQueryVariables,
  LambdaGetUserQuery,
  LambdaGetUserQueryVariables,
  LambdaPrivateUpdateUserFollowMutation,
  LambdaPrivateUpdateUserFollowMutationVariables,
  UpdateUserFollowMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createNotification from './after/createNotification'
import checkIfUserIsAllowedToUpdateUserFollow from './before/checkIfUserIsAllowedToUpdateUserFollow'
import { lambdaGetUser, lambdaPrivateUpdateUserFollow } from 'shared-types/graphql/lambda'

const beforeHooks = [checkIfUserIsAllowedToUpdateUserFollow]
const afterHooks = [createNotification]

async function _getUser(variables: GetUserQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetUserQueryVariables, LambdaGetUserQuery>({
    query: lambdaGetUser,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser
}

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

const updateUserFollow: AppSyncResolverHandler<UpdateUserFollowMutationVariables, any> = async (event, ...args) => {
  /**
   * before hooks
   */
  await Promise.all(
    beforeHooks.map((hook) => {
      console.log(`Running before hook: "${hook.name}"`)
      return hook(event, ...args)
    }),
  )

  /**
   * Main query
   */

  const userFollow = await _privateUpdateUserFollow(event.arguments)

  if (!userFollow) {
    throw new Error('Failed to update userFollow')
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event, userFollow)
    }),
  )

  return userFollow
}

export default updateUserFollow
