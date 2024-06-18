import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaCustomPrivateUpdateTripMutation,
  LambdaCustomPrivateUpdateTripMutationVariables,
  UpdateTripMutationVariables,
} from 'shared-types/API'
import { lambdaCustomPrivateUpdateTrip } from 'shared-types/graphql/lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkUserTripAccess from './before/checkUserTripAccess'

const beforeHooks = [checkUserTripAccess]

async function _privateUpdateTrip(variables: UpdateTripMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaCustomPrivateUpdateTripMutationVariables,
    LambdaCustomPrivateUpdateTripMutation
  >({
    query: lambdaCustomPrivateUpdateTrip,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateTrip
}

const updateTrip: AppSyncResolverHandler<UpdateTripMutationVariables, any> = async (event, ...args) => {
  console.log('updateTrip')
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

  const trip = await _privateUpdateTrip(event.arguments)

  if (!trip) {
    throw new Error('Failed to update trip')
  }

  return trip

  /**
   * after hooks
   */
  // none
}

export default updateTrip
