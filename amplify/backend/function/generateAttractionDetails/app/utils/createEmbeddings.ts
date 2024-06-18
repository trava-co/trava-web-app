import { getOpenAIClient } from './openai/getOpenAIClient'
import { CreateEmbeddingsError } from './TravaCardCreationErrors'
import { OpenAITokenTracker, EMBEDDINGS_MODELS } from './constants'
import { logError } from './logError'

const MAX_TOKENS = 8192 * 0.5 // 50% of the max tokens, just to be safe. we should be charged by the number of tokens used, not the number of requests, anyways.

const TOKENS_PER_WORD = 4 / 3

export const MAX_WORDS = MAX_TOKENS * (1 / TOKENS_PER_WORD) // 100 tokens = 75 words

const COST_PER_ADA_TOKEN = 0.00002 / 1000 // $0.00002 per 1000 tokens

let lastTokenTracker: OpenAITokenTracker | null = null

const MAX_RETRIES = 3 // Define your maximum retries

interface CreateEmbeddingsInput {
  input: string[]
  attractionId: string
  attractionName: string
  destinationName: string
  context: string
  logging?: boolean
}

export async function createEmbeddings({
  input,
  attractionId,
  attractionName,
  destinationName,
  context,
  logging = false,
}: CreateEmbeddingsInput) {
  // if blank input, return empty array
  if (input.length === 0) {
    throw new CreateEmbeddingsError({
      message: 'input to create embeddings is empty',
      attractionId,
      attractionName,
      destinationName,
    })
  }

  const openai = await getOpenAIClient()
  // in each request, we can only send 8192 tokens
  // so we need to split the input into batches of 8192 tokens
  // and then send each batch separately
  let batches: string[][] = []
  let currentBatch: string[] = []

  for (let i = 0; i < input.length; i++) {
    // each i is one input and should return one embedding
    const currentInput = input[i]

    const currentInputWords = currentInput.split(' ').length

    if (currentBatch.join(' ').split(' ').length + currentInputWords <= MAX_WORDS) {
      // if the currentBatch is not full, and can fit the current input, add the current input to the batch
      currentBatch.push(currentInput)
    } else {
      // if the currentBatch is full, send the batch and reset the batch
      batches.push(currentBatch)
      currentBatch = [currentInput] // start a new batch with the current input
    }
  }

  // if there are any remaining inputs in the currentBatch, send them
  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  const currentRequestTotalTokens = Math.ceil(
    batches
      .map((batch) => batch.join(' ').split(' ').length * TOKENS_PER_WORD)
      .reduce((total, current) => total + current, 0),
  )

  const newTokenTracker: OpenAITokenTracker = {
    timestamp: new Date(),
    currentRequest: {
      estimatedCost: currentRequestTotalTokens * COST_PER_ADA_TOKEN,
      inputTokensUsed: currentRequestTotalTokens,
      outputTokensUsed: 0, // embeddings api only charges for input tokens
      model: EMBEDDINGS_MODELS.SMALL,
    },
    cumulative: {
      estimatedCost: (lastTokenTracker?.cumulative.estimatedCost ?? 0) + currentRequestTotalTokens * COST_PER_ADA_TOKEN,
      inputTokensUsed: (lastTokenTracker?.cumulative.inputTokensUsed ?? 0) + currentRequestTotalTokens,
      requestsMade: (lastTokenTracker?.cumulative.requestsMade ?? 0) + batches.length,
      outputTokensUsed: 0, // embeddings api only charges for input tokens
    },
    firstMessageContent: input[0],
    context,
  }
  lastTokenTracker = newTokenTracker

  logging && console.log(`\n\nADA embeddings token tracker: ${JSON.stringify(newTokenTracker, null, 2)}\n\n`)

  async function withExponentialBackoff(fn: () => Promise<any>, retries = MAX_RETRIES) {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0) {
        throw error
      }
      const delay = 1000 * 2 ** (MAX_RETRIES - retries)
      logError({
        error: error as Error,
        context: `createEmbeddings for ${attractionName} in ${destinationName}: retrying in ${delay} ms.`,
      })
      await new Promise((res) => setTimeout(res, delay))
      return withExponentialBackoff(fn, retries - 1)
    }
  }

  // send each batch and get the embeddings
  const batchEmbeddings: number[][][] = await Promise.all(
    batches.map((batch) =>
      withExponentialBackoff(async () => {
        const response = await openai.embeddings.create({
          model: EMBEDDINGS_MODELS.SMALL,
          input: batch,
        })
        return response.data.map((el) => el.embedding)
      }),
    ),
  )

  // flatten the batchEmbeddings array
  const embeddings = batchEmbeddings.flat()

  if (embeddings.length !== input.length) {
    throw new CreateEmbeddingsError({
      message: `generated embeddings length (${embeddings.length}) does not match input length (${input.length}`,
      attractionId,
      attractionName,
      destinationName,
    })
  }

  return embeddings
}
