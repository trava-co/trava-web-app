import { ChatCompletionContentPart } from 'openai/resources/chat'
import { ATTRACTION_CATEGORY_TYPE, ATTRACTION_CUISINE_TYPE } from 'shared-types/API'

export enum CHAT_MODELS {
  GPT_3 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  NEW_GPT_3 = 'gpt-3.5-turbo-1106',
  NEW_GPT_4 = 'gpt-4-1106-preview',
}

export enum EMBEDDINGS_MODELS {
  ADA_2 = 'text-embedding-ada-002',
  SMALL = 'text-embedding-3-small',
  LARGE = 'text-embedding-3-large',
}

export type OpenAITokenTracker = {
  currentRequest: {
    estimatedCost: number
    inputTokensUsed: number
    outputTokensUsed: number
    model: string
  }
  cumulative: {
    estimatedCost: number
    inputTokensUsed: number
    outputTokensUsed: number
    requestsMade: number
  }
  timestamp: Date
  firstMessageContent: string | ChatCompletionContentPart[]
  context: string
  logging?: boolean
}

export enum AboutBusinessInputKeys {
  FROM_THE_BUSINESS = 'fromTheBusiness',
  SERVICE_OPTIONS = 'serviceOptions',
  HIGHLIGHTS = 'highlights',
  POPULAR_FOR = 'popularFor',
  ACCESSIBILITY = 'accessibility',
  OFFERINGS = 'offerings',
  DINING_OPTIONS = 'diningOptions',
  AMENITIES = 'amenities',
  ATMOSPHERE = 'atmosphere',
  CROWD = 'crowd',
  CHILDREN = 'children',
  PLANNING = 'planning',
  PAYMENTS = 'payments',
}

export type AttractionCategoryOrCuisineType = ATTRACTION_CATEGORY_TYPE | ATTRACTION_CUISINE_TYPE

export const UNKNOWN = 'UNKNOWN'

export const OTHER_DESTINATION_ID = '7cd39ab7-f703-45a0-8d4d-3732410f711f'
