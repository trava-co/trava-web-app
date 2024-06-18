import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { initializeAdmin } from './initializeAdmin'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { Notification } from 'shared-types/API'
import getUserFcmToken from './getUserFcmToken'
import { Message } from 'firebase-admin/lib/messaging/messaging-api'
import createMessage from './createMessage'
import admin from 'firebase-admin'

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  if (process.env.IS_ENABLED === 'true') {
    for (const record of event.Records) {
      if (record.eventName === 'INSERT') {
        try {
          // https://stackoverflow.com/questions/57763991/initializeapp-when-adding-firebase-to-app-and-to-server
          if (!admin.apps.length) {
            await initializeAdmin()
          }

          const notificationDynamoFormatted = record.dynamodb?.NewImage
          if (!notificationDynamoFormatted) return

          const notification: Notification = unmarshall(notificationDynamoFormatted) as Notification

          const registrationToken = await getUserFcmToken({ id: notification.receiverUserId })
          if (!registrationToken) return // user turned off notifications

          const message: Message = await createMessage(notification, registrationToken)

          await admin.messaging().send(message)
          console.log(`Notification to: ${notification.receiverUserId} has been sent`)
        } catch (err) {
          console.warn('Notification error', record.dynamodb?.NewImage && unmarshall(record.dynamodb?.NewImage), err)
          throw new Error(err)
        }
      } else {
        console.log(`notifications-lambda doesn't handle ${record.eventName} event`)
      }
    }
  } else console.log('Lambda notifications disabled')
}
