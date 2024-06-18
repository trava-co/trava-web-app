import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryRentalPickupMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE } from 'shared-types/lambdaErrors'
import getUserTrips from '../../../utils/getUserTrips'

const checkIfUserHasAccessToTrip: AppSyncResolverHandler<
  CreateTimelineEntryRentalPickupMutationVariables,
  null
> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('Not enough arguments specified')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE)
  }

  const res = await getUserTrips({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  if (!res.length) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TIMELINE_ENTRY_RENTAL_PICKUP_MESSAGE)
  }

  return null
}

export default checkIfUserHasAccessToTrip
