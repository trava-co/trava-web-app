import { AppSyncResolverHandler } from 'aws-lambda'
import { UpdateTripDestinationMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_TRIP_DESTINATION_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkTripDestinationAccessUpdate: AppSyncResolverHandler<UpdateTripDestinationMutationVariables, null> = async (
  event,
  context,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can update trip destinations that belongs to trip
  if (event.identity && 'sub' in event.identity) {
    const res = await getUserTrips({
      tripId: event.arguments.input.tripId,
      userId: event.identity.sub,
    })

    if (!res.length) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TRIP_DESTINATION_MESSAGE)
    }
  }

  return null
}

export default checkTripDestinationAccessUpdate
