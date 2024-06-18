import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaCustomPrivateUpdateTimelineEntryMutation,
  LambdaCustomPrivateUpdateTimelineEntryMutationVariables,
  UpdateTimelineEntryLodgingArrivalMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import validateInput from './before/validateInput'
import addAndRemoveTimelineEntryMembers from './after/addAndRemoveTimelineEntryMembers'
import checkIfUsersAddedBelongToTrip from './before/checkIfUsersAddedBelongToTrip'
import { lambdaCustomPrivateUpdateTimelineEntry } from 'shared-types/graphql/lambda'

const syncBeforeHooks = [validateInput, checkIfUserHasAccessToTrip, checkIfUsersAddedBelongToTrip]
const syncAfterHooks = [addAndRemoveTimelineEntryMembers]

async function _privateUpdateTimelineEntryLodgingArrival(
  variables: UpdateTimelineEntryLodgingArrivalMutationVariables,
) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaCustomPrivateUpdateTimelineEntryMutationVariables, LambdaCustomPrivateUpdateTimelineEntryMutation>({
      query: lambdaCustomPrivateUpdateTimelineEntry,
      variables: {
        input: {
          id: variables.input.id,
          notes: variables.input.notes,
          date: variables.input.date,
          time: variables.input.time,
          lodgingArrivalNameAndAddress: variables.input.lodgingArrivalNameAndAddress,
        },
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateTimelineEntry
}

const createTimelineEntryLodgingArrival: AppSyncResolverHandler<
  UpdateTimelineEntryLodgingArrivalMutationVariables,
  any
> = async (event, ...args) => {
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

  const timelineEntryLodgingArrival = await _privateUpdateTimelineEntryLodgingArrival(event.arguments)

  if (!timelineEntryLodgingArrival) {
    throw new Error('Failed to update timeline entry lodging arrival')
  }

  /**
   * sync after
   */
  for (const hook of syncAfterHooks) {
    console.log(`Running sync after hook: "${hook.name}"`)
    await hook(event, timelineEntryLodgingArrival)
  }

  return timelineEntryLodgingArrival
}

export default createTimelineEntryLodgingArrival
