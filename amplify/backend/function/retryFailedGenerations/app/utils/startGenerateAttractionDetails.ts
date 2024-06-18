import aws from 'aws-sdk'
import { updateAttractionWithFailure } from './updateAttraction'
import { GenerationStep } from 'shared-types/API'

const lambda = new aws.Lambda()

interface IStartGenerateAttractionDetails {
  attractionId: string
  failureCount: number
}

export async function startGenerateAttractionDetails({ attractionId, failureCount }: IStartGenerateAttractionDetails) {
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
      failureCount,
      step: GenerationStep.GET_DETAILS,
      errorMessage: error.message,
    })
  }
}
