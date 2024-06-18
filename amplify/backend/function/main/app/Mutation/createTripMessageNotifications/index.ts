import {
  CreateTripMessageNotificationsMutationVariables,
  LambdaChatCreateTripMessageNotificationsGetReceiversIdsQueryVariables,
  LambdaChatCreateTripMessageNotificationsGetReceiversIdsQuery,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  UserTripStatus,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import { CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import chunk from 'lodash.chunk'
import {
  lambdaChatCreateTripMessageNotificationsGetReceiversIds,
  lambdaCreateNotification,
} from 'shared-types/graphql/lambda'
import notEmpty from '../../utils/notEmpty'

const CHUNK_SIZE = 10

const createTripMessageNotifications: AppSyncResolverHandler<
  CreateTripMessageNotificationsMutationVariables,
  any
> = async (event) => {
  ApiClient.get().useIamAuth()

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS)
  }

  const senderUserId = event.identity.sub
  if (!senderUserId) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS)
  }

  // 1. Get members of the trip
  const getMembers = await ApiClient.get().apiFetch<
    LambdaChatCreateTripMessageNotificationsGetReceiversIdsQueryVariables,
    LambdaChatCreateTripMessageNotificationsGetReceiversIdsQuery
  >({
    query: lambdaChatCreateTripMessageNotificationsGetReceiversIds,
    variables: {
      tripId: event.arguments.input.tripId,
    },
  })

  const getMembersIds = getMembers?.data?.privateGetTrip?.members?.items
    ?.filter(notEmpty)
    ?.filter((el) => el.status === UserTripStatus.APPROVED)
    .map((el) => el.userId)

  if (!getMembersIds) {
    throw new Error('No members')
  }

  // if user doesn't belong to the trip
  if (getMembersIds.indexOf(senderUserId) === -1) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_TRIP_MESSAGE_NOTIFICATIONS)
  }

  const promises = getMembersIds
    .filter((userId) => userId !== senderUserId) // don't send notification to the sender
    .map((receiverUserId) => {
      return ApiClient.get().apiFetch<LambdaCreateNotificationMutationVariables, LambdaCreateNotificationMutation>({
        query: lambdaCreateNotification,
        variables: {
          input: {
            showInApp: 0,
            receiverUserId,
            senderUserId,
            tripId: event.arguments.input.tripId,
            type: event.arguments.input.type,
            text: event.arguments.input.text,
          },
        },
      })
    })

  const chunks = chunk(promises, CHUNK_SIZE)

  for (const chunkOfPromises of chunks) {
    await Promise.all(chunkOfPromises)
  }

  return true
}

export default createTripMessageNotifications
