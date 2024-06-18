import { AppSyncResolverHandler } from 'aws-lambda'
import { DeleteTripDestinationMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkTripDestinationAccessDelete: AppSyncResolverHandler<DeleteTripDestinationMutationVariables, null> = async (
  event,
  context,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can delete trip destinations that belongs to trip
  if (event.identity && 'sub' in event.identity) {
    const res = await getUserTrips({
      tripId: event.arguments.input.tripId,
      userId: event.identity.sub,
    })

    if (!res.length) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_MESSAGE)
    }
  }

  return null
}

export default checkTripDestinationAccessDelete
