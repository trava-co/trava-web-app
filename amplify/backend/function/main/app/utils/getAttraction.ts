import { LambdaGetAttractionQuery, LambdaGetAttractionQueryVariables } from 'shared-types/API'
import { lambdaGetAttraction } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'

async function getAttraction(variables: LambdaGetAttractionQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetAttractionQueryVariables, LambdaGetAttractionQuery>({
    query: lambdaGetAttraction,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getAttraction
}

export default getAttraction
