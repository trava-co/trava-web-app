import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  PrivateCreateTimelineEntryMemberMutation,
  PrivateCreateTimelineEntryMemberMutationVariables,
  PrivateDeleteTimelineEntryMemberMutation,
  PrivateDeleteTimelineEntryMemberMutationVariables,
  TimelineEntry,
  TimelineEntryMember,
  UpdateTimelineEntryLodgingArrivalMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { privateCreateTimelineEntryMember, privateDeleteTimelineEntryMember } from 'shared-types/graphql/mutations'
import getTimelineEntry from '../../../utils/getTimelineEntry'

async function _privateCreateTimelineEntryMember(variables: PrivateCreateTimelineEntryMemberMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateTimelineEntryMemberMutationVariables, PrivateCreateTimelineEntryMemberMutation>({
      query: privateCreateTimelineEntryMember,
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
    .apiFetch<PrivateDeleteTimelineEntryMemberMutationVariables, PrivateDeleteTimelineEntryMemberMutation>({
      query: privateDeleteTimelineEntryMember,
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
  event: AppSyncResolverEvent<UpdateTimelineEntryLodgingArrivalMutationVariables>,
  timelineEntryLodgingArrival: TimelineEntry,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  const timelineEntry = await getTimelineEntry(timelineEntryLodgingArrival.id)

  if (!timelineEntry?.members?.items) {
    throw new Error(`Timeline entry ${timelineEntryLodgingArrival.id} not found`)
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
