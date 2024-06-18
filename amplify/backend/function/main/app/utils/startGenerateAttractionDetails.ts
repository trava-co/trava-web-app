import aws from 'aws-sdk'
import { updateAttractionWithFailure } from './updateAttraction'
import { GenerationStep } from 'shared-types/API'

const lambda = new aws.Lambda()

interface IStartGenerateAttractionDetails {
  attractionId: string
  failureCount: number
  shouldThrowIfError: boolean
  withDynamoDbClient: boolean
}

export async function startGenerateAttractionDetails({
  attractionId,
  failureCount,
  shouldThrowIfError,
  withDynamoDbClient,
}: IStartGenerateAttractionDetails) {
  try {
    const res = await lambda
      .invoke({
        FunctionName: `generateAttractionDetails-${process.env.ENV}`,
        Payload: JSON.stringify({
          arguments: {
            attractionId,
          },
        }),
        InvocationType: 'Event', // for asynchronous execution
      })
      .promise()

    console.log(`response from startGenerateAttractionDetails async invocation: ${JSON.stringify(res, null, 2)}.`)

    return res
  } catch (error: any) {
    await updateAttractionWithFailure({
      attractionId,
      step: GenerationStep.GET_DETAILS,
      failureCount,
      errorMessage: error.message,
      withDynamoDbClient,
    }).catch((error) => console.error(`Failed to update attraction with failure: ${error.message}`))

    if (shouldThrowIfError) {
      throw error
    }
  }
}
