import { AppSyncResolverHandler } from 'aws-lambda'
import {
  DeleteTripDestinationMutationVariables,
  PrivateDeleteTripDestinationMutation,
  PrivateDeleteTripDestinationMutationVariables,
} from 'shared-types/API'
import { privateDeleteTripDestination } from 'shared-types/graphql/mutations'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkTripDestinationAccessDelete from './before/checkTripDestinationAccessDelete'
import deleteAttractionSwipes from './before/deleteAttractionSwipes'
import deleteTripDestinationUsers from './before/deleteTripDestinationUsers'

const asyncBeforeHooks = [checkTripDestinationAccessDelete]

const syncBeforeHooks = [deleteAttractionSwipes, deleteTripDestinationUsers]

async function _privateDeleteTripDestination(variables: DeleteTripDestinationMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    PrivateDeleteTripDestinationMutationVariables,
    PrivateDeleteTripDestinationMutation
  >({
    query: privateDeleteTripDestination,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateDeleteTripDestination
}

const deleteTripDestination: AppSyncResolverHandler<DeleteTripDestinationMutationVariables, any> = async (
  event,
  ...args
) => {
  console.log('deleteTripDestination')
  /**
   * async before hooks
   */
  await Promise.all(
    asyncBeforeHooks.map((hook) => {
      console.log(`Running async before hook: "${hook.name}"`)
      return hook(event, ...args)
    }),
  )

  /**
   * sync before hooks
   */
  for (const hook of syncBeforeHooks) {
    console.log(`Running sync before hook: "${hook.name}"`)
    await hook(event, ...args)
  }

  /**
   * Main query
   */

  const tripDestination = await _privateDeleteTripDestination(event.arguments)

  if (!tripDestination) {
    throw new Error('Failed to delete tripDestination')
  }

  /**
   * after hooks
   */
  // none

  return tripDestination
}

export default deleteTripDestination
