import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import chunk from 'lodash.chunk'
import {
  AUTHOR_TYPE,
  Attraction,
  Destination,
  GooglePlace,
  MigrationResult,
  OPERATION_TYPE,
  Photographer,
  S3Object,
  StartEndLocation,
  TableMigrationResponse,
} from 'shared-types/API'
import { BackendEnvConfig } from './env-names-to-config'
import ApiClient from './ApiClient/ApiClient'
import { S3 } from 'aws-sdk'
import { retryWithExponentialBackoff } from './retryWithExponentialBackoff'

export enum MigrationTableName {
  ATTRACTION = 'Attraction',
  DESTINATION = 'Destination',
  PHOTOGRAPHER = 'Photographer',
}

const scanAll = async (
  documentClient: AWS.DynamoDB.DocumentClient,
  tableName: string,
  filterDetails?: any,
): Promise<any[]> => {
  let items: any[] = []

  let result = await documentClient
    .scan({
      TableName: tableName,
      ...filterDetails,
    })
    .promise()

  if (result?.Count ?? 0 > 0) items = items.concat(result.Items)

  while (result.LastEvaluatedKey) {
    result = await documentClient
      .scan({
        TableName: tableName,
        ExclusiveStartKey: result.LastEvaluatedKey,
        ...filterDetails,
      })
      .promise()

    if (result?.Count ?? 0 > 0) items = items.concat(result.Items)
  }

  console.log(`Found ${items.length} items: ${tableName}`)

  return items
}

const scanFields = async (
  documentClient: AWS.DynamoDB.DocumentClient,
  tableName: string,
  fieldNames: string[], // Array of field names
  filterDetails?: any,
): Promise<Array<Record<string, any>>> => {
  // Returns an array of objects with generic types
  let items: Array<Record<string, any>> = []

  let result = await documentClient
    .scan({
      TableName: tableName,
      ProjectionExpression: fieldNames.join(', '), // Join field names for projection
      ...filterDetails,
    })
    .promise()

  if (result?.Count ?? 0 > 0) {
    items = items.concat(result.Items ?? [])
  }

  while (result.LastEvaluatedKey) {
    result = await documentClient
      .scan({
        TableName: tableName,
        ExclusiveStartKey: result.LastEvaluatedKey,
        ProjectionExpression: fieldNames.join(', '),
        ...filterDetails,
      })
      .promise()

    if (result?.Count ?? 0 > 0) {
      items = items.concat(result.Items ?? [])
    }
  }

  console.log(`Found ${items.length} items in ${tableName}`)

  return items
}

interface Identifiable {
  id: string
  pendingMigration?: boolean | null
}

export enum MigrateItemResult {
  SUCCESS = 'success',
  FAIL = 'fail',
  SKIPPED = 'skipped',
  REMAINING = 'remaining',
}

interface IProcessItem<T extends Identifiable> {
  item: T
  transformItem?: (item: T, bucketName: string, bucketListCountDictionary?: any) => T
  tableName: MigrationTableName
  sourceTableConfig: BackendEnvConfig
  targetTableConfig: BackendEnvConfig
  documentClient: DocumentClient
  bucketListCountDictionary?: Record<string, number>
  operationType: OPERATION_TYPE
  sourceGooglePlaceLastUpdatedDictionary?: Record<string, string>
  targetGooglePlaceLastUpdatedDictionary?: Record<string, string>
}

