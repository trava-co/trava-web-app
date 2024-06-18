import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaPrivateUpdateUserTripMutation,
  LambdaPrivateUpdateUserTripMutationVariables,
  UpdateUserTripMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createNotification from './after/createNotification'
import checkUserTripAccessUpdate from './before/checkUserTripAccessUpdate'
import { lambdaPrivateUpdateUserTrip } from 'shared-types/graphql/lambda'

const beforeHooks = [checkUserTripAccessUpdate]

const afterHooks = [createNotification]

async function _privateUpdateUserTrip(variables: UpdateUserTripMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateUpdateUserTripMutationVariables,
    LambdaPrivateUpdateUserTripMutation
  >({
    query: lambdaPrivateUpdateUserTrip,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateUserTrip
}

const updateUserTrip: AppSyncResolverHandler<UpdateUserTripMutationVariables, any> = async (event, ...args) => {
  console.log('updateUserTrip')
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

  const userTrip = await _privateUpdateUserTrip(event.arguments)

  if (!userTrip) {
    throw new Error('Failed to update userTrip')
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event, userTrip)
    }),
  )

  return userTrip
}

export default updateUserTrip
