import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateTimelineEntryLodgingArrivalMutationVariables,
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

async function _privateCreateTimelineEntryLodgingArrival(
  variables: CreateTimelineEntryLodgingArrivalMutationVariables,
) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateTimelineEntryMutationVariables, PrivateCreateTimelineEntryMutation>({
      query: privateCreateTimelineEntry,
      variables: {
        input: {
          timelineEntryType: TimelineEntryType.LODGING_ARRIVAL,
          tripId: variables.input.tripId,
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

const createTimelineEntryLodgingArrival: AppSyncResolverHandler<
  CreateTimelineEntryLodgingArrivalMutationVariables,
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

  const timelineEntryLodgingArrival = await _privateCreateTimelineEntryLodgingArrival(event.arguments)

  if (!timelineEntryLodgingArrival) {
    throw new Error('Failed to create timeline entry lodging arrival')
  }

  for (const userId of event.arguments.input?.memberIds) {
    const timelineEntryMembers = await _privateCreateTimelineEntryMember({
      input: {
        timelineEntryId: timelineEntryLodgingArrival.id,
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

  return timelineEntryLodgingArrival
}

export default createTimelineEntryLodgingArrival
