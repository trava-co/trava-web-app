import axios from 'axios'
import { getSSMVariable } from './getSSMVariable'
import FormData from 'form-data'

interface ISendSlackMessage {
  text: string
  newUsersCsv: string
  userSessionsCsv: string
  newAttractionSwipesCsv: string
  newAttractionSwipesByDestinationCsv: string
  attractionsCreatedByDestinationCsv: string
  attractionsCreatedByUserCsv: string
  itineraryFirstTimeViewsCsv: string
}

export async function sendSlackMessage({
  text,
  newUsersCsv,
  userSessionsCsv,
  newAttractionSwipesCsv,
  newAttractionSwipesByDestinationCsv,
  attractionsCreatedByDestinationCsv,
  attractionsCreatedByUserCsv,
  itineraryFirstTimeViewsCsv,
}: ISendSlackMessage): Promise<void> {
  console.log(`text: ${text}`)
  const SLACK_TOKEN = await getSSMVariable('SLACK_BOT_TOKEN')
  const CHANNEL_ID = 'C06EZAKMK4M' // key-metrics channel

  // Headers for CSV files
  const newUsersHeader = 'User ID, Username, Name, Email, Phone \n'
  const userSessionsHeader = 'Session ID, User ID, Username, Name, Email, Device, Version, Initial open time\n'
  const newAttractionSwipesHeader = 'User ID, Username, Name, Email, Swipe Count\n'
  const newAttractionSwipesByDestinationHeader = 'Destination ID, Destination Name, Swipe Count\n'
  const attractionsCreatedByDestinationCsvHeader =
    'Destination ID, Destination Name, User Attractions Created, Admin Attractions Created\n'
  const userAttractionsHeader = 'User ID, Username, Name, Email, Created Attractions\n'
  const itineraryFirstTimeViewsHeader =
    'User ID, Username, Name, Email, Trip ID, Destination ID, Destination Name, TripPlanViewedAt\n'

  // Combine headers with CSV content
  const newUsersCsvWithHeader = newUsersHeader + newUsersCsv
  const userSessionsCsvWithHeader = userSessionsHeader + userSessionsCsv
  const newAttractionSwipesCsvWithHeader = newAttractionSwipesHeader + newAttractionSwipesCsv
  const newAttractionSwipesByDestinationCsvWithHeader =
    newAttractionSwipesByDestinationHeader + newAttractionSwipesByDestinationCsv
  const attractionsCreatedByDestinationCsvWithHeader =
    attractionsCreatedByDestinationCsvHeader + attractionsCreatedByDestinationCsv
  const attractionsCreatedByUserCsvWithHeader = userAttractionsHeader + attractionsCreatedByUserCsv
  const itineraryFirstTimeViewsCsvWithHeader = itineraryFirstTimeViewsHeader + itineraryFirstTimeViewsCsv

  // Filenames for each CSV file
  const filenames = [
    'new_user_ids.csv',
    'user_sessions.csv',
    'new_attraction_swipes.csv',
    'new_swipes_by_destination.csv',
    'new_attractions_by_destination.csv',
    'new_attractions_created_by_user.csv',
    'itinerary_view_user_ids.csv',
  ]
  const csvContents = [
    newUsersCsvWithHeader,
    userSessionsCsvWithHeader,
    newAttractionSwipesCsvWithHeader,
    newAttractionSwipesByDestinationCsvWithHeader,
    attractionsCreatedByDestinationCsvWithHeader,
    attractionsCreatedByUserCsvWithHeader,
    itineraryFirstTimeViewsCsvWithHeader,
  ]

  // Send initial message
  const messageResponse = await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel: CHANNEL_ID,
      text,
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

  const threadTimestamp = messageResponse.data.ts

  // Upload files in a thread
  for (let i = 0; i < csvContents.length; i++) {
    const fileContent = csvContents[i]
    if (fileContent) {
      const csvBuffer = Buffer.from(fileContent, 'utf8')
      const formData = new FormData()
      formData.append('token', SLACK_TOKEN)
      formData.append('channels', CHANNEL_ID)
      formData.append('thread_ts', threadTimestamp)
      formData.append('filename', filenames[i])
      formData.append('filetype', 'csv')
      formData.append('file', csvBuffer, {
        filename: filenames[i],
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
    }
  }
}
