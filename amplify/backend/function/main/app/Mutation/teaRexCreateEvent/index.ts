import { TeaRexCreateEventMutationVariables } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'

import tearex from 'tearex'

const teaRexCreateEvent: AppSyncResolverHandler<TeaRexCreateEventMutationVariables, any> = async (event) => {
  /**
   * Main query
   */

  console.log('teaRexCreateEvent', event.arguments.input)

  const teaRexEvent = await tearex.createEvent(
    event.arguments.input.inEventEntity,
    event.arguments.input.teaRexEvent,
    event.arguments.input.outEventEntity,
  )

  if (!teaRexEvent) {
    throw new Error('Failed to create TeaRex event')
  }

  return true
}

export default teaRexCreateEvent
