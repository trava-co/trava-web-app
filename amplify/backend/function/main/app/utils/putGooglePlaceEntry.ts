import {
  CreateGooglePlaceInput,
  LambdaPrivateCreateGooglePlaceMutation,
  LambdaPrivateCreateGooglePlaceMutationVariables,
  LambdaGetGooglePlaceQuery,
  LambdaGetGooglePlaceQueryVariables,
  PlaceDataInput,
} from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import { lambdaGetGooglePlace, lambdaPrivateCreateGooglePlace } from 'shared-types/graphql/lambda'
import { retryWithExponentialBackoff } from './retryWithExponentialBackoff'
import { getGooglePlaceDetails } from './getGooglePlaceDetails'

const now = new Date().toISOString()

const putGooglePlaceEntry = async ({
  googlePlaceId,
  GOOGLE_MAPS_KEY,
}: {
  googlePlaceId: string
  GOOGLE_MAPS_KEY?: string
}) => {
  // it's possible that the GooglePlace already exists from a previous attraction creation, so if we can get it, we'll return it
  let getPlaceResult
  try {
    getPlaceResult = await ApiClient.get()
      .useIamAuth()
      .apiFetch<LambdaGetGooglePlaceQueryVariables, LambdaGetGooglePlaceQuery>({
        query: lambdaGetGooglePlace,
        variables: { id: googlePlaceId },
      })
  } catch (error) {
    throw new Error(
      `Encountered error when querying GooglePlace table for google place id ${googlePlaceId}. Error: ${error}`,
    )
  }

  if (getPlaceResult.data?.getGooglePlace) {
    console.log(`google place already exists for googlePlaceId: ${googlePlaceId}`)

    return getPlaceResult.data.getGooglePlace
  }

  console.log(`google place does NOT exist for googlePlaceId: ${googlePlaceId}`)
  // else, query google for the place details
  let googlePlaceData: PlaceDataInput
  try {
    googlePlaceData = await retryWithExponentialBackoff({
      func: () => getGooglePlaceDetails({ placeId: googlePlaceId, GOOGLE_MAPS_KEY }),
    })
  } catch (error) {
    throw new Error(`Error getting google place details from google places api. ${error}`)
  }

  const input: CreateGooglePlaceInput = {
    id: googlePlaceId,
    data: googlePlaceData,
    isValid: 1,
    consecutiveFailedRequests: 0,
    dataLastCheckedAt: now,
    dataLastUpdatedAt: now,
  }

  let createPlaceResult
  try {
    createPlaceResult = await ApiClient.get()
      .useIamAuth()
      .apiFetch<LambdaPrivateCreateGooglePlaceMutationVariables, LambdaPrivateCreateGooglePlaceMutation>({
        query: lambdaPrivateCreateGooglePlace,
        variables: { input },
      })
  } catch (error) {
    throw new Error(`Error creating google place for googlePlaceId: ${googlePlaceId}. ${error}`)
  }

  // if axios successfully communicates with graphql api, but graphql api returns an error, it will be in the errors field
  // TODO unified error handler
  const result = createPlaceResult.data?.privateCreateGooglePlace
  if (createPlaceResult.errors?.length || !result) {
    // TODO handle error message parsing:
    throw new Error(
      `Error creating google place for googlePlaceId: ${googlePlaceId} ${createPlaceResult.errors.map(
        (error: any) => error.message,
      )}`,
    )
  }

  return result
}

export default putGooglePlaceEntry
