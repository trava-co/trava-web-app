import { TeaRexDeleteEventMutationVariables } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'

import tearex from 'tearex'

const teaRexDeleteEvent: AppSyncResolverHandler<TeaRexDeleteEventMutationVariables, any> = async (event) => {
  /**
   * Main query
   */

  console.log('teaRexDeleteEvent', event.arguments.input)

  const teaRexEvent = await tearex.deleteEvent(
    event.arguments.input.inEventEntity,
    event.arguments.input.teaRexEvent,
    event.arguments.input.outEventEntity,
  )

  if (!teaRexEvent) {
    throw new Error('Failed to delete TeaRex event')
  }

  return true
}

export default teaRexDeleteEvent
