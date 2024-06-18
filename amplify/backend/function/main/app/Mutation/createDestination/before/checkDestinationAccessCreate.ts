import { CreateDestinationMutationVariables } from 'shared-types/API'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { checkForGroup } from '../../../utils/checkForGroup'
import {
  CUSTOM_NOT_AUTHORIZED_CREATE_DESTINATION_MESSAGE,
  CUSTOM_CREATE_DESTINATION_INVALID_INPUT,
  CUSTOM_CREATE_DESTINATION_ALREADY_EXISTS,
} from 'shared-types/lambdaErrors'
import getDestinationsByRequestingUser from '../../../utils/getDestinationsByRequestingUser'

const checkDestinationAccessCreate = async (event: AppSyncResolverEvent<CreateDestinationMutationVariables>) => {
  if (checkForGroup(event, 'admin')) return null

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_DESTINATION_MESSAGE)
  }

  // check if user creates a destination with proper isTravaCreated flag (currently must be set to 0)
  if (event.arguments.input.isTravaCreated !== 0) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_DESTINATION_MESSAGE)
  }

  // check if input has googlePlaceId
  if (!event.arguments.input.googlePlaceId) {
    throw new Error(CUSTOM_CREATE_DESTINATION_INVALID_INPUT)
  }

  // check if user already has access to this destination
  const destinations = await getDestinationsByRequestingUser(event.identity.sub)
  const existingDestination = destinations.find(
    (destination) => destination.googlePlaceId === event.arguments.input.googlePlaceId,
  )
  if (existingDestination) {
    throw new Error(CUSTOM_CREATE_DESTINATION_ALREADY_EXISTS)
  }

  return null
}

export default checkDestinationAccessCreate
