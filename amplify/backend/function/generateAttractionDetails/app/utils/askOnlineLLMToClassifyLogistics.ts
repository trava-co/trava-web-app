import axios from 'axios'
import { withExponentialBackoff } from './withExponentialBackoff'
import { getSSMVariable } from './getSSMVariable'

interface IAskOnlineLLMToClassifyLogisticsInput {
  attractionName: string
  destinationName: string
}

export async function askOnlineLLMToClassifyLogistics({
  attractionName,
  destinationName,
}: IAskOnlineLLMToClassifyLogisticsInput) {
  const PERPLEXITY_API_KEY = await getSSMVariable('PERPLEXITY_API_KEY')
  // divide questions into two subsets: first two questions and remaining questions
  // then, ask each in sequence, waiting for the first to complete before asking the second
  // use withExponentialBackoff to retry each request up to 3 times, with delays of 3 seconds, 6 seconds, and 12 seconds
  // if either request fails more than 3 times, throw an error. otherwise, concatenate the responses and return them
  const firstQuestionSubset = questions.slice(0, 2)
  const secondQuestionSubset = questions.slice(2)

  const input = {
    attractionName,
    destinationName,
    PERPLEXITY_API_KEY,
  }
  const firstSubsetResponse = await askWithBackoff({ ...input, questionSubset: firstQuestionSubset, subsetIndex: 1 })
  const secondSubsetResponse = await askWithBackoff({ ...input, questionSubset: secondQuestionSubset, subsetIndex: 2 })

  const response = firstSubsetResponse + secondSubsetResponse
  console.log(`Response from Perplexity: \n${response}`)

  return response
}

interface IAskWithBackoffInput extends IPostChatCompletionInput {
  subsetIndex: number
}
// Updated function to handle the exponential backoff and errors
const askWithBackoff = async ({
  attractionName,
  destinationName,
  questionSubset,
  PERPLEXITY_API_KEY,
  subsetIndex,
}: IAskWithBackoffInput): Promise<string> => {
  try {
    return await withExponentialBackoff({
      func: () =>
        askPerplexity({
          attractionName,
          destinationName,
          questionSubset,
          PERPLEXITY_API_KEY,
        }),
      maxRetries: 3,
      delay: 3000,
    })
  } catch (error) {
    // Log the error and rethrow with additional context
    console.error(`Error during askWithBackoff for subset ${subsetIndex}:`, error)
    throw new Error(`Error asking online LLM to classify logistics for subset ${subsetIndex}: ${error}`)
  }
}

interface IPostChatCompletionInput extends IFormatQuestionsContentInput {
  PERPLEXITY_API_KEY: string
}

const askPerplexity = async ({
  attractionName,
  destinationName,
  questionSubset,
  PERPLEXITY_API_KEY,
}: IPostChatCompletionInput) => {
  const question = formatQuestionsContent({ attractionName, destinationName, questionSubset })

  console.log(`Asking Perplexity: \n${question}`)

  const apiUrl = 'https://api.perplexity.ai/chat/completions'
  const payload = {
    model: 'llama-3-sonar-large-32k-online',
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
    temperature: 0,
  }

  const headers = {
    Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  }

  const response = await axios.post(apiUrl, payload, { headers: headers })
  const responseText = response.data.choices[0].message.content as string

  // if response is fewer than 10 characters, it's probably an error message, so throw an error
  if (responseText.length < 10) {
    throw new Error(`Perplexity API returned too short a response: ${responseText}`)
  }

  return responseText
}

interface IFormatQuestionsContentInput {
  attractionName: string
  destinationName: string
  questionSubset: Question[]
}

// Function to format questions into a content string
function formatQuestionsContent({ attractionName, destinationName, questionSubset }: IFormatQuestionsContentInput) {
  let content = `Concisely answer the following questions about "${attractionName}" in ${destinationName}. If you can't find information, take a logical guess.\n\n`

  questionSubset.forEach((question, index) => {
    const optionsText = question.options?.join(', ') ?? ''
    content += `${index + 1}. ${question.questionText} ${optionsText}\n\n`
  })

  return content
}

type Question = {
  questionId: string
  questionText: string
  options?: string[]
}

const questions: Question[] = [
  {
    questionId: 'reservationPolicy',
    questionText: 'Is it necessary to make a reservation in advance?',
  },
  {
    questionId: 'costPerPerson',
    questionText:
      'Is a ticket or admission fee required to visit? If so, approximately how much does it cost per person:',
    options: ['free', 'under $25', '$25-$50', '$50-$75', 'more than $75'],
  },
  {
    questionId: 'greatFor',
    questionText: 'Which groups would this attraction be great for? Select all that apply:',
    options: [
      'couples',
      'large groups',
      'kids',
      'pets',
      'bachelorette parties (raucous groups who enjoy drinking)',
      'indoor activities for rainy days',
    ],
  },
  {
    questionId: 'categories',
    questionText:
      'Select a primary category and if it makes sense, a secondary category, that best describes this attraction:',
    options: [
      'action & physical activity (involving hiking, biking, or other physical activity)',
      'arts & museums',
      'entertainment',
      'leisure',
      'nature',
      'bars drinking & nightlife',
      'shopping',
      'sights & landmarks',
    ],
  },
]
