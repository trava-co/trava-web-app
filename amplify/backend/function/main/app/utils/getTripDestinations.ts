import { LambdaGetTripDestinationsQuery, LambdaGetTripDestinationsQueryVariables } from 'shared-types/API'
import { lambdaGetTripDestinations } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'

async function getTripDestinations(variables: LambdaGetTripDestinationsQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetTripDestinationsQueryVariables, LambdaGetTripDestinationsQuery>({
    query: lambdaGetTripDestinations,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser?.userTrips?.items?.[0]?.trip?.tripDestinations?.items || []
}

export default getTripDestinations
