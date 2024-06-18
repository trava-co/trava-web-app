import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaGetUserAuthProviderByUsernameQuery,
  LambdaGetUserAuthProviderByUsernameQueryVariables,
  SignInErrorCheckIfUsernameExistsResponse,
  SignInErrorCheckIfUsernameExistsQueryVariables,
  PROVIDER,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaGetUserAuthProviderByUsername } from 'shared-types/graphql/lambda'

const signInErrorCheckIfUsernameExists: AppSyncResolverHandler<
  SignInErrorCheckIfUsernameExistsQueryVariables,
  SignInErrorCheckIfUsernameExistsResponse
> = async (event) => {
  if (!event.arguments.username) {
    throw new Error('Username is required')
  }

  const user = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaGetUserAuthProviderByUsernameQueryVariables, LambdaGetUserAuthProviderByUsernameQuery>({
      query: lambdaGetUserAuthProviderByUsername,
      variables: {
        username: event.arguments.username,
      },
    })

  const userData = user.data.getUserByUsername?.items?.[0]

  const provider = userData?.googleId
    ? PROVIDER.GOOGLE
    : userData?.facebookId
    ? PROVIDER.FACEBOOK
    : userData?.appleId
    ? PROVIDER.APPLE
    : PROVIDER.NONE

  return {
    __typename: 'SignInErrorCheckIfUsernameExistsResponse',
    provider,
  }
}

export default signInErrorCheckIfUsernameExists
