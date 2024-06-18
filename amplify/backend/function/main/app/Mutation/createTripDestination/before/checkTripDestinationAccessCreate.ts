import { AppSyncResolverHandler } from 'aws-lambda'
import { CreateTripDestinationMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkTripDestinationAccessCreate: AppSyncResolverHandler<CreateTripDestinationMutationVariables, null> = async (
  event,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can create (example: add destination)
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_MESSAGE)
  }

  const res = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_MESSAGE)
  }

  return null
}

export default checkTripDestinationAccessCreate
