import chunk from 'lodash.chunk'
import {
  DeleteUserTripMutationVariables,
  LambdaPrivateDeleteTripDestinationUserMutation,
  LambdaPrivateDeleteTripDestinationUserMutationVariables,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE } from 'shared-types/lambdaErrors'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getTripDestinations from '../../../utils/getTripDestinations'
import { AppSyncResolverHandler } from 'aws-lambda'
import { lambdaPrivateDeleteTripDestinationUser } from 'shared-types/graphql/lambda'

const CHUNK_SIZE = 10

const deleteTripDestinationUser: AppSyncResolverHandler<DeleteUserTripMutationVariables, null> = async (event) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE)
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
        LambdaPrivateDeleteTripDestinationUserMutationVariables,
        LambdaPrivateDeleteTripDestinationUserMutation
      >({
        query: lambdaPrivateDeleteTripDestinationUser,
        variables: {
          input: {
            userId: event.arguments.input.userId,
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

  ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization as string)

  return null
}

export default deleteTripDestinationUser
