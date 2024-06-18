import { CreatePostMutationVariables } from 'shared-types/API'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CUSTOM_NOT_AUTHORIZED_CREATE_DESTINATION_MESSAGE,
  CUSTOM_NOT_AUTHORIZED_CREATE_POST_MESSAGE,
} from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkTripAccessCreate = async (event: AppSyncResolverEvent<CreatePostMutationVariables>) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_DESTINATION_MESSAGE)
  }

  const res = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_POST_MESSAGE)
  }

  return null
}

export default checkTripAccessCreate
