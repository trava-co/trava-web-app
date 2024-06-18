interface ErrorLog {
  error: Error
  context?: string
  shouldThrow?: boolean
  errorLogPath?: string
}

export const logError = async ({ error, context, shouldThrow }: ErrorLog) => {
  console.error(`Error: ${context ?? error.message}, timestamp: ${new Date().toISOString()}`)
  if (shouldThrow) {
    throw error
  }
}
