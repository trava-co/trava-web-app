import { LambdaGetTripDestinationQuery, LambdaGetTripDestinationQueryVariables } from 'shared-types/API'
import { lambdaGetTripDestination } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'

async function getTripDestination(variables: LambdaGetTripDestinationQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetTripDestinationQueryVariables, LambdaGetTripDestinationQuery>({
    query: lambdaGetTripDestination,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser?.userTrips?.items?.[0]?.trip?.tripDestinations?.items || []
}

export default getTripDestination
