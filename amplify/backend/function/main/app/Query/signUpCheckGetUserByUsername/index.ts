import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaGetUserByUsernameQuery,
  LambdaGetUserByUsernameQueryVariables,
  SignUpCheckGetUserByUsernameQueryVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaGetUserByUsername } from 'shared-types/graphql/lambda'
import users from './data/usernames.json'

const signUpCheckGetUserByUsername: AppSyncResolverHandler<SignUpCheckGetUserByUsernameQueryVariables, string> = async (
  event,
) => {
  if (!event.arguments.username) {
    throw new Error('Username is required')
  }

  const user = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaGetUserByUsernameQueryVariables, LambdaGetUserByUsernameQuery>({
      query: lambdaGetUserByUsername,
      variables: {
        username: event.arguments.username,
      },
    })

  const usernameExistsInDynamo = user.data.getUserByUsername?.items?.[0]?.id
  if (usernameExistsInDynamo) {
    return usernameExistsInDynamo
  }

  // we started with any case usernames, but now we want to enforce lowercase, and want to prevent
  // users from registering with a username that is already in use in a different capitalization
  const usernameWithDifferentCase = users.find((users) => users.username === event.arguments.username)
  return usernameWithDifferentCase?.id ?? ''
}

export default signUpCheckGetUserByUsername
