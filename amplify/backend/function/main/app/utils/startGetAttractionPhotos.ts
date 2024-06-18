import aws from 'aws-sdk'
import { GenerationStep, GetAttractionPhotosQueryVariables } from 'shared-types/API'
import { updateAttractionWithFailure } from './updateAttraction'

const lambda = new aws.Lambda()

interface IStartGetAttractionPhotos {
  queryVariables: GetAttractionPhotosQueryVariables
  failureCount: number
  shouldThrowIfError: boolean
  withDynamoDbClient: boolean
}

export async function startGetAttractionPhotos({
  queryVariables,
  failureCount,
  shouldThrowIfError,
  withDynamoDbClient,
}: IStartGetAttractionPhotos) {
  try {
    const res = await lambda
      .invoke({
        FunctionName: `getAttractionPhotos-${process.env.ENV}`,
        Payload: JSON.stringify({ arguments: queryVariables }),
        InvocationType: 'Event', // for asynchronous execution
      })
      .promise()

    console.log(`response from startGetAttractionPhotos async invocation: ${JSON.stringify(res, null, 2)}.`)

    return res
  } catch (error: any) {
    await updateAttractionWithFailure({
      attractionId: queryVariables.input.attractionId,
      step: GenerationStep.GET_PHOTOS,
      failureCount,
      errorMessage: error.message,
      withDynamoDbClient,
    }).catch((error) => console.error(`Failed to update attraction with failure: ${error.message}`))

    if (shouldThrowIfError) {
      throw error
    }
  }
}
