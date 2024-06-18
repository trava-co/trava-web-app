import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import chunk from 'lodash.chunk'
import {
  CreateTripDestinationMutationVariables,
  LambdaPrivateCreateTripDestinationUserMutation,
  LambdaPrivateCreateTripDestinationUserMutationVariables,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_USER_MESSAGE } from 'shared-types/lambdaErrors'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getUserTrips from '../../../utils/getUserTrips'
import { lambdaPrivateCreateTripDestinationUser } from 'shared-types/graphql/lambda'

const CHUNK_SIZE = 10

const createTripDestinationUsers = async (event: AppSyncResolverEvent<CreateTripDestinationMutationVariables>) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_DESTINATION_USER_MESSAGE)
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
        LambdaPrivateCreateTripDestinationUserMutationVariables,
        LambdaPrivateCreateTripDestinationUserMutation
      >({
        query: lambdaPrivateCreateTripDestinationUser,
        variables: {
          input: {
            isReady: false,
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

  return null
}

export default createTripDestinationUsers
