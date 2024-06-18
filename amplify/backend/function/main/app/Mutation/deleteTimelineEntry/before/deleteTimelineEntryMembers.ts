import { AppSyncResolverHandler } from 'aws-lambda/trigger/appsync-resolver'
import {
  DeleteTimelineEntryMutationVariables,
  LambdaPrivateDeleteTimelineEntryMemberMutation,
  LambdaPrivateDeleteTimelineEntryMemberMutationVariables,
  TimelineEntryMember,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE } from 'shared-types/lambdaErrors'
import getTimelineEntry from '../../../utils/getTimelineEntry'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaPrivateDeleteTimelineEntryMember } from 'shared-types/graphql/lambda'

async function _privateDeleteTimelineEntryMember(variables: LambdaPrivateDeleteTimelineEntryMemberMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateDeleteTimelineEntryMemberMutationVariables, LambdaPrivateDeleteTimelineEntryMemberMutation>({
      query: lambdaPrivateDeleteTimelineEntryMember,
      variables: {
        input: {
          timelineEntryId: variables.input.timelineEntryId,
          userId: variables.input.userId,
        },
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateDeleteTimelineEntryMember
}

const deleteTimelineEntryMembers: AppSyncResolverHandler<DeleteTimelineEntryMutationVariables, null> = async (
  event,
) => {
  console.log('event', event)

  if (!event.arguments.input) {
    throw new Error('Not enough arguments specified')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE)
  }

  ApiClient.get().useIamAuth()
  const timelineEntry = await getTimelineEntry(event.arguments.input.id)

  if (!timelineEntry) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_TIMELINE_ENTRY_MESSAGE)
  }

  if (!timelineEntry.members?.items) {
    return null
  }

  const deleteTimelineEntryMemberPromises = timelineEntry.members?.items
    .filter((member): member is TimelineEntryMember => !!member)
    .map((member) => {
      return _privateDeleteTimelineEntryMember({
        input: {
          timelineEntryId: timelineEntry.id,
          userId: member.userId,
        },
      })
    })

  await Promise.all(deleteTimelineEntryMemberPromises)

  return null
}

export default deleteTimelineEntryMembers
