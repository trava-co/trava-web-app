import {
  AdminCreateAttractionMutationVariables,
  LambdaCustomPrivateCreateAttractionMutation,
  LambdaCustomPrivateCreateAttractionMutationVariables,
  Coords,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaCustomPrivateCreateAttraction } from 'shared-types/graphql/lambda'
import checkAttractionAccessCreate from './before/checkAttractionAccessCreate'
import { CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'
import { getTimezoneFromCoords } from '../../utils/getTimezoneFromCoords'
import putGooglePlaceEntry from '../../utils/putGooglePlaceEntry'

const beforeHooks = [checkAttractionAccessCreate]

async function _privateCreateAttraction(
  createAttractionMutationVariables: LambdaCustomPrivateCreateAttractionMutationVariables,
) {
  const res = await ApiClient.get().apiFetch<
    LambdaCustomPrivateCreateAttractionMutationVariables,
    LambdaCustomPrivateCreateAttractionMutation
  >({
    query: lambdaCustomPrivateCreateAttraction,
    variables: {
      input: createAttractionMutationVariables.input,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateAttraction
}

const adminCreateAttraction: AppSyncResolverHandler<AdminCreateAttractionMutationVariables, any> = async (event) => {
  console.log(`Running resolver: "adminCreateAttraction"`)
  /**
   * before hooks
   */

  for (const hook of beforeHooks) {
    console.log(`Running before hook: "${hook.name}"`)
    await hook(event)
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE)
  }

  const { locations } = event.arguments.input

  const filteredLocations = locations?.filter(Boolean)

  if (!filteredLocations?.length) {
    throw new Error('No location provided')
  }

  // create a dictionary composed of googlePlaceIds and coords to reduce checks to GooglePlace table
  let placeDictionary: Record<string, Coords> = {}

  // create GooglePlaces for each googlePlaceId
  for (const location of filteredLocations) {
    if (location?.startLoc?.googlePlaceId) {
      let coords = placeDictionary[location.startLoc.googlePlaceId]
      if (!coords) {
        const googlePlace = await putGooglePlaceEntry({
          googlePlaceId: location.startLoc.googlePlaceId,
        })
        coords = googlePlace.data.coords
        placeDictionary[location.startLoc.googlePlaceId] = coords
      }
      location.startLoc.timezone = getTimezoneFromCoords(coords)
    }
    if (location?.endLoc?.googlePlaceId) {
      let coords = placeDictionary[location.endLoc.googlePlaceId]
      if (!coords) {
        const googlePlace = await putGooglePlaceEntry({
          googlePlaceId: location.endLoc.googlePlaceId,
        })
        coords = googlePlace.data.coords
        placeDictionary[location.endLoc.googlePlaceId] = coords
      }
      location.endLoc.timezone = getTimezoneFromCoords(coords)
    }
  }

  const createAttractionArguments = {
    input: {
      ...event.arguments.input,
      locations: filteredLocations,
    },
  }

  const attraction = await _privateCreateAttraction(createAttractionArguments)

  if (!attraction) {
    throw new Error('Failed to create attraction')
  }

  return attraction
}

export default adminCreateAttraction
