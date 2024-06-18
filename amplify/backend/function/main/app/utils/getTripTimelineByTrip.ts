import { LambdaGetTripTimelineByTripQuery, LambdaGetTripTimelineByTripQueryVariables } from 'shared-types/API'
import { lambdaGetTripTimelineByTrip } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'

async function getTripTimelineByTrip(variables: LambdaGetTripTimelineByTripQueryVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaGetTripTimelineByTripQueryVariables,
    LambdaGetTripTimelineByTripQuery
  >({
    query: lambdaGetTripTimelineByTrip,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser?.userTrips?.items?.[0]?.trip?.timelineEntries?.items || []
}

export default getTripTimelineByTrip
