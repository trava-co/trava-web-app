import { ScheduledEvent, ScheduledHandler } from 'aws-lambda'
import tearex from 'tearex'
import chunk from 'lodash.chunk'
import { getSSMVariable } from './utils/getSSMVariable'
import getAllAttractionsFromPastWeek from './utils/getAllAttractionsFromPastWeek'
import getAllUsersFromPastWeek from './utils/getAllUsersFromPastWeek'
import getAllPostsFromPastWeek from './utils/getAllPostsFromPastWeek'

const CHUNK_SIZE = 20

export const handler: ScheduledHandler = async (event: ScheduledEvent) => {
  console.log('ensureTearexEntitiesExist start:')
  const TEAREX_URL = await getSSMVariable('TEAREX_URL')
  const TEAREX_API_KEY = await getSSMVariable('TEAREX_API_KEY')
  const ENV = process.env.ENV

  if (!ENV) {
    throw new Error('No ENV set')
  }

  if (!TEAREX_URL || !TEAREX_API_KEY) {
    throw new Error('Secrets not found')
  }

  tearex.init({
    url: TEAREX_URL,
    apiKey: TEAREX_API_KEY,
    stage: process.env.ENV,
  })

  const attractions = await getAllAttractionsFromPastWeek()
  const users = await getAllUsersFromPastWeek()
  const posts = await getAllPostsFromPastWeek()

  const chunkedAttractions = chunk(attractions, CHUNK_SIZE)
  const chunkedUsers = chunk(users, CHUNK_SIZE)
  const chunkedPosts = chunk(posts, CHUNK_SIZE)

  for (const chunk of chunkedUsers) {
    await tearex.batchCreateEntities(
      chunk.map((user) => ({
        id: user.id,
        label: 'User',
      })),
    )
  }

  for (const chunk of chunkedPosts) {
    await tearex.batchCreateEntities(
      chunk.map((post) => ({
        id: post.id,
        label: 'Post',
      })),
    )
  }

  for (const chunk of chunkedAttractions) {
    await tearex.batchCreateEntities(
      chunk.map((attraction) => ({
        id: attraction.id,
        label: 'Attraction',
      })),
    )
  }
}
