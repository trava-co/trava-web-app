import { AppSyncResolverHandler } from 'aws-lambda'
import { CreateUserTripMutationVariables, LambdaGetTripIdQuery, LambdaGetTripIdQueryVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaGetTripId } from 'shared-types/graphql/lambda'

const checkUserTripAccessCreate: AppSyncResolverHandler<CreateUserTripMutationVariables, null> = async (event) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can create (example: add members)

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE)
  }

  // check if trip exists
  const getTrip = await ApiClient.get().apiFetch<LambdaGetTripIdQueryVariables, LambdaGetTripIdQuery>({
    query: lambdaGetTripId,
    variables: {
      tripId: event.arguments.input.tripId,
    },
  })

  const tripId = getTrip?.data?.privateGetTrip
  if (!tripId) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE)
  }

  // when users creates a usertrip for himself
  if (event.arguments.input.userId === event.identity.sub) {
    return null
  }

  // check if user can invite other to the trip
  const res = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE)
  }

  return null
}

export default checkUserTripAccessCreate
