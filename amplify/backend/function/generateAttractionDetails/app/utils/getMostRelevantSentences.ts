import { createEmbeddings } from './createEmbeddings'
import { cosineSimilarity } from './cosineSimilarities'
import SentenceTokenizer from 'sentence-tokenizer'
import { doQuestionEmbeddings, eatQuestionEmbeddings } from '../embeddings'
import { ATTRACTION_TYPE } from 'shared-types/API'
import { logError } from './logError'

const sentenceTokenizer = new SentenceTokenizer()

export interface SegmentWithEmbeddings {
  segment: string
  embedding: number[]
}

interface GetSentenceRelevantMapInput {
  segmentsWithEmbeddings: SegmentWithEmbeddings[]
  questionsWithEmbeddings: SegmentWithEmbeddings[]
  attractionId: string
  attractionName: string
  destinationName: string
}

/** Returns an obj with keys = questions, and each question has a value of an obj with keys = sentence text & val = max relevance score to the question */
export async function getSentenceRelevanceMapFromEmbeddings({
  segmentsWithEmbeddings,
  questionsWithEmbeddings,
  attractionId,
  attractionName,
  destinationName,
}: GetSentenceRelevantMapInput): Promise<Record<string, Record<string, number>>> {
  const questionEmbeddings = questionsWithEmbeddings.map((q) => q.embedding)

  if (!questionEmbeddings || questionEmbeddings.some((e) => !e)) {
    throw new Error(`questionEmbeddings contains falsy values: ${questionEmbeddings}`)
  }

  // Step 1: Get top 30 most relevant segments as measured by similarity to any one question
  const segmentsAndRelevanceScore = segmentsWithEmbeddings.map(({ segment, embedding: segmentEmbedding }) => {
    if (!segmentEmbedding) {
      console.error(`segmentEmbedding is falsy: ${segmentEmbedding}`)
      return { segment, score: 0 }
    }

    // score the segment by its highest similarity to any question
    const maxSimilarity = Math.max(
      ...questionEmbeddings.map((questionEmbedding) => cosineSimilarity(segmentEmbedding, questionEmbedding)),
    )
    return { segment, score: maxSimilarity }
  })

  // sort the segments by their maximum similarity to any question
  const sortedSegmentsByRelevance = segmentsAndRelevanceScore.sort((a, b) => b.score - a.score)

  // get the top 30 most relevant segments
  const mostRelevantSegments = sortedSegmentsByRelevance.slice(0, 30).map((item) => item.segment)

  // we've reduced the universe of segments to 30. now, process in greater detail by evaluating each sentence within.

  // Tokenize to sentences
  sentenceTokenizer.setEntry(mostRelevantSegments.join(' '))
  const sentences = sentenceTokenizer.getSentences()
  let sentenceEmbeddings: number[][] = []
  try {
    sentenceEmbeddings = await createEmbeddings({
      input: sentences,
      attractionId,
      attractionName,
      destinationName,
      context: 'get sentence embeddings',
    })
  } catch (error) {
    console.error('Error creating embeddings for getSentenceRelevanceMapFromEmbeddings')
    throw error
  }

  // Step 2: Compute relevanceMap
  const relevanceMap: Record<string, Record<string, number>> = {}

  for (const { segment: question, embedding: questionEmbedding } of questionsWithEmbeddings) {
    const sentenceScores: Record<string, number> = {}

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i]
      const sentenceEmbedding = sentenceEmbeddings[i]
      const score = cosineSimilarity(sentenceEmbedding, questionEmbedding)
      sentenceScores[sentence] = score
    }

    // Sort sentences by score for this question
    const sortedSentences = Object.entries(sentenceScores).sort((a, b) => b[1] - a[1])

    // Store sorted sentences and their scores in relevanceMap
    relevanceMap[question] = Object.fromEntries(sortedSentences)
  }

  return relevanceMap
}

const questionsDoOrEatEmbeddings = {
  DO: doQuestionEmbeddings,
  EAT: eatQuestionEmbeddings,
}

// [{segment: "what's the atmosphere like?", embedding: [0.1, 0.2, 0.3]}, ...}]
const questionsWithEmbeddings = {
  DO: Object.entries(questionsDoOrEatEmbeddings[ATTRACTION_TYPE.DO]).map(([question, embedding]) => ({
    segment: question,
    embedding,
  })),
  EAT: Object.entries(questionsDoOrEatEmbeddings[ATTRACTION_TYPE.EAT]).map(([question, embedding]) => ({
    segment: question,
    embedding,
  })),
}

interface IGetSentenceRelevanceMapInput {
  segments: string[]
  attractionId: string
  attractionName: string
  destinationName: string
  attractionType: ATTRACTION_TYPE
}

export async function getSentenceRelevanceMap({
  segments,
  attractionId,
  attractionName,
  destinationName,
  attractionType,
}: IGetSentenceRelevanceMapInput) {
  // math representation of each chunk of text
  let segmentEmbeddings: number[][] = []
  try {
    segmentEmbeddings = await createEmbeddings({
      input: segments,
      attractionId,
      attractionName,
      destinationName,
      context: `${attractionName} in ${destinationName}: Relevant text embeddings`,
    })
  } catch (error) {
    await logError({
      error: error as Error,
      context: `CreateEmbeddingsError for ${attractionName} in ${destinationName}`,
      shouldThrow: true,
    })
  }

  // [{segment: "casual atmosphere", embedding: [0.1, 0.2, 0.3]}, ...}]
  const segmentsWithEmbeddings = segments.map((segment, index) => ({
    segment,
    embedding: segmentEmbeddings[index],
  }))

  // {"what's the atmosphere like?": {"casual atmosphere": 0.98, ...} ...}
  let relevanceMap = {}
  try {
    relevanceMap = await getSentenceRelevanceMapFromEmbeddings({
      segmentsWithEmbeddings,
      questionsWithEmbeddings: questionsWithEmbeddings[attractionType],
      attractionId,
      attractionName,
      destinationName,
    })
  } catch (error) {
    await logError({
      error: error as Error,
      context: `getSentenceRelevanceMapFromEmbeddings for ${name} in ${destinationName}`,
      shouldThrow: true,
    })
  }

  return relevanceMap
}
