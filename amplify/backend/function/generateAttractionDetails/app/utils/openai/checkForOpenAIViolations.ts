import { getOpenAIClient } from './getOpenAIClient'
// @ts-ignore
import Filter from 'bad-words'

const filter = new Filter()

// query the openai moderation api to check for any violations with the input text.
export async function checkForOpenAIViolations(input: string): Promise<boolean> {
  const openai = await getOpenAIClient()
  try {
    console.log('checking for violations in input to openai...')
    const response = await openai.moderations.create({
      input,
    })
    // console.log(`Response from moderation API: ${JSON.stringify(response)}`)
    const flagged = response.results[0].flagged
    if (flagged) {
      console.log(`Input was flagged by OpenAI's moderation API. Attempting to clean...`)
      filter.clean(input)
      console.log(`Cleaned input`)
      const responseNew = await openai.moderations.create({
        input,
      })
      return responseNew.results[0].flagged
    }
  } catch (error) {
    console.error(JSON.stringify(error))
    console.error(`Error checking for violations with input: ${input}`)
    throw error
  }

  return false
}
