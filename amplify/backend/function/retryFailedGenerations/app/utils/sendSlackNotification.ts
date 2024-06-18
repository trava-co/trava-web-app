import axios from 'axios'

export async function sendSlackNotification(webhookUrl: string, text: string) {
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
