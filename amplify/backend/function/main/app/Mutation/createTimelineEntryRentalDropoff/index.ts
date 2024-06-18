import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateTimelineEntryRentalDropoffMutationVariables,
  LambdaPrivateCreateTimelineEntryMemberMutation,
  LambdaPrivateCreateTimelineEntryMemberMutationVariables,
  PrivateCreateTimelineEntryMutation,
  PrivateCreateTimelineEntryMutationVariables,
  TimelineEntryType,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { privateCreateTimelineEntry } from 'shared-types/graphql/mutations'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import validateInput from './before/validateInput'
import checkIfUsersAddedBelongToTrip from './before/checkIfUsersAddedBelongToTrip'
import { lambdaPrivateCreateTimelineEntryMember } from 'shared-types/graphql/lambda'

const syncBeforeHooks = [validateInput, checkIfUserHasAccessToTrip, checkIfUsersAddedBelongToTrip]

async function _privateCreateTimelineEntryRentalDropoff(variables: CreateTimelineEntryRentalDropoffMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateTimelineEntryMutationVariables, PrivateCreateTimelineEntryMutation>({
      query: privateCreateTimelineEntry,
      variables: {
        input: {
          timelineEntryType: TimelineEntryType.RENTAL_DROPOFF,
          tripId: variables.input.tripId,
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

  return res.data.privateCreateTimelineEntry
}

async function _privateCreateTimelineEntryMember(variables: LambdaPrivateCreateTimelineEntryMemberMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateCreateTimelineEntryMemberMutationVariables, LambdaPrivateCreateTimelineEntryMemberMutation>({
      query: lambdaPrivateCreateTimelineEntryMember,
      variables: {
        input: variables.input,
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateTimelineEntryMember
}

const createTimelineEntryRentalDropoff: AppSyncResolverHandler<
  CreateTimelineEntryRentalDropoffMutationVariables,
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

  const timelineEntryRentalDropoff = await _privateCreateTimelineEntryRentalDropoff(event.arguments)

  if (!timelineEntryRentalDropoff) {
    throw new Error('Failed to create timeline entry rental dropoff')
  }

  for (const userId of event.arguments.input?.memberIds) {
    const timelineEntryMembers = await _privateCreateTimelineEntryMember({
      input: {
        timelineEntryId: timelineEntryRentalDropoff.id,
        userId: userId,
      },
    })

    if (!timelineEntryMembers) {
      throw new Error('Failed to create timeline entry member')
    }
  }

  /**
   * sync after
   */
  // none

  return timelineEntryRentalDropoff
}

export default createTimelineEntryRentalDropoff