async function processItem<T extends Identifiable>({
  item,
  transformItem,
  tableName,
  targetTableConfig,
  documentClient,
  bucketListCountDictionary,
  operationType,
}: IProcessItem<T>): Promise<MigrateItemResult> {
  if (!transformItem) {
    throw new Error('transformItem is undefined')
  }
  const transformedItem = transformItem(item, targetTableConfig.bucketName, bucketListCountDictionary)
  const operationInsert = operationType === OPERATION_TYPE.INSERT

  const targetTable = tableName + '-' + targetTableConfig.tableSuffix

  try {
    await documentClient
      .put({
        TableName: targetTable,
        Item: transformedItem,
        ...(operationInsert && { ConditionExpression: 'attribute_not_exists(id)' }),
      })
      .promise()

    return MigrateItemResult.SUCCESS
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error('error is not an instance of Error')
    }

    // if the item already exists and we're doing an insert, skip it
    if (operationInsert && (error as AWS.AWSError)?.code === 'ConditionalCheckFailedException') {
      return MigrateItemResult.SKIPPED
    } else {
      // append info about the item to the error message
      error.message = `${error.message}\nOriginal item: ${JSON.stringify(
        item,
        null,
        2,
      )}\n Transformed item: ${JSON.stringify(transformedItem, null, 2)}`

      throw error
    }
  }
}

/** mutates the attraction and returns it */
function transformAttraction(
  item: Attraction,
  bucketName: string,
  bucketListCountDictionary: Record<string, number>,
): Attraction {
  // 1. update the bucketListCount for each source attraction to have the correct value
  item.bucketListCount = bucketListCountDictionary[item.id] ?? 0
  // 2. update the bucket name for each image
  if (item.images?.length) {
    item.images = item.images.map((image) => {
      if (image !== null) {
        return {
          ...image,
          bucket: bucketName,
        }
      } else {
        return image
      }
    })
  }

  return item
}

function getAllGooglePlaceIdsFromAttractionLocations(locations: StartEndLocation[]): string[] {
  const googlePlaceIdsOnSourceAttractionSet: Set<string> = new Set()

  const filteredLocations = locations.filter((location): location is StartEndLocation => location !== null)

  for (let location of filteredLocations) {
    if (location.startLoc.googlePlaceId) {
      googlePlaceIdsOnSourceAttractionSet.add(location.startLoc.googlePlaceId)
    }
    if (location.endLoc.googlePlaceId) {
      googlePlaceIdsOnSourceAttractionSet.add(location.endLoc.googlePlaceId)
    }
  }

  const googlePlaceIdsOnSourceAttraction = Array.from(googlePlaceIdsOnSourceAttractionSet)

  return googlePlaceIdsOnSourceAttraction
}

