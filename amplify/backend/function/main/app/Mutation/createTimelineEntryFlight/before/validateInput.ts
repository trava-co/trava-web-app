import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import { CreateTimelineEntryFlightMutationVariables } from 'shared-types/API'
import { validateDate, validateNotes, validateTime } from '../../../utils/timelineValidation'

const validateInput: AppSyncResolverHandler<CreateTimelineEntryFlightMutationVariables, null> = async (event) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  validateNotes(event.arguments.input.notes)
  validateDate(event.arguments.input.date)
  validateTime(event.arguments.input.time)

  return null
}

export default validateInput
