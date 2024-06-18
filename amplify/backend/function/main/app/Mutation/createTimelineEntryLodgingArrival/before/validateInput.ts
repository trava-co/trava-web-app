import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryLodgingArrivalMutationVariables } from 'shared-types/API'
import {
  validateDate,
  validateLodgingArrivalNameAndAddress,
  validateNotes,
  validateTime,
} from '../../../utils/timelineValidation'

const validateInput: AppSyncResolverHandler<CreateTimelineEntryLodgingArrivalMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  validateDate(event.arguments.input.date)
  validateTime(event.arguments.input.time)

  validateLodgingArrivalNameAndAddress(event.arguments.input.lodgingArrivalNameAndAddress)

  return null
}

export default validateInput
