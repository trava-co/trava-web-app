import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateTripMutationVariables,
  LambdaCustomPrivateCreateTripMutation,
  LambdaCustomPrivateCreateTripMutationVariables,
} from 'shared-types/API'
import { lambdaCustomPrivateCreateTrip } from 'shared-types/graphql/lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createTripDestinations from './after/createTripDestinations'
import createUserTrips from './after/createUserTrips'

const syncAfterHooks = [createUserTrips, createTripDestinations]

async function _privateCreateTrip(variables: CreateTripMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaCustomPrivateCreateTripMutationVariables,
    LambdaCustomPrivateCreateTripMutation
  >({
    query: lambdaCustomPrivateCreateTrip,
    variables: {
      input: {
        id: variables.input.id,
        link: variables.input.link, // admin's invite link, continue to store due to precedent
        name: variables.input.name,
      },
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateTrip
}

const createTrip: AppSyncResolverHandler<CreateTripMutationVariables, any> = async (event) => {
  console.log('createTrip')
  /**
   * before hooks
   */
  // none

  /**
   * Main query
   */
  const trip = await _privateCreateTrip(event.arguments)

  if (!trip) {
    throw new Error('Failed to create trip')
  }

  /**
   * sync after
   */
  for (const hook of syncAfterHooks) {
    console.log(`Running sync after hook: "${hook.name}"`)
    await hook(event, trip)
  }

  return trip
}

export default createTrip
