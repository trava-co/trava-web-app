import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { UpdateTimelineEntryRentalDropoffMutationVariables } from 'shared-types/API'
import getUserTrips from '../../../utils/getUserTrips'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_DROPOFF_MESSAGE } from 'shared-types/lambdaErrors'
import getTimelineEntry from '../../../utils/getTimelineEntry'
import ApiClient from '../../../utils/ApiClient/ApiClient'

const checkIfUsersAddedBelongToTrip: AppSyncResolverHandler<
  UpdateTimelineEntryRentalDropoffMutationVariables,
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
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_DROPOFF_MESSAGE)
  }

  event.request.headers.authorization && ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)
  const res = await getUserTrips({
    tripId: timelineEntry.tripId,
    userId: event.identity.sub,
  })

  event.arguments.input.memberIds.forEach((memberId) => {
    if (!res.find((user) => user?.userId === memberId)) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_TIMELINE_ENTRY_RENTAL_DROPOFF_MESSAGE)
    }
  })

  return null
}

export default checkIfUsersAddedBelongToTrip
