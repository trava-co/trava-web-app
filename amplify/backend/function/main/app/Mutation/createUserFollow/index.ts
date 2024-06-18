import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateUserFollowMutationVariables,
  GetUserQueryVariables,
  LambdaGetUserQuery,
  LambdaGetUserQueryVariables,
  LambdaPrivateCreateUserFollowMutation,
  LambdaPrivateCreateUserFollowMutationVariables,
  PRIVACY,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createNotification from './after/createNotification'
import { lambdaGetUser, lambdaPrivateCreateUserFollow } from 'shared-types/graphql/lambda'
import checkIfUserNotBlocked from './before/checkIfUserNotBlocked'

const beforeHooks = [checkIfUserNotBlocked]
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

async function _privateCreateUserFollow(variables: CreateUserFollowMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateCreateUserFollowMutationVariables,
    LambdaPrivateCreateUserFollowMutation
  >({
    query: lambdaPrivateCreateUserFollow,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateUserFollow
}

const createUserFollow: AppSyncResolverHandler<CreateUserFollowMutationVariables, any> = async (event, ...args) => {
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

  const userToBeFollowed = await _getUser({
    id: event.arguments.input.followedUserId,
  })

  if (!userToBeFollowed) {
    throw new Error('Failed to create userFollow')
  }

  const argumentsInput = { ...event.arguments.input }

  if (userToBeFollowed.privacy === PRIVACY.PRIVATE) {
    argumentsInput.approved = false
  }

  const userFollow = await _privateCreateUserFollow({
    input: argumentsInput,
  })

  if (!userFollow) {
    throw new Error('Failed to create userFollow')
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

export default createUserFollow
