import aws from 'aws-sdk'

type SSMVariable = 'GOOGLE_MAPS_API_KEY' | 'YELP_API_KEY' | 'OPENAI_API_KEY' | 'SLACK_WEBHOOK_URL' | 'BING_AI_URL'

export async function getSSMVariable(variableName: SSMVariable) {
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: [variableName].map((secretName) => process.env[secretName] || ''),
      WithDecryption: true,
    })
    .promise()

  if (!Parameters) {
    throw new Error('Failed to retrieve SSM parameters')
  }

  const token = Parameters.find((parameter) => parameter.Name === process.env[variableName])?.Value

  if (!token || token.length === 0) {
    throw new Error(`Failed to retrieve a secret value: ${variableName}`)
  }

  return token
}
