import { AppSyncResolverHandler } from 'aws-lambda'
import chunk from 'lodash.chunk'
import {
  DeleteTripDestinationMutationVariables,
  LambdaPrivateDeleteTripDestinationUserMutation,
  LambdaPrivateDeleteTripDestinationUserMutationVariables,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE } from 'shared-types/lambdaErrors'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getUserTrips from '../../../utils/getUserTrips'
import { lambdaPrivateDeleteTripDestinationUser } from 'shared-types/graphql/lambda'

const CHUNK_SIZE = 10

const deleteTripDestinationUsers: AppSyncResolverHandler<DeleteTripDestinationMutationVariables, null> = async (
  event,
) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE)
  }

  const userTrips = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  const promises = userTrips.map((userTrip) => {
    if (!userTrip) return null
    return ApiClient.get()
      .useIamAuth()
      .apiFetch<
        LambdaPrivateDeleteTripDestinationUserMutationVariables,
        LambdaPrivateDeleteTripDestinationUserMutation
      >({
        query: lambdaPrivateDeleteTripDestinationUser,
        variables: {
          input: {
            userId: userTrip.userId,
            tripId: event.arguments.input.tripId,
            destinationId: event.arguments.input.destinationId,
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

export default deleteTripDestinationUsers
