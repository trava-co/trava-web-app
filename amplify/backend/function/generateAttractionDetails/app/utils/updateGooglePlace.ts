import ApiClient from './ApiClient'
import {
  LambdaPrivateUpdateGooglePlaceMutationVariables,
  LambdaPrivateUpdateGooglePlaceMutation,
} from 'shared-types/API'
import { lambdaPrivateUpdateGooglePlace } from 'shared-types/graphql/lambda'

export const updateGooglePlace = async (updateGooglePlaceInput: LambdaPrivateUpdateGooglePlaceMutationVariables) => {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateUpdateGooglePlaceMutationVariables,
    LambdaPrivateUpdateGooglePlaceMutation
  >({
    query: lambdaPrivateUpdateGooglePlace,
    variables: { input: updateGooglePlaceInput.input },
  })

  if (res.errors?.length) {
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateGooglePlace
}
