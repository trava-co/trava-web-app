import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { DeleteTimelineEntryMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'
import getTimelineEntry from '../../../utils/getTimelineEntry'
import ApiClient from '../../../utils/ApiClient/ApiClient'

const checkIfUserHasAccessToTrip: AppSyncResolverHandler<DeleteTimelineEntryMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('Not enough arguments specified')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE)
  }

  const timelineEntry = await getTimelineEntry(event.arguments.input.id)

  if (!timelineEntry) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE)
  }

  event.request.headers.authorization && ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)
  const res = await getUserTrips({
    tripId: timelineEntry.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE)
  }

  return null
}

export default checkIfUserHasAccessToTrip
