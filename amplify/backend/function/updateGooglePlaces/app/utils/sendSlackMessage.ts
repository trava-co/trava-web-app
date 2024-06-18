import axios from 'axios'
import { getSSMVariable } from './getSSMVariable'
import FormData from 'form-data'

export async function sendSlackMessage(text: string, placeIds?: string[]) {
  console.log(`text: ${text}, placeIds: ${placeIds}`)
  const SLACK_TOKEN = await getSSMVariable('SLACK_BOT_TOKEN')
  const CHANNEL_ID = 'C05T3S3JY6R' // google-places-nightly-update channel

  if (!SLACK_TOKEN) {
    throw new Error('Slack bot token not found')
  }

  let fileId

  // If placeIds are provided, upload them as a .csv file
  if (placeIds && placeIds.length > 0) {
    const csvContent = 'Place ID\n' + placeIds.join('\n')
    const csvBuffer = Buffer.from(csvContent, 'utf8')

    const formData = new FormData()
    formData.append('token', SLACK_TOKEN)
    formData.append('channels', CHANNEL_ID)
    formData.append('filename', 'place_ids.csv')
    formData.append('filetype', 'csv')
    formData.append('file', csvBuffer, {
      filename: 'place_ids.csv',
      contentType: 'text/csv',
    })

    const fileResponse = await axios.post('https://slack.com/api/files.upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })

    if (!fileResponse.data.ok) {
      throw new Error(`Failed to upload file to Slack: ${fileResponse.data.error}`)
    }

    fileId = fileResponse.data.file.id
  }

  const attachments = fileId ? [{ file_id: fileId }] : []

  const messageResponse = await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel: CHANNEL_ID,
      text,
      attachments,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SLACK_TOKEN}`,
      },
    },
  )

  if (!messageResponse.data.ok) {
    throw new Error(`Failed to send Slack message: ${messageResponse.data.error}`)
  }
}
