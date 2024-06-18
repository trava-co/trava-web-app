import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import {
  validateDate,
  validateNotes,
  validateRentalDropoffLocation,
  validateTime,
} from '../../../utils/timelineValidation'
import { UpdateTimelineEntryRentalDropoffMutationVariables } from 'shared-types/API'

const validateInput: AppSyncResolverHandler<UpdateTimelineEntryRentalDropoffMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  event.arguments.input.date && validateDate(event.arguments.input.date)
  event.arguments.input.time && validateTime(event.arguments.input.time)
  validateRentalDropoffLocation(event.arguments.input.rentalDropoffLocation)

  return null
}

export default validateInput