async function processAttractionItem({
  item,
  tableName,
  sourceTableConfig,
  targetTableConfig,
  documentClient,
  operationType,
  bucketListCountDictionary,
  sourceGooglePlaceLastUpdatedDictionary,
  targetGooglePlaceLastUpdatedDictionary,
}: IProcessItem<Attraction>): Promise<MigrateItemResult> {
  if (!bucketListCountDictionary) {
    throw new Error(`bucketListCountDictionary is undefined for attraction ${item.id}`)
  }

  const { locations } = item
  if (!locations) {
    throw new Error(`locations is undefined for attraction ${item.id}`)
  }

  // step 1: get all the googlePlaceIds on the source attraction
  const googlePlaceIdsOnSourceAttraction = getAllGooglePlaceIdsFromAttractionLocations(locations as StartEndLocation[])

  // step 2: transform the attraction (mutative)
  const transformedItem = transformAttraction(item, targetTableConfig.bucketName, bucketListCountDictionary)

  // define some variables we'll need later
  const targetAttractionTableName = tableName + '-' + targetTableConfig.tableSuffix
  const operationInsert = operationType === OPERATION_TYPE.INSERT

  // define a function to copy over the attraction and googlePlaces in a transaction
  async function copyAttractionAndGooglePlaces() {
    if (!sourceGooglePlaceLastUpdatedDictionary || !targetGooglePlaceLastUpdatedDictionary) {
      throw new Error('sourceGooglePlaceLastUpdatedDictionary or targetGooglePlaceLastUpdatedDictionary is undefined')
    }
    // put the target attraction and copy over all the GooglePlaces in a transaction, provided that the source googlePlace is newer than the target googlePlace
    // use the dictionaries to determine if the source googlePlace is newer than the target googlePlace, and if so, add it to the list of googlePlaces to copy over
    let googlePlaceIdsToCopyOver: string[] = []

    for (let googlePlaceId of googlePlaceIdsOnSourceAttraction) {
      const sourceGooglePlaceLastUpdatedAt = sourceGooglePlaceLastUpdatedDictionary[googlePlaceId]
      const targetGooglePlaceLastUpdatedAt = targetGooglePlaceLastUpdatedDictionary[googlePlaceId]

      if (!sourceGooglePlaceLastUpdatedAt) {
        throw new Error('sourceGooglePlaceLastUpdatedAt is undefined')
      }

      if (!targetGooglePlaceLastUpdatedAt || sourceGooglePlaceLastUpdatedAt > targetGooglePlaceLastUpdatedAt) {
        googlePlaceIdsToCopyOver.push(googlePlaceId)
      }
    }

    console.log(`copyAttractionAndGooglePlaces: googlePlaceIdsToCopyOver: ${JSON.stringify(googlePlaceIdsToCopyOver)}`)

    // assemble the list of googlePlaces to copy over
    let googlePlacesToCopyOver: GooglePlace[] = []
    for (let googlePlaceId of googlePlaceIdsToCopyOver) {
      const googlePlace = await documentClient
        .get({
          TableName: 'GooglePlace-' + sourceTableConfig.tableSuffix,
          Key: {
            id: googlePlaceId,
          },
        })
        .promise()

      if (!googlePlace.Item) {
        throw new Error('googlePlace.Item is undefined')
      }

      googlePlacesToCopyOver.push(googlePlace.Item as GooglePlace)
    }

    // copy over the attraction and googlePlaces in a transaction
    const transaction = {
      TransactItems: [
        {
          Put: {
            TableName: targetAttractionTableName,
            Item: transformedItem,
          },
        },
        ...googlePlacesToCopyOver.map((googlePlace) => ({
          Put: {
            TableName: 'GooglePlace-' + targetTableConfig.tableSuffix,
            Item: googlePlace,
          },
        })),
      ],
    }

    await documentClient.transactWrite(transaction).promise()
  }

  // step 3: query target attraction table w/ attractionId
  const { Item: targetTableAttraction } = await documentClient
    .get({
      TableName: targetAttractionTableName,
      Key: {
        id: item.id,
      },
    })
    .promise()

  try {
    if (targetTableAttraction) {
      console.log('targetTableAttraction exists')
      // attraction found in target table with matching attraction id, so if operationType is INSERT, skip this. Else, copy over.
      if (operationInsert) {
        console.log('operation type is INSERT, so skip')
        return MigrateItemResult.SKIPPED
      } else {
        console.log('operation type is PUT, so copy over')
        // operation type is PUT, so copy over
        await copyAttractionAndGooglePlaces()
        console.log('copied over attraction and googlePlaces: SUCCESS')
        return MigrateItemResult.SUCCESS
      }
    } else {
      // no attraction found in target table with matching attraction id
      console.log('targetTableAttraction does not exist')

      // query opensearch target attraction index with current attraction's googlePlaceIds, filtered by isTravaCreated === 1
      // only want to override user created attractions (isTravaCreated === 0)
      // if this returns any hits, then skip this attraction, to ensure we don't create two trava attractions for the same googlePlaceId in target env. if no hits, call copyAttractionAndGooglePlaces()

      // first, determine the openSearchUrl
      const targetOpenSearchUrl = targetTableConfig.openSearchUrl
      console.log(`targetOpenSearchUrl: ${targetOpenSearchUrl}`)
      if (!targetOpenSearchUrl) {
        throw new Error('targetOpenSearchUrl is undefined')
      }

      const matchingAttractionsInTargetEnvOSQuery = createOpenSearchQuery({
        googlePlaceIds: googlePlaceIdsOnSourceAttraction,
      })

      const matchingAttractionsInTargetEnv = await retryWithExponentialBackoff({
        func: () =>
          ApiClient.get()
            .useIamAuth()
            .openSearchFetch('attraction', matchingAttractionsInTargetEnvOSQuery, targetOpenSearchUrl),
        maxRetries: 4,
      })

      console.log(`matchingAttractionsInTargetEnv: ${JSON.stringify(matchingAttractionsInTargetEnv, null, 2)}`)

      // check the total hits
      // @ts-ignore
      const numMatchedAttractions = matchingAttractionsInTargetEnv?.hits?.total?.value

      if (numMatchedAttractions === 0) {
        console.log('no isTravaCreated attractions found in opensearch, so copy over the attraction and googlePlaces')
        await copyAttractionAndGooglePlaces()
        console.log('copied over attraction and googlePlaces: SUCCESS')
        return MigrateItemResult.SUCCESS
      } else {
        console.log(`${numMatchedAttractions} attractions with isTravaCreated = 1 exists in opensearch`)
        // filter for attractions with authorType === AUTHOR_TYPE.USER. let's update these to have AUTHOR_TYPE.ADMIN.
        // @ts-ignore
        const matchingAttractionsInTargetEnvWithAuthorTypeUser = matchingAttractionsInTargetEnv.hits.hits
          .filter((attraction: any) => attraction._source.authorType === AUTHOR_TYPE.USER)
          .map((attraction: any) => attraction._source.id)

        const numMatchingAttractionsInTargetEnvWithAuthorTypeUser =
          matchingAttractionsInTargetEnvWithAuthorTypeUser.length
        const numMatchingAttractionsInTargetEnvWithAuthorTypeAdmin =
          numMatchedAttractions - numMatchingAttractionsInTargetEnvWithAuthorTypeUser

        // if there already exists an admin attraction in target env, skip
        if (numMatchingAttractionsInTargetEnvWithAuthorTypeAdmin > 0) {
          console.log('already exists an attraction in target env with authorType = AUTHOR_TYPE.ADMIN, so skip')
          return MigrateItemResult.SKIPPED
        }

        // if we get here, then there are no admin attractions in target env with same googlePlaceId, and there's >= 1 user generated attractions, so we should update the first one to have authorType = AUTHOR_TYPE.ADMIN and remove authorId
        // recall, these have isTravaCreated = 1, so if they also have authorType = AUTHOR_TYPE.USER, then they are user generated attractions
        // we don't guarantee any ties back to the user for user generated attractions

        const attractionId = matchingAttractionsInTargetEnvWithAuthorTypeUser[0]
        console.log(`updating attraction ${attractionId} to have authorType = AUTHOR_TYPE.ADMIN`)
        await documentClient
          .update({
            TableName: targetAttractionTableName,
            Key: {
              id: attractionId,
            },
            UpdateExpression: 'SET authorType = :authorType REMOVE authorId',
            ExpressionAttributeValues: {
              ':authorType': AUTHOR_TYPE.ADMIN,
            },
          })
          .promise()

        return MigrateItemResult.SUCCESS
      }
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error('error is not an instance of Error')
    }

    // append info about the item to the error message
    error.message = `${error.message}\nOriginal item: ${JSON.stringify(
      item,
      null,
      2,
    )}\n Transformed item: ${JSON.stringify(transformedItem, null, 2)}`

    throw error
  }
}

