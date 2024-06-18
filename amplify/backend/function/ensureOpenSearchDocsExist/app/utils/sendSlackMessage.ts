import axios from 'axios'
import FormData from 'form-data'
import { getSSMVariable } from './getSSMVariable'

export async function sendSlackMessage(
  text: string,
  idsAttemptedToUpdate?: string[],
  idsFailedToUpdate?: string[],
  idsInDynamoDb?: Set<string>,
  idsInOpenSearch?: Set<string>,
) {
  console.log(
    `\ntext: ${text}, \nidsAttemptedToUpdate: ${idsAttemptedToUpdate}, \nidsFailedToUpdate: ${idsFailedToUpdate}`,
  )

  const SLACK_TOKEN = await getSSMVariable('SLACK_BOT_TOKEN')
  const CHANNEL_ID = 'C05T3S3JY6R' // nightly-data-update channel

  if (!SLACK_TOKEN) {
    throw new Error('Slack bot token not found')
  }

  const fileIds: string[] = []

  // If idsAttemptedToUpdate are provided, upload them as a .csv file
  if (idsAttemptedToUpdate && idsAttemptedToUpdate.length > 0) {
    const idsAttemptedToUpdateFileId = await uploadIdsToSlack(
      'idsAttemptedToUpdate',
      idsAttemptedToUpdate,
      SLACK_TOKEN,
      CHANNEL_ID,
    )
    fileIds.push(idsAttemptedToUpdateFileId)
  }

  if (idsFailedToUpdate && idsFailedToUpdate.length > 0) {
    const idsFailedToUpdateFileId = await uploadIdsToSlack(
      'idsFailedToUpdate',
      idsFailedToUpdate,
      SLACK_TOKEN,
      CHANNEL_ID,
    )
    fileIds.push(idsFailedToUpdateFileId)
  }

  // if either idsAttemptedToUpdate or idsFailedToUpdate are provided, upload idsInDynamoDb and idsInOpenSearch
  if (idsAttemptedToUpdate?.length || idsFailedToUpdate?.length) {
    const idsInDynamoDbFileId = await uploadIdsToSlack(
      'idsInDynamoDb',
      [...(idsInDynamoDb ?? [])],
      SLACK_TOKEN,
      CHANNEL_ID,
    )
    fileIds.push(idsInDynamoDbFileId)

    const idsInOpenSearchFileId = await uploadIdsToSlack(
      'idsInOpenSearch',
      [...(idsInOpenSearch ?? [])],
      SLACK_TOKEN,
      CHANNEL_ID,
    )
    fileIds.push(idsInOpenSearchFileId)
  }

  const attachments = fileIds.map((fileId) => ({ file_id: fileId }))

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

async function uploadIdsToSlack(prefix: string, ids: string[], token: string, channelId: string): Promise<string> {
  const csvContent = `${prefix}\n` + ids.join('\n')
  const csvBuffer = Buffer.from(csvContent, 'utf8')

  const formData = new FormData()
  formData.append('token', token)
  formData.append('channels', channelId)
  formData.append('filename', `${prefix}.csv`)
  formData.append('filetype', 'csv')
  formData.append('file', csvBuffer, {
    filename: `${prefix}.csv`,
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

  return fileResponse.data.file.id
}
