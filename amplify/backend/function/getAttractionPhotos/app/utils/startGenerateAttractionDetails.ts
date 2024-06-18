import aws from 'aws-sdk'

const lambda = new aws.Lambda()

export async function startGenerateAttractionDetails(attractionId: string) {
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
}
