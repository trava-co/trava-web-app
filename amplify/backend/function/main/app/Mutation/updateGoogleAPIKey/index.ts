import { AppSyncResolverHandler } from 'aws-lambda'
import { SSMClient, PutParameterCommand } from '@aws-sdk/client-ssm'
import { UpdateGoogleAPIKeyInput, UpdateGoogleAPIKeyResponse, BACKEND_ENV_NAME } from 'shared-types/API'

export const updateGoogleAPIKey: AppSyncResolverHandler<UpdateGoogleAPIKeyInput, UpdateGoogleAPIKeyResponse> = async (
  event,
) => {
  console.log('Starting Google API Key Update:')

  // Authorization Check
  if (
    !(
      event.identity &&
      'sub' in event.identity &&
      'claims' in event.identity &&
      'cognito:groups' in event.identity.claims &&
      event.identity.claims['cognito:groups'].includes('admin')
    )
  ) {
    throw new Error('Not Authorized')
  }

  console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`)

  // Validate Input
  if (
    !(
      event.arguments &&
      'input' in event.arguments &&
      'googleAPIKey' in (event.arguments.input as UpdateGoogleAPIKeyInput)
    )
  ) {
    throw new Error('Invalid Input')
  }

  const { googleAPIKey, platform, isDev } = event.arguments.input as UpdateGoogleAPIKeyInput

  const ssmClient = new SSMClient({ region: 'us-east-1' })
  const envsUpdated: BACKEND_ENV_NAME[] = []
  const envsFailed: BACKEND_ENV_NAME[] = []

  for (const env of Object.values(BACKEND_ENV_NAME)) {
    const parameterName = `/amplify/d3nzalola22yka/${env.toLowerCase()}/AMPLIFY_main_GOOGLE_AUTOCOMPLETE_API_KEY_${
      isDev ? 'DEV' : platform
    }`

    console.log(`setting ${parameterName} for ${env}`)

    try {
      const command = new PutParameterCommand({
        Name: parameterName,
        Value: googleAPIKey,
        Overwrite: true,
        Type: 'SecureString',
      })

      await ssmClient.send(command)
      console.log(`Updated parameter for ${env}`)
      envsUpdated.push(env)
    } catch (error) {
      console.error(`Error updating SSM Parameter for ${env}:`, error)
      envsFailed.push(env)
    }
  }

  return {
    __typename: 'UpdateGoogleAPIKeyResponse',
    envsUpdated,
    envsFailed,
  }
}

export default updateGoogleAPIKey
