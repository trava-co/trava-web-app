import { AppSyncResolverHandler } from 'aws-lambda'
import { DeleteUserTripMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_USER_TRIP_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkUserTripAccessDelete: AppSyncResolverHandler<DeleteUserTripMutationVariables, null> = async (
  event,
  context,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can delete own and other UserTrip
  if (event.identity && 'sub' in event.identity) {
    const res = await getUserTrips({
      tripId: event.arguments.input.tripId,
      userId: event.identity.sub,
    })

    if (!res.length) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_USER_TRIP_MESSAGE)
    }
  }

  return null
}

export default checkUserTripAccessDelete
