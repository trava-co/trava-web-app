import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryRentalPickupMutationVariables } from 'shared-types/API'
import {
  validateDate,
  validateNotes,
  validateRentalPickupLocation,
  validateTime,
} from '../../../utils/timelineValidation'

const validateInput: AppSyncResolverHandler<CreateTimelineEntryRentalPickupMutationVariables, null> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  validateDate(event.arguments.input.date)
  validateTime(event.arguments.input.time)

  validateRentalPickupLocation(event.arguments.input.rentalPickupLocation)

  return null
}

export default validateInput
