import { askOpenAIChat } from '../openai/askOpenAIChat'
import { getInputToDescriptionLongPrompt, getTravaDescriptionLongPrompt } from '../prompts/descriptionLong'
import { checkForOpenAIViolations } from '../openai/checkForOpenAIViolations'
import { getTravaDescriptionShortPrompt } from '../prompts/descriptionShort'
import { CHAT_MODELS } from '../constants'
import { ATTRACTION_TYPE } from 'shared-types/API'
import { questions } from '../prompts/questions'
import { RelevantInputText, buildRelevantInputText } from '../buildRelevantInputText'
import { TravaDescriptionError } from '../TravaCardCreationErrors'

const BUFFER = 100 // margin of error for response tokens
const RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3 = 500 + BUFFER // 500 tokens
const RESPONSE_TOKENS_LONG_DESCRIPTION_GPT4 = 300 + BUFFER // About 225 words, more than enough for 4-5 sentences
const RESPONSE_TOKENS_SHORT_DESCRIPTION = 100 + BUFFER // About 75 words, more than enough for 1-2 sentences

interface GenerateTravaDescriptionsInput {
  attractionId: string
  attractionName: string
  destinationName: string
  attractionType: ATTRACTION_TYPE
  currentInputForSummary: string
  relevanceMap: Record<string, Record<string, number>>
}

export async function generateTravaDescriptions({
  attractionId,
  attractionName,
  destinationName,
  attractionType,
  currentInputForSummary,
  relevanceMap,
}: GenerateTravaDescriptionsInput) {
  console.log(`generateTravaDescriptions for ${attractionName} in ${destinationName}`)

  // only feed relevant questions responses to chatbot, to avoid discussion on logistics
  let relevantQuestions: string[] = []
  if (attractionType === ATTRACTION_TYPE.DO) {
    relevantQuestions = [
      questions[attractionType].UNIQUE,
      questions[attractionType].HIGHLIGHTS,
      questions[attractionType].LOCAL_TRADITION,
    ]
  } else {
    relevantQuestions = [
      questions[attractionType].UNIQUE,
      questions[attractionType].EXPERIENCE,
      questions[attractionType].SIGNATURE_DISHES,
      questions[attractionType].INTERIOR,
    ]
  }

  // get the relevance map for only the relevant questions
  const relevanceMapRelevantQuestions = Object.entries(relevanceMap).filter(([question]) =>
    relevantQuestions.includes(question),
  )

  // prepare the input, using the most relevant sentences
  const allSentenceScores: { sentence: string; score: number }[] = []
  for (const [question, sentenceScores] of relevanceMapRelevantQuestions) {
    for (const [sentence, score] of Object.entries(sentenceScores)) {
      allSentenceScores.push({ sentence, score })
    }
  }

  const sortedAllSentenceByScores = allSentenceScores.sort((a, b) => b.score - a.score).map(({ sentence }) => sentence)

  // Deduplicate sentences
  const dedupedSortedSentences = Array.from(new Set(sortedAllSentenceByScores))

  // From all the reviews, construct the relevant input to get 30 bullets from gpt-3.5 about the restaurant, which will be used to generate the long description with gpt-4
  const buildChatThreadForLongDescription = (inputWithNewSentence: string) => {
    return getInputToDescriptionLongPrompt(attractionType, inputWithNewSentence)
  }

  // input to get our bulleted list of 30 bullets
  let inputToGetSummary: RelevantInputText

  try {
    inputToGetSummary = buildRelevantInputText({
      relevantSentences: dedupedSortedSentences,
      buildChatThread: buildChatThreadForLongDescription,
      inputThatMustBeIncluded: currentInputForSummary,
      responseTokens: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3,
    })
  } catch (error) {
    console.error('Error when assembling input to create descriptions')
    throw error
  }

  const { messages: messagesInputToGetSummary } = inputToGetSummary

  console.log('Checking for OpenAI violations...')
  // query moderation api to check for violations
  const flagged = await checkForOpenAIViolations(messagesInputToGetSummary.join(' '))
  if (flagged) {
    throw new TravaDescriptionError({
      message: 'OpenAI flagged the description as inappropriate',
      attractionId,
      attractionName,
      destinationName,
    })
  }
  console.log('No violations found.')

  let inputToDescriptionLong = ''

  try {
    inputToDescriptionLong = await askOpenAIChat({
      messages: messagesInputToGetSummary,
      temperature: 0,
      model: CHAT_MODELS.NEW_GPT_3,
      maxTokensForAnswer: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3,
      context: `${attractionName} in ${destinationName}: inputToDescriptionLong`,
    })
  } catch (error) {
    console.error('Error querying OpenAI to create input to long description with GPT3.5')
    throw error
  }

  const descriptionLongPrompt = getTravaDescriptionLongPrompt(attractionName, attractionType, inputToDescriptionLong)

  let descriptionLong = ''
  try {
    descriptionLong = await askOpenAIChat({
      messages: descriptionLongPrompt,
      model: CHAT_MODELS.NEW_GPT_4,
      temperature: 0.8,
      topP: 0.8,
      maxTokensForAnswer: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT4,
      context: `${attractionName} in ${destinationName}: descriptionLong`,
    })
  } catch (error) {
    console.error('Error querying OpenAI to create edited long description with GPT4')
    throw error
  }

  const messagesShortDescription = getTravaDescriptionShortPrompt(attractionType, descriptionLong)

  let descriptionShort = ''

  try {
    descriptionShort = await askOpenAIChat({
      messages: messagesShortDescription,
      temperature: 0.85,
      model: CHAT_MODELS.NEW_GPT_4,
      maxTokensForAnswer: RESPONSE_TOKENS_SHORT_DESCRIPTION,
      context: `${attractionName} in ${destinationName}: descriptionShort`,
    })
  } catch (error) {
    console.error('Error querying OpenAI to create short description with GPT4')
    throw error
  }

  // if descriptionShort starts or ends with quotes, remove them:
  if (descriptionShort.startsWith('"') && descriptionShort.endsWith('"')) {
    descriptionShort = descriptionShort.substring(1, descriptionShort.length - 1)
  }

  // correct for over-exuberance: if string ends with !, replace with .
  if (descriptionShort.endsWith('!')) {
    descriptionShort = descriptionShort.substring(0, descriptionShort.length - 1) + '.'
  }

  return {
    inputToSummary: inputToDescriptionLong,
    inputToDescriptionLong,
    descriptionLong,
    descriptionShort,
  }
}
