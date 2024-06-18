import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateUserBlockMutationVariables,
  GetUserQueryVariables,
  LambdaGetUserQuery,
  LambdaGetUserQueryVariables,
  LambdaPrivateCreateUserBlockMutation,
  LambdaPrivateCreateUserBlockMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaGetUser, lambdaPrivateCreateUserBlock } from 'shared-types/graphql/lambda'
import removeFollowFromBlockedUser from './after/removeFollowFromBlockedUser'
import unfollowBlockedUser from './after/unfollowBlockedUser'

const afterHooks = [removeFollowFromBlockedUser, unfollowBlockedUser]

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

async function _privateCreateUserBlock(variables: LambdaPrivateCreateUserBlockMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateCreateUserBlockMutationVariables,
    LambdaPrivateCreateUserBlockMutation
  >({
    query: lambdaPrivateCreateUserBlock,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateUserBlock
}

const createUserBlock: AppSyncResolverHandler<CreateUserBlockMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */

  // none

  /**
   * Main query
   */

  const userToBeBlocked = await _getUser({
    id: event.arguments.input.blockedUserId,
  })

  if (!userToBeBlocked) {
    throw new Error(
      `Failed to create userBlock. Provided blockUserId ${event.arguments.input.blockedUserId} does not belong to any user.`,
    )
  }

  const userBlock = await _privateCreateUserBlock({
    input: event.arguments.input,
  })

  if (!userBlock) {
    throw new Error(`Failed to create userBlock. blockedUserId: ${event.arguments.input.blockedUserId}`)
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event, userBlock)
    }),
  )

  return userBlock
}

export default createUserBlock
