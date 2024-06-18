import { LambdaGetDestinationQuery, LambdaGetDestinationQueryVariables } from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import { lambdaGetDestination } from 'shared-types/graphql/lambda'

async function _getDestination(variables: LambdaGetDestinationQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetDestinationQueryVariables, LambdaGetDestinationQuery>({
    query: lambdaGetDestination,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getDestination
}

export default _getDestination
