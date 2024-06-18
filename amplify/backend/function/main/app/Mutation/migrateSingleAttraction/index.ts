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
  MigrateSingleAttractionMutationVariables,
  Attraction,
  GooglePlace,
  OPERATION_TYPE,
  StartEndLocation,
  BACKEND_ENV_NAME,
  AUTHOR_TYPE,
} from 'shared-types/API'
import {
  MIGRATE_SINGLE_ATTRACTION_INVALID_INPUT,
  MIGRATE_SINGLE_ATTRACTION_NOT_AUTHORIZED,
  TABLE_MIGRATION_INVALID_ENV,
  MIGRATE_SINGLE_ATTRACTION_FAILED,
} from 'shared-types/lambdaErrors'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { BackendEnvConfig, envNamesToConfig } from '../../utils/env-names-to-config'
import {
  MigrationTableName,
  processItemsInBatches,
  processAttractionItem,
  getAllGooglePlaceIdsFromAttractionLocations,
} from '../../utils/migrationUtils'

export const migrateSingleAttraction: AppSyncResolverHandler<MigrateSingleAttractionMutationVariables, any> = async (
  event,
) => {
  console.log(`starting migrateSingleAttraction:`)
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(MIGRATE_SINGLE_ATTRACTION_NOT_AUTHORIZED)
  }

  if (
    !(
      'claims' in event.identity &&
      'cognito:groups' in event.identity.claims &&
      event.identity.claims['cognito:groups'].includes('admin')
    )
  ) {
    throw new Error(MIGRATE_SINGLE_ATTRACTION_NOT_AUTHORIZED)
  }

  console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`)

  if (!(event.arguments && 'input' in event.arguments)) {
    throw new Error(MIGRATE_SINGLE_ATTRACTION_INVALID_INPUT)
  }

  const { sourceEnv, targetEnv, attractionId } = event.arguments.input

  // if sourceEnv is not BACKEND_ENV_NAME.STAGING or BACKEND_ENV_NAME.PROD, throw an error
  if (sourceEnv !== BACKEND_ENV_NAME.STAGING || targetEnv !== BACKEND_ENV_NAME.PROD) {
    throw new Error(TABLE_MIGRATION_INVALID_ENV)
  }

  const sourceTableConfig = envNamesToConfig[sourceEnv]
  const targetTableConfig = envNamesToConfig[targetEnv]

  // if the sourceEnv or targetEnv input var is not valid, throw an error
  if (!sourceTableConfig || !targetTableConfig) {
    throw new Error(TABLE_MIGRATION_INVALID_ENV)
  }

  const sourceTable = 'Attraction' + '-' + (sourceTableConfig as BackendEnvConfig).tableSuffix
  const targetTable = 'Attraction' + '-' + (targetTableConfig as BackendEnvConfig).tableSuffix

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

  console.log(`Source table: ${sourceTable} -> Target table: ${targetTable}`)

  let result
  try {
    // query source table with attractionId
    result = await documentClient
      .query({
        TableName: sourceTable,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': attractionId,
        },
      })
      .promise()
  } catch (error) {
    console.error('error querying source table')
    console.error(JSON.stringify(error, null, 2))
    throw error
  }

  console.log(
    `Found ${result.Items?.length} item(s) in source table ${sourceTable}: \n${JSON.stringify(result.Items, null, 2)}`,
  )

  const sourceTableItems = result.Items as Attraction[]

  if (!sourceTableItems?.length) {
    throw new Error(`No attraction found with id ${attractionId}`)
  }

  const attraction = sourceTableItems[0]
  // if attraction has authorType USER, throw an error
  if (attraction.authorType === AUTHOR_TYPE.USER) {
    throw new Error(`Attraction with id ${attractionId} has authorType ${AUTHOR_TYPE.USER}. Must not migrate.`)
  }

  try {
    // query the target UserAttraction table's secondary index (attractionId), and get the count of the attractionId
    const userAttractionTableName = `UserAttraction-${(targetTableConfig as BackendEnvConfig).tableSuffix}`
    const result = await documentClient
      .query({
        TableName: userAttractionTableName,
        IndexName: 'byAttraction',
        KeyConditionExpression: 'attractionId = :attractionId',
        ExpressionAttributeValues: {
          ':attractionId': attractionId,
        },
        ProjectionExpression: 'attractionId',
      })
      .promise()

    console.log(`Found ${result.Count ?? 0} UserAttraction items in target table ${targetTable}`)

    const bucketListCountDictionary = {
      [attractionId]: result.Count ?? 0,
    }

    // get the google places associated with the source attraction locations
    const locations = attraction.locations as StartEndLocation[]

    const googlePlaceIds = getAllGooglePlaceIdsFromAttractionLocations(locations)

    // for each googlePlaceId, query the sourceGooglePlaceTable for the googlePlace, and build up targetEnvPlaceLastUpdatedDictionary
    const sourceGooglePlaceLastUpdatedDictionary: Record<string, string> = {}
    let targetGooglePlaceLastUpdatedDictionary: Record<string, string> = {}

    const sourceGooglePlaceTable = 'GooglePlace-' + (sourceTableConfig as BackendEnvConfig).tableSuffix

    for (const googlePlaceId of googlePlaceIds) {
      const sourceGooglePlaces = await documentClient
        .query({
          TableName: sourceGooglePlaceTable,
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id': googlePlaceId,
          },
          ProjectionExpression: 'id, dataLastUpdatedAt',
        })
        .promise()

      const sourceGooglePlaceItem = sourceGooglePlaces?.Items?.[0] as Partial<GooglePlace> | undefined

      if (!sourceGooglePlaceItem) {
        throw new Error(`No google place found with id ${googlePlaceId}`)
      }

      if (!sourceGooglePlaceItem.dataLastUpdatedAt) {
        throw new Error(`No dataLastUpdatedAt found for google place with id ${googlePlaceId}`)
      }

      sourceGooglePlaceLastUpdatedDictionary[googlePlaceId] = sourceGooglePlaceItem.dataLastUpdatedAt

      const targetGooglePlaceTable = 'GooglePlace-' + (targetTableConfig as BackendEnvConfig).tableSuffix
      // query the target GooglePlace table by googlePlaceId to build up the targetEnvPlaceLastUpdatedDictionary
      const targetGooglePlaces = await documentClient
        .query({
          TableName: targetGooglePlaceTable,
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id': googlePlaceId,
          },
          ProjectionExpression: 'id, dataLastUpdatedAt',
        })
        .promise()

      console.log(
        `Found ${targetGooglePlaces.Items?.length} google places in target table for googlePlaceId ${googlePlaceId}`,
      )

      const targetGooglePlace = targetGooglePlaces?.Items?.[0] as Partial<GooglePlace> | undefined

      if (targetGooglePlace?.dataLastUpdatedAt) {
        targetGooglePlaceLastUpdatedDictionary[googlePlaceId] = targetGooglePlace.dataLastUpdatedAt
      }
    }

    const s3 = new S3(globalDynamoDBOptions)

    const tableMigrationResponse = await processItemsInBatches<Attraction>({
      sourceTableItems,
      processItem: processAttractionItem,
      tableName: MigrationTableName.ATTRACTION,
      sourceTableConfig: sourceTableConfig,
      targetTableConfig: targetTableConfig,
      documentClient,
      bucketListCountDictionary,
      operationType: OPERATION_TYPE.PUT,
      batchSize: 1,
      sourceGooglePlaceLastUpdatedDictionary,
      targetGooglePlaceLastUpdatedDictionary,
      s3Instance: s3,
    })

    console.log(`tableMigrationResponse: ${JSON.stringify(tableMigrationResponse, null, 2)}`)

    return tableMigrationResponse
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error(`${MIGRATE_SINGLE_ATTRACTION_FAILED}: error is not an instance of Error`)
    }
    // append context to the error message
    error.message = `\n${MIGRATE_SINGLE_ATTRACTION_FAILED}: ${error.message}`

    throw error
  }
}

export default migrateSingleAttraction
