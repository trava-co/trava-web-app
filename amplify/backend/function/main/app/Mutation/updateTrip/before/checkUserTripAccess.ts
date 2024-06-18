import { AppSyncResolverHandler } from 'aws-lambda'
import { UpdateTripMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_TRIP_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkUserTripAccess: AppSyncResolverHandler<UpdateTripMutationVariables, null> = async (event, context) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (event.identity && 'sub' in event.identity) {
    const res = await getUserTrips({
      tripId: event.arguments.input.id,
      userId: event.identity.sub,
    })

    if (!res.length) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TRIP_MESSAGE)
    }
  }

  return null
}

export default checkUserTripAccess
