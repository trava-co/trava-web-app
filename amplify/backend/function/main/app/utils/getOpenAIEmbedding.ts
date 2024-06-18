import { OpenAIApi, Configuration } from 'openai'
import { getSSMVariable } from './getSSMVariable'

const getOpenAIEmbedding = async (searchString: string): Promise<number[]> => {
  const apiKey = await getSSMVariable('OPENAI_API_KEY')

  const openaiConfig = new Configuration({
    apiKey,
  })

  const openai = new OpenAIApi(openaiConfig)

  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-3-large',
      input: searchString,
    })
    return response.data.data[0].embedding
  } catch (error) {
    console.log('[createEmbeddings error]', error)
    throw new Error('Error creating embedding')
  }
}

export default getOpenAIEmbedding
