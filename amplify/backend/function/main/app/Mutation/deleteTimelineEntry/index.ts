import { AppSyncResolverHandler } from 'aws-lambda'
import {
  DeleteTimelineEntryMutationVariables,
  PrivateDeleteTimelineEntryMutation,
  PrivateDeleteTimelineEntryMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { privateDeleteTimelineEntry } from 'shared-types/graphql/mutations'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import deleteTimelineEntryMembers from './before/deleteTimelineEntryMembers'

const syncBeforeHooks = [checkIfUserHasAccessToTrip, deleteTimelineEntryMembers]

async function _privateDeleteTimelineEntry(variables: DeleteTimelineEntryMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateDeleteTimelineEntryMutationVariables, PrivateDeleteTimelineEntryMutation>({
      query: privateDeleteTimelineEntry,
      variables: {
        input: {
          id: variables.input.id,
        },
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateDeleteTimelineEntry
}

const deleteTimelineEntry: AppSyncResolverHandler<DeleteTimelineEntryMutationVariables, any> = async (
  event,
  ...args
) => {
  /**
   * sync before hooks
   */
  for (const hook of syncBeforeHooks) {
    console.log(`Running sync before hook: "${hook.name}"`)
    await hook(event, ...args)
  }

  /**
   * Main query
   */
  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  const timelineEntryFlight = await _privateDeleteTimelineEntry(event.arguments)

  if (!timelineEntryFlight) {
    throw new Error('Failed to delete timeline entry')
  }

  /**
   * sync after hooks
   */
  // none

  return timelineEntryFlight
}

export default deleteTimelineEntry
