import { AppSyncResolverHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { AUTHOR_TYPE, AddMigrationFlagMutationVariables, AddMigrationFlagResponse } from 'shared-types/API'
import {
  TABLE_MIGRATION_FAILED,
  TABLE_MIGRATION_INVALID_INPUT,
  TABLE_MIGRATION_NOT_AUTHORIZED,
  TABLE_MIGRATION_INVALID_ENV,
} from 'shared-types/lambdaErrors'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { envNamesToConfig } from '../../utils/env-names-to-config'
import { scanAll, MigrationTableName } from '../../utils/migrationUtils'

const addMigrationFlag: AppSyncResolverHandler<AddMigrationFlagMutationVariables, AddMigrationFlagResponse> = async (
  event,
) => {
  console.log(`starting tableMigration:`)
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(TABLE_MIGRATION_NOT_AUTHORIZED)
  }

  if (
    !(
      'claims' in event.identity &&
      'cognito:groups' in event.identity.claims &&
      event.identity.claims['cognito:groups'].includes('admin')
    )
  ) {
    throw new Error(TABLE_MIGRATION_NOT_AUTHORIZED)
  }

  console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`)

  if (!(event.arguments && 'input' in event.arguments && 'tableName' in event.arguments.input)) {
    throw new Error(TABLE_MIGRATION_INVALID_INPUT)
  }

  const { tableName: rawTableName, sourceEnv } = event.arguments.input
  const tableName = rawTableName as MigrationTableName

  const sourceTableConfig = envNamesToConfig[sourceEnv]

  if (!sourceTableConfig) {
    throw new Error(TABLE_MIGRATION_INVALID_ENV)
  }

  const DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID = await getSSMVariable('DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID')
  const DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY = await getSSMVariable('DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY')

  const globalDynamoDBOptions = {
    region: 'us-east-1',
    credentials: {
      accessKeyId: DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID,
      secretAccessKey: DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY,
    },
  }
  const documentClient = new DocumentClient(globalDynamoDBOptions)

  const sourceTable = tableName + '-' + sourceTableConfig.tableSuffix

  // add pendingMigration to every item in the table in a batch operation that can handle tens of thousands of items
  // dynamodb batchWrite can handle up to 25 items per batch

  let totalSuccess = 0
  let totalFail = 0

  let filterDetails: any = {}
  if (tableName === MigrationTableName.PHOTOGRAPHER) {
    filterDetails = {}
  } else if (tableName === MigrationTableName.ATTRACTION) {
    // authorType === ADMIN alone should be sufficient, but we're being extra careful
    filterDetails = {
      FilterExpression:
        '#isTravaCreated = :isTravaCreated AND #authorType = :authorType AND attribute_not_exists(#authorId)',
      ExpressionAttributeNames: {
        '#isTravaCreated': 'isTravaCreated',
        '#authorType': 'authorType',
        '#authorId': 'authorId',
      },
      ExpressionAttributeValues: {
        ':isTravaCreated': 1,
        ':authorType': AUTHOR_TYPE.ADMIN,
      },
    }
  } else {
    filterDetails = {
      FilterExpression: '#isTravaCreated = :isTravaCreated',
      ExpressionAttributeNames: { '#isTravaCreated': 'isTravaCreated' },
      ExpressionAttributeValues: {
        ':isTravaCreated': 1,
      },
    }
  }

  try {
    console.log(`Scanning source table: ${sourceTable}`)
    const sourceTableItems = await scanAll(documentClient, sourceTable, filterDetails)

    console.log(`Retrieved ${sourceTableItems.length} items to update`)
    for (let i = 0; i < sourceTableItems.length; i += 25) {
      const batch = sourceTableItems.slice(i, i + 25).map((item) => ({
        PutRequest: {
          Item: {
            ...item,
            pendingMigration: true,
          },
        },
      }))

      const { successCount, failureCount } = await processBatch(documentClient, batch, sourceTable)
      totalSuccess += successCount
      totalFail += failureCount
    }

    console.log(`Migration completed with ${totalSuccess} successes and ${totalFail} failures.`)
  } catch (error) {
    console.error('Error during batch update:', error)
    throw new Error(TABLE_MIGRATION_FAILED)
  }

  return {
    __typename: 'AddMigrationFlagResponse' as AddMigrationFlagResponse['__typename'],
    success: totalSuccess,
    fail: totalFail,
  }
}

// Additional utility function for exponential backoff
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Function to process batch with retries
async function processBatch(
  documentClient: AWS.DynamoDB.DocumentClient,
  batch: any[],
  tableName: string,
  maxRetries = 5,
) {
  let unprocessedItems = batch
  let retries = 0

  while (unprocessedItems.length > 0 && retries < maxRetries) {
    const params = {
      RequestItems: {
        [tableName]: unprocessedItems,
      },
    }

    const response = await documentClient.batchWrite(params).promise()

    unprocessedItems = []
    if (response.UnprocessedItems && response.UnprocessedItems[tableName]) {
      unprocessedItems = response.UnprocessedItems[tableName]
      await delay(50 * Math.pow(2, retries)) // Exponential backoff: 50ms, 100ms, 200ms, etc.
      retries++
    }
  }

  return {
    successCount: batch.length - unprocessedItems.length,
    failureCount: unprocessedItems.length,
  }
}

export default addMigrationFlag
