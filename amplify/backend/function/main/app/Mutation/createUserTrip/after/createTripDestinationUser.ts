import chunk from 'lodash.chunk'
import {
  CreateUserTripMutationVariables,
  LambdaPrivateCreateTripDestinationUserMutation,
  LambdaPrivateCreateTripDestinationUserMutationVariables,
  UserTrip,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_USER_MESSAGE } from 'shared-types/lambdaErrors'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import getTripDestinations from '../../../utils/getTripDestinations'
import { lambdaPrivateCreateTripDestinationUser } from 'shared-types/graphql/lambda'

const CHUNK_SIZE = 10

const createTripDestinationUser = async (
  event: AppSyncResolverEvent<CreateUserTripMutationVariables>,
  userTrip: UserTrip,
) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_USER_MESSAGE)
  }

  const tripDestinations = await getTripDestinations({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  const promises = tripDestinations.map((tripDestination) => {
    if (!tripDestination) return null
    return ApiClient.get()
      .useIamAuth()
      .apiFetch<
        LambdaPrivateCreateTripDestinationUserMutationVariables,
        LambdaPrivateCreateTripDestinationUserMutation
      >({
        query: lambdaPrivateCreateTripDestinationUser,
        variables: {
          input: {
            isReady: false,
            userId: userTrip.userId,
            tripId: event.arguments.input.tripId,
            destinationId: tripDestination.destinationId,
          },
        },
      })
  })

  const chunks = chunk(promises, CHUNK_SIZE)

  for (const chunkOfPromises of chunks) {
    await Promise.all(chunkOfPromises)
  }

  return null
}

export default createTripDestinationUser
