import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import {
  validateDate,
  validateNotes,
  validateRentalPickupLocation,
  validateTime,
} from '../../../utils/timelineValidation'
import { UpdateTimelineEntryRentalPickupMutationVariables } from 'shared-types/API'

const validateInput: AppSyncResolverHandler<UpdateTimelineEntryRentalPickupMutationVariables, null> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  event.arguments.input.date && validateDate(event.arguments.input.date)
  event.arguments.input.time && validateTime(event.arguments.input.time)
  validateRentalPickupLocation(event.arguments.input.rentalPickupLocation)

  return null
}

export default validateInput
