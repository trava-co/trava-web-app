import { ScheduledHandler } from 'aws-lambda'
import { dbClient } from './utils/dbClient'
import { getAllAttractionIdsInDynamoDb } from './utils/getAllAttractionIdsInDynamodb'
import ApiClient from './utils/ApiClient'
import chunk from 'lodash.chunk'
import { BACKEND_ENV_NAME } from 'shared-types/API'
import { sendSlackMessage } from './utils/sendSlackMessage'

const BATCH_SIZE = 100

// this lambda is triggered every day at 7am UTC
// it's job is to check dynamodb, check opensearch index, identify items missing in opensearch index that exist in dynamodb, and to make a trivial update to the dynamodb item to trigger the dynamodb stream, which is configured to call the opensearch streaming lambda, which will PUT the item to opensearch
export const handler: ScheduledHandler = async () => {
  console.log('ensureOpenSearchDocsExist started')

  const attractionTable = process.env.API_TRAVA_ATTRACTIONTABLE_NAME as string

  if (!attractionTable) {
    throw new Error('source table name not found')
  }

  const [attractionIdsInDynamoDb, attractionIdsInOpenSearch] = await Promise.all([
    getAllAttractionIdsInDynamoDb(dbClient, attractionTable, undefined),
    getAllAttractionIdsInOpenSearch(),
  ])

  console.log(`attractionIdsInDynamoDb.size: ${attractionIdsInDynamoDb.size}`)
  console.log(`attractionIdsInOpenSearch.size: ${attractionIdsInOpenSearch.size}`)

  // for each attraction in dynamodb, check if it exists in open search. if not, use dbClient to PUT to dynamodb with updatedAt to now
  // updates to dynamodb Attraction table are captured by dynamodb stream, which is configured to trigger OpenSearch streaming lambda, which transforms the dynamodb item into an OpenSearch item and PUTs it to OpenSearch (see the transformation logic at amplify/backend/api/trava/override.ts)
  const idsToUpdate: string[] = []

  for (let attractionIdInDynamoDb of attractionIdsInDynamoDb) {
    // check that it's present in opensearch set
    if (!attractionIdsInOpenSearch.has(attractionIdInDynamoDb)) {
      idsToUpdate.push(attractionIdInDynamoDb)
    }
  }

  console.log(`idsToUpdate.length: ${idsToUpdate.length}`)

  console.log(`updating these ids: ${idsToUpdate.join(', ')}`)

  const chunks = chunk(idsToUpdate, BATCH_SIZE)

  const now = new Date().toISOString()

  let totalSuccessCount = 0
  let totalFailCount = 0

  const idsFailedToUpdate = []

  for (let i = 0; i < chunks.length; i++) {
    console.log(`processing chunk ${i + 1} of ${chunks.length}`)
    const chunkIds = chunks[i]
    let successCount = 0
    let failCount = 0
    for (const id of chunkIds) {
      const updateParams = {
        TableName: attractionTable,
        Key: {
          id,
        },
        UpdateExpression: 'SET updatedAt = :nowValue',
        ExpressionAttributeValues: {
          ':nowValue': now,
        },
      }

      try {
        await dbClient.update(updateParams).promise()
        successCount++
      } catch (error) {
        failCount++
        idsFailedToUpdate.push(id)
        console.error('Error updating item to DynamoDB:', error)
      }
    }
    console.log(`for chunk ${i + 1}, successCount: ${successCount}, failCount: ${failCount}`)
    totalSuccessCount += successCount
    totalFailCount += failCount
  }
  console.log(`totalSuccessCount: ${totalSuccessCount}, totalFailCount: ${totalFailCount}`)

  const backendEnvs = [BACKEND_ENV_NAME.STAGING, BACKEND_ENV_NAME.PROD].map((env) => env.toLowerCase())
  const currentEnv = process.env.ENV?.toLowerCase() as string

  if (backendEnvs.includes(currentEnv)) {
    const itemsUpdated = idsToUpdate?.length || 0
    // 4. send slack message with results
    const messageParts = [
      `OpenSearch Missing Documents Nightly Update ${currentEnv}:`,
      `- ${itemsUpdated} items in DynamoDB were missing from OpenSearch`,
    ]

    if (itemsUpdated > 0) {
      messageParts.push(`- ${totalSuccessCount} items successfully updated in DynamoDB`)
      messageParts.push(`- ${totalFailCount} items failed to update in DynamoDB`)
      messageParts.push(
        '- See attached CSVs for IDs that were missing and attempted to be updated, and IDs that failed to update',
      )
    }

    const message = messageParts.join('\n')
    await sendSlackMessage(message, idsToUpdate, idsFailedToUpdate, attractionIdsInDynamoDb, attractionIdsInOpenSearch)
  }

  console.log('ensureOpenSearchDocsExist finished')
}

const LIMIT_PER_OPENSEARCH_QUERY = 1000

async function getAllAttractionIdsInOpenSearch(): Promise<Set<string>> {
  const scrollDuration = '5m' // keep the search context alive for 5 minutes
  let attractionIds: Set<string> = new Set()
  let scrollId: string | undefined

  try {
    // Initial search request
    const initialResponse = await ApiClient.get().openSearchScrollInit(
      'attraction',
      {
        size: LIMIT_PER_OPENSEARCH_QUERY,
        query: { match_all: {} },
        _source: ['id'],
      },
      scrollDuration,
    )

    // Extract scroll ID from initial response
    // @ts-ignore
    scrollId = initialResponse._scroll_id
    // @ts-ignore
    let hits = initialResponse.hits.hits

    // log the length
    console.log(`initialResponse.hits.hits.length: ${hits.length}`)

    // Process initial batch of hits
    hits.forEach((hit: any) => attractionIds.add(hit._source.id))

    // Continue scrolling until no more hits are returned
    while (hits.length) {
      // Fetch next batch of hits
      const scrollResponse = await ApiClient.get().openSearchScrollContinue(scrollId as string, scrollDuration)

      // Update scroll ID if necessary (usually not needed but included for completeness)
      // @ts-ignore
      scrollId = scrollResponse._scroll_id
      // @ts-ignore
      hits = scrollResponse.hits.hits

      // log the length
      console.log(`scrollResponse.hits.hits.length: ${hits.length}`)

      // Process hits
      hits.forEach((hit: any) => attractionIds.add(hit._source.id))
    }
  } catch (error) {
    console.error('Error fetching data from OpenSearch:', error)
  } finally {
    // Clear the scroll context when done
    if (scrollId) {
      await ApiClient.get().openSearchScrollClear([scrollId])
    }
  }

  return attractionIds
}
