import { AppSyncResolverHandler } from 'aws-lambda'
import { UpdateUserTripMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_USER_TRIP_MESSAGE } from 'shared-types/lambdaErrors'

const checkUserTripAccessUpdate: AppSyncResolverHandler<UpdateUserTripMutationVariables, null> = async (
  event,
  context,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // If userId is equal sub - can update (example: change userTrip status: pending -> approved)

  if (event.identity && 'sub' in event.identity) {
    if (event.arguments.input.userId !== event.identity.sub) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_USER_TRIP_MESSAGE)
    }
  }

  return null
}

export default checkUserTripAccessUpdate
