import axios from 'axios'
import { getSSMVariable } from './getSSMVariable'

type ConversationOptions = {
  conversationId: string
  clientId: string
  conversationSignature: string
}

export type BingChatResponse = {
  text: string
  conversationOptions: ConversationOptions
}

type BingChatExtendedResponse = {
  conversationId: string
  encryptedConversationSignature: string
  clientId: string
  invocationId: number
  conversationExpiryTime: string
  response: string
}

async function askBingChat(message: string): Promise<BingChatResponse> {
  const POLL_INTERVAL = 15000 // 15 seconds
  const MAX_ATTEMPTS = 10 // 150 seconds total

  console.log(`sending message to bing.`)

  let job: any

  const bingAIUrl = await getSSMVariable('BING_AI_URL')

  // send a message to Bing and get the job ID
  try {
    job = await axios.post(
      `${bingAIUrl}/job`,
      {
        message,
        toneStyle: 'precise',
        jailbreakConversationId: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error(`Failed to post job: ${error}`)
    throw error
  }

  const jobId = job.data.id
  console.log(`received job id from bing: ${jobId}`)

  // poll the /job/:id endpoint for the result
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await axios.get(`${bingAIUrl}/job/${jobId}`)

    if (res.data.state === 'completed') {
      const result = res.data.result as BingChatExtendedResponse

      if (!result.response?.length ?? 0 < 5) {
        throw new Error(`Bing chat response was too short: ${result.response}`)
      }

      console.log(`received response from bing. response text: ${result.response}`)

      return {
        text: result.response,
        // return the conversationOptions so that we can continue the conversation
        conversationOptions: {
          conversationId: result.conversationId,
          clientId: result.clientId,
          conversationSignature: result.encryptedConversationSignature,
        },
      }
    }

    // wait before the next attempt
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  throw new Error('Job did not complete in the expected time')
}

export { askBingChat }
