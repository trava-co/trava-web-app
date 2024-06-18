import { logError } from '../logError'
import * as ChatErrors from './ChatErrors'
import { APIError } from 'openai/error'

// Define function for exponential backoff
async function retryOpenAIWithExponentialBackoff(
  func: () => Promise<any>,
  initialDelay: number = 1,
  exponentialBase: number = 2,
  jitter: boolean = true,
  maxRetries: number = 5,
) {
  let delay = initialDelay
  let retries = 0

  while (true) {
    try {
      return await func()
    } catch (error) {
      retries++

      if (
        // if it's a 429 error, we should attempt more retries
        (retries > maxRetries && error instanceof APIError && error?.status !== 429) ||
        retries > 8
      ) {
        await logError({
          error: error as Error,
          context: `MAX RETRIES (${maxRetries}) EXCEEDED. THROWING ERROR.`,
          shouldThrow: true,
        })
      } else {
        logError({
          error: error as Error,
          context: `retryOpenAIWithExponentialBackoff: retrying in ${delay} seconds.`,
        })
      }

      if (jitter) {
        delay *= exponentialBase * (1 + Math.random())
      } else {
        delay *= exponentialBase
      }

      await new Promise((resolve) => setTimeout(resolve, delay * 1000))
    }
  }
}

export { retryOpenAIWithExponentialBackoff, ChatErrors }
