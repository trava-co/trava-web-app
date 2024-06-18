import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryLodgingDepartureMutationVariables } from 'shared-types/API'
import getUserTrips from '../../../utils/getUserTrips'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_LODGING_DEPARTURE_MESSAGE } from 'shared-types/lambdaErrors'

const checkIfUsersAddedBelongToTrip: AppSyncResolverHandler<
  CreateTimelineEntryLodgingDepartureMutationVariables,
  null
> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('Not enough arguments specified')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_LODGING_DEPARTURE_MESSAGE)
  }

  const res = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  event.arguments.input.memberIds.forEach((memberId) => {
    if (!res.find((user) => user?.userId === memberId)) {
      throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_LODGING_DEPARTURE_MESSAGE)
    }
  })

  return null
}

export default checkIfUsersAddedBelongToTrip
