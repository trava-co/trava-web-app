export const getAllAttractionIdsInDynamoDb = async (
  documentClient: AWS.DynamoDB.DocumentClient,
  tableName: string,
  filterDetails?: any,
): Promise<Set<string>> => {
  let ids: string[] = []

  let result = await documentClient
    .scan({
      TableName: tableName,
      ProjectionExpression: 'id',
      ...filterDetails,
    })
    .promise()

  if ((result?.Count ?? 0) > 0 && result.Items) {
    ids = ids.concat(result.Items.map((item) => item.id))
  }

  while (result.LastEvaluatedKey) {
    result = await documentClient
      .scan({
        TableName: tableName,
        ProjectionExpression: 'id',
        ExclusiveStartKey: result.LastEvaluatedKey,
        ...filterDetails,
      })
      .promise()

    if ((result?.Count ?? 0) > 0 && result.Items) {
      ids = ids.concat(result.Items.map((item) => item.id))
    }
  }

  console.log(`Found ${ids.length} ids: ${tableName}`)

  return new Set(ids)
}
