import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryRentalDropoffMutationVariables } from 'shared-types/API'
import {
  validateDate,
  validateNotes,
  validateRentalDropoffLocation,
  validateTime,
} from '../../../utils/timelineValidation'

const validateInput: AppSyncResolverHandler<CreateTimelineEntryRentalDropoffMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  validateDate(event.arguments.input.date)
  validateTime(event.arguments.input.time)
  validateRentalDropoffLocation(event.arguments.input.rentalDropoffLocation)

  return null
}

export default validateInput
