import { AppSyncResolverHandler } from 'aws-lambda'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { GoogleGetAPIKeyResult, GetGoogleAPIKeyQueryVariables, PLATFORM } from 'shared-types/API'

const getGoogleAPIKey: AppSyncResolverHandler<GetGoogleAPIKeyQueryVariables, GoogleGetAPIKeyResult> = async (event) => {
  console.log('google get api key')

  /**
   * Main query
   */

  const { platform, isDev } = event.arguments.input

  let key: string | undefined

  if (isDev) {
    key = await getSSMVariable('GOOGLE_AUTOCOMPLETE_API_KEY_DEV')
  } else if (platform === PLATFORM.IOS) {
    key = await getSSMVariable('GOOGLE_AUTOCOMPLETE_API_KEY_IOS')
  } else if (platform === PLATFORM.ANDROID) {
    key = await getSSMVariable('GOOGLE_AUTOCOMPLETE_API_KEY_ANDROID')
  }

  if (!key) {
    throw new Error('no key found in SSM')
  }

  return { __typename: 'GoogleGetAPIKeyResult', key }
}

export default getGoogleAPIKey
