import { LambdaGetUserTripsQuery, LambdaGetUserTripsQueryVariables } from 'shared-types/API'
import { lambdaGetUserTrips } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'

async function getUserTrips(variables: LambdaGetUserTripsQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetUserTripsQueryVariables, LambdaGetUserTripsQuery>({
    query: lambdaGetUserTrips,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser?.userTrips?.items?.[0]?.trip?.members?.items || []
}

export default getUserTrips
