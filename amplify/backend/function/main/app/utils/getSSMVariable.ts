import aws from 'aws-sdk'

type SSMVariable =
  | 'MAPBOX_TOKEN'
  | 'GOOGLE_MAPS_API_KEY'
  | 'FLIGHTSTATS_APPID'
  | 'FLIGHTSTATS_APPKEY'
  | 'CLOUDINARY_CLOUD_NAME'
  | 'CLOUDINARY_API_KEY'
  | 'CLOUDINARY_API_SECRET'
  | 'DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID'
  | 'DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY'
  | 'TEAREX_URL'
  | 'TEAREX_API_KEY'
  | 'API_CLIENT_PRODUCTION_ACCESS_KEY_ID'
  | 'API_CLIENT_PRODUCTION_SECRET_ACCESS_KEY'
  | 'OPENAI_API_KEY'
  | 'SLACK_WEBHOOK_URL'
  | 'GOOGLE_AUTOCOMPLETE_API_KEY_IOS'
  | 'GOOGLE_AUTOCOMPLETE_API_KEY_ANDROID'
  | 'GOOGLE_AUTOCOMPLETE_API_KEY_DEV'

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
