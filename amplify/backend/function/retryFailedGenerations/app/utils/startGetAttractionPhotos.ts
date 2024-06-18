import aws from 'aws-sdk'
import { GenerationStep, GetAttractionPhotosQueryVariables } from 'shared-types/API'
import { updateAttractionWithFailure } from './updateAttraction'

const lambda = new aws.Lambda()

interface IStartGetAttractionPhotos {
  queryVariables: GetAttractionPhotosQueryVariables
  failureCount: number
}

export async function startGetAttractionPhotos({ queryVariables, failureCount }: IStartGetAttractionPhotos) {
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
      failureCount,
      step: GenerationStep.GET_PHOTOS,
      errorMessage: error.message,
    })
  }
}
