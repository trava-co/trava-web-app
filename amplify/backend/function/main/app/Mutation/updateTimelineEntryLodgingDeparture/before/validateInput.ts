import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import {
  validateDate,
  validateLodgingDepartureNameAndAddress,
  validateNotes,
  validateTime,
} from '../../../utils/timelineValidation'
import { UpdateTimelineEntryLodgingDepartureMutationVariables } from 'shared-types/API'

const validateInput: AppSyncResolverHandler<UpdateTimelineEntryLodgingDepartureMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  event.arguments.input.date && validateDate(event.arguments.input.date)
  event.arguments.input.time && validateTime(event.arguments.input.time)
  validateLodgingDepartureNameAndAddress(event.arguments.input.lodgingDepartureNameAndAddress)

  return null
}

export default validateInput
