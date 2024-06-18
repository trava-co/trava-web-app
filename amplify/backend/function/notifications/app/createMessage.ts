import { Notification } from 'shared-types/API'
import getNotificationContent from './getNotificationContent'

const createMessage = async (notification: Notification, registrationToken: string) => {
  const { body, title, navigator, screen, stringifyParams } = await getNotificationContent(notification)

  return {
    token: registrationToken,
    notification: {
      body,
      title,
    },
    data: {
      navigator,
      screen,
      stringifyParams,
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
        },
      },
    },
    android: {
      notification: {
        notificationCount: 1,
      },
    },
  }
}

export default createMessage
