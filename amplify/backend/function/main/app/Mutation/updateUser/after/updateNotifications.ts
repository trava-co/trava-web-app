import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  LambdaListNotificationsByReceiverUserQuery,
  LambdaListNotificationsByReceiverUserQueryVariables,
  LambdaUpdateNotificationMutation,
  LambdaUpdateNotificationMutationVariables,
  Notification,
  NOTIFICATION_TYPE,
  PRIVACY,
  UpdateUserMutationVariables,
  User,
} from 'shared-types/API'
import getAllPaginatedData from '../../../utils/getAllPaginatedData'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaListNotificationsByReceiverUser, lambdaUpdateNotification } from 'shared-types/graphql/lambda'
import chunk from 'lodash.chunk'

const CHUNK_SIZE = 25

async function _updateNotification(variables: LambdaUpdateNotificationMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaUpdateNotificationMutationVariables,
    LambdaUpdateNotificationMutation
  >({
    query: lambdaUpdateNotification,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.updateNotification
}

async function _lambdaListNotificationsByReceiverUser(variables: LambdaListNotificationsByReceiverUserQueryVariables) {
  const notifications: Pick<Notification, 'id' | 'type'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaListNotificationsByReceiverUserQueryVariables,
        LambdaListNotificationsByReceiverUserQuery
      >({
        query: lambdaListNotificationsByReceiverUser,
        variables: {
          ...variables,
          limit: 100,
          nextToken,
        },
      })

      return {
        nextToken: res.data.listNotificationsByReceiverUser?.nextToken,
        data: res.data.listNotificationsByReceiverUser?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (!item) return

        notifications.push(item)
      })
    },
  )

  return notifications
}

const updateNotifications = async (event: AppSyncResolverEvent<UpdateUserMutationVariables>, user: User) => {
  console.log('event', event)

  // trigger only when a user sets privacy to PUBLIC
  if ('privacy' in event.arguments.input && event.arguments.input.privacy === PRIVACY.PUBLIC) {
    const notifications = await _lambdaListNotificationsByReceiverUser({ receiverUserId: user.id })

    const updateNotificationPromises = notifications
      .filter((notification) => notification.type === NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT)
      .map((notification) =>
        _updateNotification({
          input: {
            id: notification.id,
            type: NOTIFICATION_TYPE.NEW_FOLLOW,
          },
        }),
      )

    const chunks = chunk(updateNotificationPromises, CHUNK_SIZE)

    for (const chunkOfPromises of chunks) {
      await Promise.all(chunkOfPromises)
    }
  }

  return null
}

export default updateNotifications
