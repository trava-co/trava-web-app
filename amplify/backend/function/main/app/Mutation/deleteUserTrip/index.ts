import { AppSyncResolverHandler } from 'aws-lambda'
import {
  DeleteUserTripMutationVariables,
  LambdaPrivateDeleteUserTripMutation,
  LambdaPrivateDeleteUserTripMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkUserTripAccessDelete from './before/checkUserTripAccessDelete'
import deleteAttractionSwipes from './before/deleteAttractionSwipes'
import deleteTripDestinationUser from './before/deleteTripDestinationUser'
import deleteUserFromTripTimelineEntries from './before/deleteUserFromTripTimelineEntries'
import { lambdaPrivateDeleteUserTrip } from 'shared-types/graphql/lambda'

const asyncBeforeHooks = [checkUserTripAccessDelete]

const syncBeforeHooks = [deleteAttractionSwipes, deleteTripDestinationUser, deleteUserFromTripTimelineEntries]

async function _privateDeleteUserTrip(variables: DeleteUserTripMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateDeleteUserTripMutationVariables,
    LambdaPrivateDeleteUserTripMutation
  >({
    query: lambdaPrivateDeleteUserTrip,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateDeleteUserTrip
}

const deleteUserTrip: AppSyncResolverHandler<DeleteUserTripMutationVariables, any> = async (event, ...args) => {
  console.log('deleteUserTrip')
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

  const userTrip = await _privateDeleteUserTrip(event.arguments)

  if (!userTrip) {
    throw new Error('Failed to delete userTrip')
  }

  return userTrip

  /**
   * after hooks
   */
  // none
}

export default deleteUserTrip
