import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { validateDate, validateNotes, validateTime } from '../../../utils/timelineValidation'
import { UpdateTimelineEntryFlightMutationVariables } from 'shared-types/API'

const validateInput: AppSyncResolverHandler<UpdateTimelineEntryFlightMutationVariables, null> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  event.arguments.input.date && validateDate(event.arguments.input.date)
  event.arguments.input.time && validateTime(event.arguments.input.time)

  return null
}

export default validateInput
