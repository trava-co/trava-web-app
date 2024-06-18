import OpenAI from 'openai'
import { getSSMVariable } from '../getSSMVariable'

let openaiInstance: OpenAI | null = null

export async function getOpenAIClient() {
  if (openaiInstance) {
    return openaiInstance
  }

  const OPENAI_API_KEY = await getSSMVariable('OPENAI_API_KEY')
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }

  openaiInstance = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })

  return openaiInstance
}
