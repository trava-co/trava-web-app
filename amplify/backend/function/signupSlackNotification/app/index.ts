import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import axios from 'axios'
import { getSSMVariable } from './utils/getSSMVariable'
import ApiClient from './utils/ApiClient'
import getAllUsersPastDay from './utils/getAllUsersPastDay'

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  // only run this function in production
  if (process.env.ENV !== 'prod') return

  const SLACK_WEBHOOK_URL = await getSSMVariable('SLACK_WEBHOOK_URL')

  if (!SLACK_WEBHOOK_URL) {
    throw new Error('Slack webhook URL not found')
  }

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      if (!record.dynamodb?.NewImage) return
      const newUser = unmarshall(record.dynamodb?.NewImage)

      // make an api request to users table to count the number of users who've joined today
      ApiClient.get().useIamAuth()
      const newUsersToday = await getAllUsersPastDay()
      const newUsersTodayLength = newUsersToday?.length ?? 0

      // include the number of users who've joined today in the slack notification
      if (newUser.username) {
        // await sendSlackNotification(SLACK_WEBHOOK_URL, newUser.username)
        await sendSlackNotification(
          SLACK_WEBHOOK_URL,
          `${newUser.name} joined! Sign up #${newUsersTodayLength} on the day.`,
        )
      }
    }
  }
}

async function sendSlackNotification(webhookUrl: string, text: string) {
  try {
    const response = await axios.post(
      webhookUrl,
      {
        text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 200) {
      throw new Error(`Slack API request failed with status ${response.status}`)
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error)
  }
}
