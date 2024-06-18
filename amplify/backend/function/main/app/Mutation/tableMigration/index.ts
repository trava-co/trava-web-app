// #####  #  ####  #    #     ####  ######
// #    # # #      #   #     #    # #
// #    # #  ####  ####      #    # #####
// #####  #      # #  #      #    # #
// #   #  # #    # #   #     #    # #
// #    # #  ####  #    #     ####  #
//
// #####    ##   #####   ##      #       ####   ####   ####
// #    #  #  #    #    #  #     #      #    # #      #
// #    # #    #   #   #    #    #      #    #  ####   ####
// #    # ######   #   ######    #      #    #      #      #
// #    # #    #   #   #    #    #      #    # #    # #    #
// #####  #    #   #   #    #    ######  ####   ####   ####
//
// USE WITH CAUTION!!!!

import { AppSyncResolverHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3 } from 'aws-sdk'
import {
  TableMigrationMutationVariables,
  Photographer,
  Destination,
  TableMigrationResponse,
  AUTHOR_TYPE,
  GenerationStep,
  Status,
  Attraction,
} from 'shared-types/API'
import {
  TABLE_MIGRATION_FAILED,
  TABLE_MIGRATION_INVALID_INPUT,
  TABLE_MIGRATION_NOT_AUTHORIZED,
  TABLE_MIGRATION_INVALID_ENV,
} from 'shared-types/lambdaErrors'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { envNamesToConfig } from '../../utils/env-names-to-config'
import {
  scanAll,
  getBucketListCountDictionary,
  getGooglePlaceLastUpdatedAtDictionary,
  processItemsInBatches,
  processItem,
  processAttractionItem,
  MigrationTableName,
} from '../../utils/migrationUtils'

const tableMigration: AppSyncResolverHandler<TableMigrationMutationVariables, any> = async (event) => {
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

  const { tableName: rawTableName, sourceEnv, targetEnv, operationType } = event.arguments.input
  const tableName = rawTableName as MigrationTableName

  console.log(`Migrating table ${JSON.stringify(tableName, null, 2)}`)

  const sourceTableConfig = envNamesToConfig[sourceEnv]
  const targetTableConfig = envNamesToConfig[targetEnv]

  // if the sourceEnv or targetEnv input var is not valid, throw an error
  if (!sourceTableConfig || !targetTableConfig) {
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
  const s3 = new S3(globalDynamoDBOptions)

  const sourceTable = tableName + '-' + sourceTableConfig.tableSuffix
  const targetTable = tableName + '-' + targetTableConfig.tableSuffix

  console.log(`Source table: ${sourceTable}`)
  console.log(`Target table: ${targetTable}`)

  let filterDetails: any = {}
  if (tableName === MigrationTableName.PHOTOGRAPHER) {
    filterDetails = {
      FilterExpression: '#pendingMigration = :pendingMigration',
      ExpressionAttributeNames: { '#pendingMigration': 'pendingMigration' },
      ExpressionAttributeValues: { ':pendingMigration': true },
    }
  } else if (tableName === MigrationTableName.ATTRACTION) {
    // authorType === ADMIN alone should be sufficient, but we're being extra careful
    filterDetails = {
      FilterExpression:
        '#isTravaCreated = :isTravaCreated AND #authorType = :authorType AND attribute_not_exists(#authorId) AND #pendingMigration = :pendingMigration',
      ExpressionAttributeNames: {
        '#isTravaCreated': 'isTravaCreated',
        '#authorType': 'authorType',
        '#authorId': 'authorId',
        '#pendingMigration': 'pendingMigration',
      },
      ExpressionAttributeValues: {
        ':isTravaCreated': 1,
        ':authorType': AUTHOR_TYPE.ADMIN,
        ':pendingMigration': true,
      },
    }
  } else {
    filterDetails = {
      FilterExpression: '#isTravaCreated = :isTravaCreated AND #pendingMigration = :pendingMigration',
      ExpressionAttributeNames: { '#isTravaCreated': 'isTravaCreated', '#pendingMigration': 'pendingMigration' },
      ExpressionAttributeValues: {
        ':isTravaCreated': 1,
        ':pendingMigration': true,
      },
    }
  }

  console.log('filterDetails', JSON.stringify(filterDetails))

  const sourceTableItems = await scanAll(documentClient, sourceTable, filterDetails)

  console.log(`Retrieved ${sourceTableItems.length} items to process`)

  try {
    let tableMigrationResponse: TableMigrationResponse
    switch (tableName) {
      case MigrationTableName.PHOTOGRAPHER:
        tableMigrationResponse = await processItemsInBatches<Photographer>({
          sourceTableItems,
          processItem,
          transformItem: transformPhotographer,
          tableName,
          sourceTableConfig,
          targetTableConfig,
          documentClient,
          operationType,
          batchSize: 250,
        })
        break

      case MigrationTableName.DESTINATION:
        tableMigrationResponse = await processItemsInBatches<Destination>({
          sourceTableItems,
          processItem,
          transformItem: transformDestination,
          tableName,
          sourceTableConfig,
          targetTableConfig,
          documentClient,
          operationType,
          batchSize: 250,
          s3Instance: s3,
        })
        break

      case MigrationTableName.ATTRACTION:
        const bucketListCountDictionary = await getBucketListCountDictionary(
          documentClient,
          targetTableConfig.tableSuffix,
        )

        // if generation exists, it must be in the GET_DETAILS step and have succeeded, so that we only migrate successfully generated attractions
        const sourceTableItemsToMigrate = sourceTableItems.filter(
          (item) =>
            !item.generation ||
            (item.generation.step === GenerationStep.GET_DETAILS && item.generation.status === Status.SUCCEEDED),
        )

        const sourceGooglePlaceLastUpdatedDictionary = await getGooglePlaceLastUpdatedAtDictionary(
          documentClient,
          sourceTableConfig.tableSuffix,
        )

        const targetGooglePlaceLastUpdatedDictionary = await getGooglePlaceLastUpdatedAtDictionary(
          documentClient,
          targetTableConfig.tableSuffix,
        )

        tableMigrationResponse = await processItemsInBatches<Attraction>({
          sourceTableItems: sourceTableItemsToMigrate,
          processItem: processAttractionItem,
          tableName,
          sourceTableConfig: sourceTableConfig,
          targetTableConfig: targetTableConfig,
          documentClient,
          bucketListCountDictionary,
          operationType,
          batchSize: 1, // since we're performing a transaction, we can only process one item at a time
          sourceGooglePlaceLastUpdatedDictionary,
          targetGooglePlaceLastUpdatedDictionary,
          s3Instance: s3,
        })

        break
      default:
        throw new Error('Table name not supported')
    }

    console.log(
      `table migration completed:\n\n${tableName} results: ${JSON.stringify(tableMigrationResponse, null, 2)}}`,
    )

    return tableMigrationResponse
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error(`${TABLE_MIGRATION_FAILED}: error is not an instance of Error`)
    }
    // append context to the error message
    error.message = `\n${TABLE_MIGRATION_FAILED}: ${error.message}`

    throw error
  }
}

function transformPhotographer(item: Photographer): Photographer {
  return item
}

function transformDestination(item: Destination, bucketName: string): Destination {
  if (item.coverImage?.bucket) {
    item.coverImage.bucket = bucketName
  }
  return item
}

export default tableMigration
