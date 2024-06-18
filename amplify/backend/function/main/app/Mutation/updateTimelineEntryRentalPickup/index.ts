import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaCustomPrivateUpdateTimelineEntryMutation,
  LambdaCustomPrivateUpdateTimelineEntryMutationVariables,
  UpdateTimelineEntryRentalPickupMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import validateInput from './before/validateInput'
import addAndRemoveTimelineEntryMembers from './after/addAndRemoveTimelineEntryMembers'
import checkIfUsersAddedBelongToTrip from './before/checkIfUsersAddedBelongToTrip'
import { lambdaCustomPrivateUpdateTimelineEntry } from 'shared-types/graphql/lambda'

const syncBeforeHooks = [validateInput, checkIfUserHasAccessToTrip, checkIfUsersAddedBelongToTrip]
const syncAfterHooks = [addAndRemoveTimelineEntryMembers]

async function _privateUpdateTimelineEntryRentalPickup(variables: UpdateTimelineEntryRentalPickupMutationVariables) {
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
          rentalPickupLocation: variables.input.rentalPickupLocation,
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

const createTimelineEntryRentalPickup: AppSyncResolverHandler<
  UpdateTimelineEntryRentalPickupMutationVariables,
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

  const timelineEntryRentalPickup = await _privateUpdateTimelineEntryRentalPickup(event.arguments)

  if (!timelineEntryRentalPickup) {
    throw new Error('Failed to update timeline entry rental pickup')
  }

  /**
   * sync after
   */
  for (const hook of syncAfterHooks) {
    console.log(`Running sync after hook: "${hook.name}"`)
    await hook(event, timelineEntryRentalPickup)
  }

  return timelineEntryRentalPickup
}

export default createTimelineEntryRentalPickup
