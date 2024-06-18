import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaCustomPrivateUpdateTimelineEntryMutation,
  LambdaCustomPrivateUpdateTimelineEntryMutationVariables,
  UpdateTimelineEntryRentalDropoffMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import validateInput from './before/validateInput'
import addAndRemoveTimelineEntryMembers from './after/addAndRemoveTimelineEntryMembers'
import checkIfUsersAddedBelongToTrip from './before/checkIfUsersAddedBelongToTrip'
import { lambdaCustomPrivateUpdateTimelineEntry } from 'shared-types/graphql/lambda'

const syncBeforeHooks = [validateInput, checkIfUserHasAccessToTrip, checkIfUsersAddedBelongToTrip]
const syncAfterHooks = [addAndRemoveTimelineEntryMembers]

async function _privateUpdateTimelineEntryRentalDropoff(variables: UpdateTimelineEntryRentalDropoffMutationVariables) {
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
          rentalDropoffLocation: variables.input.rentalDropoffLocation,
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

const createTimelineEntryRentalDropoff: AppSyncResolverHandler<
  UpdateTimelineEntryRentalDropoffMutationVariables,
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

  const timelineEntryRentalDropoff = await _privateUpdateTimelineEntryRentalDropoff(event.arguments)

  if (!timelineEntryRentalDropoff) {
    throw new Error('Failed to update timeline entry rental dropoff')
  }

  /**
   * sync after
   */
  for (const hook of syncAfterHooks) {
    console.log(`Running sync after hook: "${hook.name}"`)
    await hook(event, timelineEntryRentalDropoff)
  }

  return timelineEntryRentalDropoff
}

export default createTimelineEntryRentalDropoff
