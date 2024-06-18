import { LambdaGetUserFollowQuery, LambdaGetUserFollowQueryVariables } from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import { lambdaGetUserFollow } from 'shared-types/graphql/lambda'

async function getUserFollow(variables: LambdaGetUserFollowQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetUserFollowQueryVariables, LambdaGetUserFollowQuery>({
    query: lambdaGetUserFollow,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUserFollow
}

export default getUserFollow
