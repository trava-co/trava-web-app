import {
  GenerationStep,
  LambdaPrivateUpdateAttractionMutation,
  LambdaPrivateUpdateAttractionMutationVariables,
  Status,
  UpdateAttractionInput,
} from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import dbClient from './dbClient'
import { lambdaPrivateUpdateAttraction } from 'shared-types/graphql/lambda'
import { sendSlackNotification } from './sendSlackNotification'
import { getSSMVariable } from './getSSMVariable'
import getTableName from './getTableName'

export async function updateAttraction(updateAttractionInput: UpdateAttractionInput) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateUpdateAttractionMutationVariables,
    LambdaPrivateUpdateAttractionMutation
  >({
    query: lambdaPrivateUpdateAttraction,
    variables: {
      input: updateAttractionInput,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateAttraction
}

async function updateAttractionWithDynamoDbClient(updateAttractionInput: UpdateAttractionInput) {
  const attractionTable = getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME)

  // Prepare the expression attribute names and values
  let updateExpression = 'set '
  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  for (const property in updateAttractionInput) {
    if (property !== 'id') {
      // Exclude 'id' from being updated
      updateExpression += `#${property} = :${property}, `
      expressionAttributeNames[`#${property}`] = property
      expressionAttributeValues[`:${property}`] = updateAttractionInput[property as keyof UpdateAttractionInput]
    }
  }

  // Remove trailing comma and space
  updateExpression = updateExpression.slice(0, -2)

  const params = {
    TableName: attractionTable,
    Key: { id: updateAttractionInput.id }, // Assuming 'id' is the primary key
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }

  await dbClient.update(params).promise()
}

export interface IUpdateAttractionWithFailure {
  attractionId: string
  failureCount: number
  step: GenerationStep
  errorMessage: string
  withDynamoDbClient: boolean
}

export async function updateAttractionWithFailure({
  attractionId,
  failureCount,
  step,
  errorMessage,
  withDynamoDbClient,
}: IUpdateAttractionWithFailure) {
  console.error(`Error in step ${step} for attraction ${attractionId}: ${errorMessage}`)

  // if env is staging or prod, send slack notification
  if (process.env.ENV === 'prod' || process.env.ENV === 'staging') {
    const SLACK_WEBHOOK_URL = await getSSMVariable('SLACK_WEBHOOK_URL')
    await sendSlackNotification(
      SLACK_WEBHOOK_URL,
      `${process.env.ENV} backend environment:\nGeneration step ${step} failed for attraction ${attractionId}. \nError: ${errorMessage}`,
    ).catch((error) => {
      console.error('Error sending slack notification:', error)
    })
  }

  const updateAttractionInput: UpdateAttractionInput = {
    id: attractionId,
    generation: {
      step,
      status: Status.FAILED,
      failureCount: failureCount + 1,
      lastUpdatedAt: new Date().toISOString(),
      lastFailureReason: errorMessage,
    },
    descriptionLong: "This is taking longer than usual. We're working on it!",
    descriptionShort: 'Still generating description and details...',
  }

  if (withDynamoDbClient) {
    await updateAttractionWithDynamoDbClient(updateAttractionInput)
  } else {
    await updateAttraction(updateAttractionInput)
  }

  console.error(`Attraction ${attractionId} status updated to FAILED`)
}
