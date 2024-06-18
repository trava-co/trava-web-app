export async function retryWithExponentialBackoff({
  func,
  initialDelay = 2,
  exponentialBase = 2,
  jitter = true,
  maxRetries = 2,
}: {
  func: () => Promise<any>
  initialDelay?: number
  exponentialBase?: number
  jitter?: boolean
  maxRetries?: number
}) {
  let delay = initialDelay
  let retries = 0

  while (true) {
    try {
      return await func()
    } catch (error) {
      console.log(`Failed attempt ${retries}: ${error}`)
      retries++

      if (retries > maxRetries) {
        console.log(`Max retries exceeded, throwing error: ${error}`)
        throw error
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
