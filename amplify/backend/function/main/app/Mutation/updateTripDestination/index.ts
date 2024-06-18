import { AppSyncResolverHandler } from 'aws-lambda'
import {
  PrivateUpdateTripDestinationMutation,
  PrivateUpdateTripDestinationMutationVariables,
  UpdateTripDestinationMutationVariables,
} from 'shared-types/API'
import { privateUpdateTripDestination } from 'shared-types/graphql/mutations'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkTripDestinationAccessUpdate from './before/checkTripDestinationAccessUpdate'

const beforeHooks = [checkTripDestinationAccessUpdate]

async function _privateUpdateTripDestination(variables: UpdateTripDestinationMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    PrivateUpdateTripDestinationMutationVariables,
    PrivateUpdateTripDestinationMutation
  >({
    query: privateUpdateTripDestination,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateTripDestination
}

const updateTripDestination: AppSyncResolverHandler<UpdateTripDestinationMutationVariables, any> = async (
  event,
  ...args
) => {
  console.log('updateTripDestination')
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

  const tripDestination = await _privateUpdateTripDestination(event.arguments)

  if (!tripDestination) {
    throw new Error('Failed to update tripDestination')
  }

  return tripDestination

  /**
   * after hooks
   */
  // none
}

export default updateTripDestination
