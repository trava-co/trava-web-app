import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import {
  validateDate,
  validateLodgingArrivalNameAndAddress,
  validateNotes,
  validateTime,
} from '../../../utils/timelineValidation'
import { UpdateTimelineEntryLodgingArrivalMutationVariables } from 'shared-types/API'

const validateInput: AppSyncResolverHandler<UpdateTimelineEntryLodgingArrivalMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  event.arguments.input.date && validateDate(event.arguments.input.date)
  event.arguments.input.time && validateTime(event.arguments.input.time)
  validateLodgingArrivalNameAndAddress(event.arguments.input.lodgingArrivalNameAndAddress)

  return null
}

export default validateInput
