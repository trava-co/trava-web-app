import { Attraction } from 'shared-types/API'
import ApiClient from './ApiClient'
import { dbClient } from './dbClient'
import { getTableName } from './getTableName'
import { lambdaGetAttractionFailureCount } from 'shared-types/graphql/lambda'
import { LambdaGetAttractionFailureCountQuery, LambdaGetAttractionFailureCountQueryVariables } from 'shared-types/API'

const attractionTable = getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME)

interface IGetAttraction {
  attractionId: string
}

export async function getAttractionWithDynamoDbClient({ attractionId }: IGetAttraction): Promise<Attraction> {
  const params = {
    TableName: attractionTable,
    Key: { id: attractionId },
  }

  const res = await dbClient.get(params).promise()

  return res.Item as Attraction
}

export async function getAttractionFailureCount({ attractionId }: IGetAttraction) {
  const res = await ApiClient.get().apiFetch<
    LambdaGetAttractionFailureCountQueryVariables,
    LambdaGetAttractionFailureCountQuery
  >({
    query: lambdaGetAttractionFailureCount,
    variables: {
      id: attractionId,
    },
  })

  return res.data.getAttraction?.generation?.failureCount ?? 0
}
