import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  LambdaPrivateCreateTimelineEntryMemberMutation,
  LambdaPrivateCreateTimelineEntryMemberMutationVariables,
  LambdaPrivateDeleteTimelineEntryMemberMutation,
  LambdaPrivateDeleteTimelineEntryMemberMutationVariables,
  PrivateDeleteTimelineEntryMemberMutationVariables,
  TimelineEntry,
  TimelineEntryMember,
  UpdateTimelineEntryFlightMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getTimelineEntry from '../../../utils/getTimelineEntry'
import {
  lambdaPrivateCreateTimelineEntryMember,
  lambdaPrivateDeleteTimelineEntryMember,
} from 'shared-types/graphql/lambda'

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

async function _privateDeleteTimelineEntryMember(variables: PrivateDeleteTimelineEntryMemberMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateDeleteTimelineEntryMemberMutationVariables, LambdaPrivateDeleteTimelineEntryMemberMutation>({
      query: lambdaPrivateDeleteTimelineEntryMember,
      variables: {
        input: variables.input,
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateDeleteTimelineEntryMember
}

const addAndRemoveTimelineEntryMembers = async (
  event: AppSyncResolverEvent<UpdateTimelineEntryFlightMutationVariables>,
  timelineEntryFlight: TimelineEntry,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No argumentsę specified')
  }

  const timelineEntry = await getTimelineEntry(timelineEntryFlight.id)

  if (!timelineEntry?.members?.items) {
    throw new Error(`Timeline entry ${timelineEntryFlight.id} not found`)
  }

  const timelineEntryMembersToCreate = event.arguments.input.memberIds.filter(
    (memberId) =>
      !timelineEntry.members?.items
        ?.filter((member): member is TimelineEntryMember => !!member)
        .find((member) => member.userId === memberId),
  )
  const timelineEntryMembersToDelete = timelineEntry.members?.items
    ?.filter((member): member is TimelineEntryMember => !!member?.userId)
    ?.map((member) => member.userId)
    .filter((memberId) => !event.arguments.input.memberIds.includes(memberId))

  const deleteTimelineEntryMembersPromises = timelineEntryMembersToDelete.map((timelineEntryMemberId) => {
    return _privateDeleteTimelineEntryMember({
      input: {
        timelineEntryId: timelineEntry.id,
        userId: timelineEntryMemberId,
      },
    })
  })

  const createTimelineEntryMembersPromises = timelineEntryMembersToCreate.map((timelineEntryMemberId) => {
    return _privateCreateTimelineEntryMember({
      input: {
        timelineEntryId: timelineEntry.id,
        userId: timelineEntryMemberId,
      },
    })
  })

  await Promise.all(deleteTimelineEntryMembersPromises)
  await Promise.all(createTimelineEntryMembersPromises)

  return null
}

export default addAndRemoveTimelineEntryMembers
