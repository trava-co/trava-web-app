import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaPrivateUpdateUserMutation,
  LambdaPrivateUpdateUserMutationVariables,
  UpdateUserMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import acceptPendingFollowRequests from './after/acceptPendingFollowRequests'
import { lambdaPrivateUpdateUser } from 'shared-types/graphql/lambda'
import updateNotifications from './after/updateNotifications'

const afterHooks = [acceptPendingFollowRequests, updateNotifications]

async function _privateUpdateUser(variables: LambdaPrivateUpdateUserMutationVariables) {
  const res = await ApiClient.get().apiFetch<LambdaPrivateUpdateUserMutationVariables, LambdaPrivateUpdateUserMutation>(
    {
      query: lambdaPrivateUpdateUser,
      variables,
    },
  )

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateUser
}

const updateUser: AppSyncResolverHandler<UpdateUserMutationVariables, any> = async (event, ...args) => {
  console.log('updateUser')
  /**
   * before hooks
   */
  // none

  /**
   * Main query
   */

  const user = await _privateUpdateUser(event.arguments)

  if (!user) {
    throw new Error('Failed to update user')
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event, user)
    }),
  )

  return user
}

export default updateUser
