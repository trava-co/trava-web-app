import { LambdaDeleteUserFollowMutation, LambdaDeleteUserFollowMutationVariables } from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import { lambdaDeleteUserFollow } from 'shared-types/graphql/lambda'

async function deleteUserFollow(variables: LambdaDeleteUserFollowMutationVariables) {
  const res = await ApiClient.get().apiFetch<LambdaDeleteUserFollowMutationVariables, LambdaDeleteUserFollowMutation>({
    query: lambdaDeleteUserFollow,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.deleteUserFollow
}

export default deleteUserFollow
