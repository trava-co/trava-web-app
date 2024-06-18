import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import getUserTrips from '../../../utils/getUserTrips'
import getTimelineEntry from '../../../utils/getTimelineEntry'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE } from 'shared-types/lambdaErrors'
import { UpdateTimelineEntryRentalPickupMutationVariables } from 'shared-types/API'
import ApiClient from '../../../utils/ApiClient/ApiClient'

const checkIfUserHasAccessToTrip: AppSyncResolverHandler<
  UpdateTimelineEntryRentalPickupMutationVariables,
  null
> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('Not enough arguments specified')
  }

  const timelineEntry = await getTimelineEntry(event.arguments.input.id)

  if (!timelineEntry) {
    throw new Error('Timeline entry not found')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE)
  }

  event.request.headers.authorization && ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)
  const res = await getUserTrips({
    tripId: timelineEntry.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE)
  }

  return null
}

export default checkIfUserHasAccessToTrip
