import { sleep } from './sleep'

interface Input {
  func: () => Promise<any>
  maxRetries?: number
  cleanup?: () => Promise<any>
  delay?: number // in milliseconds
}

export async function withExponentialBackoff({
  func,
  maxRetries = 5,
  cleanup,
  delay = 1000, // 1 second
}: Input) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func()
    } catch (error) {
      if (cleanup) {
        await cleanup()
      }
      if (i === maxRetries - 1) {
        throw error // If we're out of retries, throw the error
      }
      console.log(`Error: ${error}. Retrying in ${delay / 1000} seconds...`)
      await sleep(delay)
      delay *= 2 // Double the delay
    }
  }
}