interface IProcessItemsInBatches<T extends Identifiable> {
  sourceTableItems: T[]
  processItem: (args: IProcessItem<T>) => Promise<MigrateItemResult>
  transformItem?: (item: T, bucketName: string, bucketListCountDictionary?: any) => T
  tableName: MigrationTableName
  sourceTableConfig: BackendEnvConfig
  targetTableConfig: BackendEnvConfig
  documentClient: DocumentClient
  bucketListCountDictionary?: Record<string, number>
  operationType: OPERATION_TYPE
  batchSize: number
  sourceGooglePlaceLastUpdatedDictionary?: Record<string, string>
  targetGooglePlaceLastUpdatedDictionary?: Record<string, string>
  s3Instance?: S3
}

async function processItemsInBatches<T extends Identifiable>({
  sourceTableItems,
  processItem,
  transformItem,
  tableName,
  sourceTableConfig,
  targetTableConfig,
  documentClient,
  bucketListCountDictionary,
  operationType,
  batchSize,
  sourceGooglePlaceLastUpdatedDictionary,
  targetGooglePlaceLastUpdatedDictionary,
  s3Instance,
}: IProcessItemsInBatches<T>): Promise<TableMigrationResponse> {
  const batches = chunk(sourceTableItems, batchSize)
  console.log(`process items in batches: ${batches.length} batches`)

  let dataMigrationResultTracker = {
    __typename: 'MigrationResult' as MigrationResult['__typename'],
    [MigrateItemResult.SUCCESS]: 0,
    [MigrateItemResult.FAIL]: 0,
    [MigrateItemResult.SKIPPED]: 0,
    [MigrateItemResult.REMAINING]: sourceTableItems.length,
  }

  let imageMigrationResultTracker = {
    __typename: 'MigrationResult' as MigrationResult['__typename'],
    [MigrateItemResult.SUCCESS]: 0,
    [MigrateItemResult.FAIL]: 0,
    [MigrateItemResult.SKIPPED]: 0,
    [MigrateItemResult.REMAINING]: sourceTableItems.length,
  }

  const startTime = Date.now()
  const timeout = 10 * 60 * 1000 // 10 minutes in ms

  for (const batch of batches) {
    // Check if the timeout has been reached before processing the next batch
    if (Date.now() - startTime > timeout) {
      console.log('Timeout reached. Exiting batch processing.')
      break
    }

    const results = await Promise.allSettled(
      batch.map(async (item) => {
        // remove pendingMigration from this item using dbClient
        if (item.pendingMigration !== undefined) {
          console.log(`removing pendingMigration field from ${tableName} ${item.id}`)
          try {
            await documentClient
              .update({
                TableName: tableName + '-' + sourceTableConfig.tableSuffix,
                Key: {
                  id: item.id,
                },
                UpdateExpression: 'REMOVE pendingMigration',
              })
              .promise()
          } catch (error: any) {
            throw new Error(`error removing pendingMigration field from attraction ${item.id}. error: ${error.message}`)
          }

          // delete pendingMigration from item
          delete item.pendingMigration
        }
        console.log(`processing item ${item.id}`)

        // 1. Photo migration operation (if applicable)
        // must handle photo migration first, because item migration may mutate the item to point to different images
        const imagesToProcess = getImagesToProcess(
          tableName,
          (item as unknown) as Attraction | Destination | Photographer,
        )

        const numImagesToProcess = imagesToProcess.length

        let photoMigrationPromises: Promise<MigrateItemResult>[] = []

        if (numImagesToProcess > 0) {
          console.log(`processing ${numImagesToProcess} images for item ${item.id}`)
          if (!s3Instance) {
            throw new Error('s3Instance is undefined')
          }

          photoMigrationPromises = imagesToProcess.map((image) =>
            addImageToTargetBucketIfNotExists({
              image,
              targetBucket: targetTableConfig.bucketName,
              s3: s3Instance,
            }),
          )
        }

        // 2. Data migration operation
        const dataMigrationPromise = processItem({
          item,
          transformItem,
          tableName,
          sourceTableConfig,
          targetTableConfig,
          documentClient,
          bucketListCountDictionary,
          operationType,
          sourceGooglePlaceLastUpdatedDictionary,
          targetGooglePlaceLastUpdatedDictionary,
        })

        // Wait for both data migration and photo migration to complete
        const [dataMigrationResult, ...photoMigrationResults] = await Promise.allSettled([
          dataMigrationPromise,
          ...photoMigrationPromises,
        ])

        return { id: item.id, dataMigrationResult, photoMigrationResults }
      }),
    )

    // tabulate results for this batch
    results.forEach((result) => {
      dataMigrationResultTracker[MigrateItemResult.REMAINING]--
      imageMigrationResultTracker[MigrateItemResult.REMAINING]--

      if (result.status === 'fulfilled') {
        // access the dataMigrationResult and photoMigrationResults
        const { id, dataMigrationResult, photoMigrationResults } = result.value
        // check if dataMigrationResult is fulfilled
        if (dataMigrationResult.status === 'fulfilled') {
          dataMigrationResultTracker[dataMigrationResult.value]++
        } else {
          console.error(
            `error migrating data for item with id: ${id}. \n error: ${JSON.stringify(
              dataMigrationResult.reason,
              null,
              2,
            )}`,
          )
          dataMigrationResultTracker[MigrateItemResult.FAIL]++
        }

        // if any of the photoMigrationResults are rejected, then consider the photo migration for this item to have failed
        const failedPhotoMigrationResults = photoMigrationResults.filter(
          (photoMigrationResult) => photoMigrationResult.status === 'rejected',
        )

        if (failedPhotoMigrationResults.length) {
          console.error(
            `Photo migration failed for item with id: ${id}. \n error: ${JSON.stringify(
              failedPhotoMigrationResults,
              null,
              2,
            )}`,
          )
          imageMigrationResultTracker[MigrateItemResult.FAIL]++
        }
        // if every photoMigrationResult is fulfilled with value of SKIPPED, then consider the photo migration for this item to have been skipped
        else if (
          photoMigrationResults.every(
            (photoMigrationResult) =>
              photoMigrationResult.status === 'fulfilled' && photoMigrationResult.value === MigrateItemResult.SKIPPED,
          )
        ) {
          imageMigrationResultTracker[MigrateItemResult.SKIPPED]++
        }
        // if every photoMigrationResult is fulfilled with value of SUCCESS, then consider the photo migration for this item to have succeeded
        else if (
          photoMigrationResults.every(
            (photoMigrationResult) =>
              photoMigrationResult.status === 'fulfilled' && photoMigrationResult.value === MigrateItemResult.SUCCESS,
          )
        ) {
          imageMigrationResultTracker[MigrateItemResult.SUCCESS]++
        }
      } else {
        console.error('somehow, result.status containing both dataMigrationResult and photoMigrationResults rejected')
        console.error(`${JSON.stringify(result.reason, null, 2)}. reason: ${result.reason}`)
        dataMigrationResultTracker[MigrateItemResult.FAIL]++
        imageMigrationResultTracker[MigrateItemResult.FAIL]++
      }
    })

    console.log(`Processed batch containing ${batch.length} item(s)`)
    console.log(`Batch results for dataMigration: ${JSON.stringify(dataMigrationResultTracker, null, 2)}`)
    console.log(`Batch results for imageMigration: ${JSON.stringify(imageMigrationResultTracker, null, 2)}`)

    if (batchSize > 50) {
      // sleep for a half second to avoid throttling
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return {
    __typename: 'TableMigrationResponse' as TableMigrationResponse['__typename'],
    mainTableResult: dataMigrationResultTracker,
    imageResult: imageMigrationResultTracker,
  }
}

function getImagesToProcess(tableName: MigrationTableName, item: Attraction | Destination | Photographer) {
  if (tableName === MigrationTableName.ATTRACTION) {
    const attractionItem = item as Attraction

    const validImagesToProcess = (attractionItem.images ?? []).filter((image): image is S3Object =>
      Boolean(image?.bucket && image?.key),
    )

    return validImagesToProcess
  } else if (tableName === MigrationTableName.DESTINATION) {
    const destinationItem = item as Destination

    const validImagesToProcess = ([destinationItem.coverImage] ?? []).filter((image): image is S3Object =>
      Boolean(image?.bucket && image?.key),
    )

    return validImagesToProcess
  } else {
    // return empty array for other entities which don't have photos
    return []
  }
}

// Helper function for S3 operations
async function addImageToTargetBucketIfNotExists({
  image,
  targetBucket,
  s3,
}: {
  image: S3Object
  targetBucket: string
  s3: S3
}): Promise<MigrateItemResult> {
  if (!image?.bucket || !image?.key) {
    const message = `Image is missing bucket or key: ${JSON.stringify(image)}`
    console.error(message)
    throw new Error(message)
  }

  const sourceParams = {
    Bucket: image.bucket,
    Key: `public/${image.key}`,
  }
  const targetParams = {
    Bucket: targetBucket,
    Key: `public/${image.key}`,
  }

  try {
    await s3.headObject(targetParams).promise()
    // console.log('Image already exists, skipping')
    return MigrateItemResult.SKIPPED
  } catch (error: any) {
    if (error?.code === 'NotFound') {
      // console.log("Target image doesn't exist, copying from source")
      const copyParams = {
        CopySource: `${sourceParams.Bucket}/${sourceParams.Key}`,
        ...targetParams,
      }

      // console.log(`copyParams: ${JSON.stringify(copyParams, null, 2)}`)
      await s3.copyObject(copyParams).promise()
      // console.log('Image copied successfully, path: ', targetParams.Key)
      return MigrateItemResult.SUCCESS
    }
    console.error(`error: ${JSON.stringify(error, null, 2)}`)
    throw error
  }
}

const getBucketListCountDictionary = async (documentClient: AWS.DynamoDB.DocumentClient, tableSuffix: string) => {
  const userAttractionTableName = `UserAttraction-${tableSuffix}`
  let userAttractions = await scanFields(documentClient, userAttractionTableName, ['attractionId'])

  // compute a dictionary of attractionId -> bucketListCount by iterating over userAttractions
  // and incrementing the bucketListCount for each attractionId
  const bucketListCountDictionary = userAttractions.reduce((acc, userAttraction) => {
    const attractionId = userAttraction.attractionId
    const bucketListCount = acc[attractionId] ?? 0
    acc[attractionId] = bucketListCount + 1
    return acc
  }, {} as { [key: string]: number })

  return bucketListCountDictionary
}

const getGooglePlaceLastUpdatedAtDictionary = async (
  documentClient: AWS.DynamoDB.DocumentClient,
  tableSuffix: string,
): Promise<{ [key: string]: string }> => {
  const googlePlaceTableName = `GooglePlace-${tableSuffix}`
  let googlePlaces = await scanFields(documentClient, googlePlaceTableName, ['id', 'dataLastUpdatedAt'])

  const googlePlaceLastUpdatedAtDictionary: { [key: string]: string } = {}

  googlePlaces.forEach((googlePlace) => {
    if (googlePlace.dataLastUpdatedAt) {
      googlePlaceLastUpdatedAtDictionary[googlePlace.id] = googlePlace.dataLastUpdatedAt
    }
  })

  return googlePlaceLastUpdatedAtDictionary
}

const createOpenSearchQuery = ({ googlePlaceIds }: { googlePlaceIds: string[] }) => {
  const mustNotConditions = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions = [
    {
      terms: {
        googlePlaceIds,
      },
    },
    {
      term: {
        isTravaCreated: 1,
      },
    },
  ]

  const query = {
    bool: {
      filter: filterConditions,
      must_not: mustNotConditions,
    },
  }

  return {
    _source: {
      includes: ['id', 'authorType'],
    },
    size: 25,
    query,
  }
}

export {
  processItemsInBatches,
  processItem,
  processAttractionItem,
  scanAll,
  getBucketListCountDictionary,
  getGooglePlaceLastUpdatedAtDictionary,
  getAllGooglePlaceIdsFromAttractionLocations,
}
