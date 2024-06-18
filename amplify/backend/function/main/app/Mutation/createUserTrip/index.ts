import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateUserTripMutationVariables,
  LambdaPrivateCreateUserTripMutation,
  LambdaPrivateCreateUserTripMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createNotification from './after/createNotification'
import checkUserTripAccessCreate from './before/checkUserTripAccessCreate'
import createTripDestinationUser from './after/createTripDestinationUser'
import { lambdaPrivateCreateUserTrip } from 'shared-types/graphql/lambda'

const beforeHooks = [checkUserTripAccessCreate]

const afterHooks = [createNotification, createTripDestinationUser]

async function _privateCreateUserTrip(variables: CreateUserTripMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateCreateUserTripMutationVariables,
    LambdaPrivateCreateUserTripMutation
  >({
    query: lambdaPrivateCreateUserTrip,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateUserTrip
}

const createUserTrip: AppSyncResolverHandler<CreateUserTripMutationVariables, any> = async (event, ...args) => {
  console.log('createUserTrip')
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

  const userTrip = await _privateCreateUserTrip(event.arguments)

  if (!userTrip) {
    throw new Error('Failed to create userTrip')
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

export default createUserTrip
