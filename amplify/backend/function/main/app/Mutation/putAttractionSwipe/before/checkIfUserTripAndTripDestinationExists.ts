import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { PutAttractionSwipeMutationVariables } from 'shared-types/API'
import getTripDestination from '../../../utils/getTripDestination'
import { CUSTOM_NOT_AUTHORIZED_PUT_ATTRACTION_SWIPE_MESSAGE } from 'shared-types/lambdaErrors'

const checkIfUserTripAndTripDestinationExists: AppSyncResolverHandler<
  PutAttractionSwipeMutationVariables,
  null
> = async (event) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can create (example: add members)
  if (event.identity && 'sub' in event.identity) {
    const res = await getTripDestination({
      tripId: event.arguments.input.tripId,
      userId: event.identity.sub,
      destinationId: event.arguments.input.destinationId,
    })

    if (!res.length) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_PUT_ATTRACTION_SWIPE_MESSAGE)
    }
  }

  return null
}

export default checkIfUserTripAndTripDestinationExists
