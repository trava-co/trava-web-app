import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'
import { GoogleGetPlacesQueryVariables, GoogleGetPlacesResult } from 'shared-types/API'
import { getSSMVariable } from '../../utils/getSSMVariable'

const removeSpecialCharacters = (str: string) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ')

const googleGetPlaces: AppSyncResolverHandler<GoogleGetPlacesQueryVariables, any> = async (event) => {
  console.log('googleGetPlaces')

  /**
   * Main query
   */

  const token = await getSSMVariable('GOOGLE_MAPS_API_KEY')

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const { input, location, radius, strictbounds, language, types } = event.arguments.input
  // todo: https://travausa.atlassian.net/browse/TRV-955 deviceLanguage does not map to the google api, so we need to create a custom mapping at some point

  if (!input) throw new Error('invalid arguments')

  const res = (
    await axios.get(encodeURI(`https://maps.googleapis.com/maps/api/place/autocomplete/json`), {
      params: {
        input: removeSpecialCharacters(input),
        location: location ? `${location?.latitude},${location?.longitude}` : undefined,
        radius,
        strictbounds,
        types: types ? types.join('|') : undefined,
        key: token,
      },
    })
  ).data

  if (!('predictions' in res)) return []

  const result = res.predictions.map((prediction: any) => {
    const location: Partial<GoogleGetPlacesResult> = {}
    location.mainText = prediction.structured_formatting.main_text
    location.secondaryText = prediction.structured_formatting.secondary_text
    location.placeId = prediction.place_id
    location.types = prediction.types

    return location
  })

  /**
   * after hooks
   */
  // none

  return result
}

export default googleGetPlaces
