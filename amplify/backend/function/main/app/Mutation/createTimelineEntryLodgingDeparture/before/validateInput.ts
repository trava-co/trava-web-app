import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryLodgingDepartureMutationVariables } from 'shared-types/API'
import {
  validateDate,
  validateLodgingDepartureNameAndAddress,
  validateNotes,
  validateTime,
} from '../../../utils/timelineValidation'

const validateInput: AppSyncResolverHandler<CreateTimelineEntryLodgingDepartureMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  validateDate(event.arguments.input.date)
  validateTime(event.arguments.input.time)

  validateLodgingDepartureNameAndAddress(event.arguments.input.lodgingDepartureNameAndAddress)

  return null
}

export default validateInput
