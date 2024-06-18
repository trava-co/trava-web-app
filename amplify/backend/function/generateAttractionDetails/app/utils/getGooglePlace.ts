import {
  LambdaGetDetailsForAttractionGenerationQueryVariables,
  LambdaGetDetailsForAttractionGenerationQuery,
} from 'shared-types/API'
import { lambdaGetDetailsForAttractionGeneration } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient'

export async function getAttraction(variables: LambdaGetDetailsForAttractionGenerationQueryVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaGetDetailsForAttractionGenerationQueryVariables,
    LambdaGetDetailsForAttractionGenerationQuery
  >({
    query: lambdaGetDetailsForAttractionGeneration,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getAttraction
}
