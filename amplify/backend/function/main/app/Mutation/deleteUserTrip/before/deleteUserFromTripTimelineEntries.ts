import { AppSyncResolverHandler } from 'aws-lambda'
import chunk from 'lodash.chunk'
import {
  DeleteUserTripMutationVariables,
  LambdaPrivateDeleteTimelineEntryMemberMutation,
  LambdaPrivateDeleteTimelineEntryMemberMutationVariables,
  TimelineEntry,
} from 'shared-types/API'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getTripTimelineByTrip from '../../../utils/getTripTimelineByTrip'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE } from 'shared-types/lambdaErrors'
import { lambdaPrivateDeleteTimelineEntryMember } from 'shared-types/graphql/lambda'

const CHUNK_SIZE = 10

const deleteUserFromTripTimelineEntries: AppSyncResolverHandler<DeleteUserTripMutationVariables, null> = async (
  event,
) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TRIP_DESTINATION_USER_MESSAGE) // FIXME:
  }

  const { tripId, userId } = event.arguments.input

  const tripTimelineEntries = await getTripTimelineByTrip({ tripId, userId: event.identity.sub })

  const promises = tripTimelineEntries
    ?.filter((tripTimelineEntry): tripTimelineEntry is TimelineEntry => !!tripTimelineEntry?.id)
    .map((tripTimelineEntry) => {
      return ApiClient.get()
        .useIamAuth()
        .apiFetch<
          LambdaPrivateDeleteTimelineEntryMemberMutationVariables,
          LambdaPrivateDeleteTimelineEntryMemberMutation
        >({
          query: lambdaPrivateDeleteTimelineEntryMember,
          variables: {
            input: {
              timelineEntryId: tripTimelineEntry.id,
              userId,
            },
          },
        })
    })

  event.request.headers.authorization && ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)

  const chunks = chunk(promises, CHUNK_SIZE)

  for (const chunkOfPromises of chunks) {
    await Promise.all(chunkOfPromises)
  }

  return null
}

export default deleteUserFromTripTimelineEntries
