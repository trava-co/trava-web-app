import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateTripDestinationMutationVariables,
  LambdaPrivateCreateTripDestinationMutation,
  LambdaPrivateCreateTripDestinationMutationVariables,
} from 'shared-types/API'
import { lambdaPrivateCreateTripDestination } from 'shared-types/graphql/lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkTripDestinationAccessCreate from './before/checkTripDestinationAccessCreate'
import createTripDestinationUsers from './after/createTripDestinationUsers'

const beforeHooks = [checkTripDestinationAccessCreate]
const afterHooks = [createTripDestinationUsers]

async function _privateCreateTripDestination(variables: LambdaPrivateCreateTripDestinationMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateCreateTripDestinationMutationVariables,
    LambdaPrivateCreateTripDestinationMutation
  >({
    query: lambdaPrivateCreateTripDestination,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateTripDestination
}

const createTripDestination: AppSyncResolverHandler<CreateTripDestinationMutationVariables, any> = async (
  event,
  ...args
) => {
  console.log('createTripDestination')
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

  const tripDestination = await _privateCreateTripDestination(event.arguments)

  if (!tripDestination) {
    throw new Error('Failed to create tripDestination')
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event)
    }),
  )

  return tripDestination
}

export default createTripDestination
