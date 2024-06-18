import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'
import { CustomMapBoxGetPlacesQueryVariables, MapBoxGetPlacesLocation } from 'shared-types/API'
import { getSSMVariable } from '../../utils/getSSMVariable'

const removeSpecialCharacters = (str: string) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ')

const mapBoxGetPlaces: AppSyncResolverHandler<CustomMapBoxGetPlacesQueryVariables, any> = async (event) => {
  console.log('mapBoxGetPlaces')

  /**
   * Main query
   */

  const token = await getSSMVariable('MAPBOX_TOKEN')

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const { location, language, bounds, types, limit } = event.arguments.input

  if (!location || !types) throw new Error('invalid arguments')

  const res = (
    await axios.get(
      encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${removeSpecialCharacters(location)}.json`),
      {
        params: {
          access_token: token,
          types,
          limit: limit ?? 5,
          language,
          autocomplete: 'true',
          bbox: bounds?.join(','),
        },
      },
    )
  ).data

  if (!('features' in res)) return []

  const result = res.features.map((feature: any) => {
    const location: Partial<MapBoxGetPlacesLocation> = {}

    location.street = feature.properties.address
    location.city = feature.context.find((ctx: any) => ctx.id.indexOf('place') > -1)?.text
    location.state = feature.context.find(
      (ctx: any) => ctx.id.indexOf('region') > -1 || ctx.id.indexOf('locality') > -1,
    )?.text
    location.postCode = feature.context.find((ctx: any) => ctx.id.indexOf('postcode') > -1)?.text
    location.coords = {
      __typename: 'Coords',
      lat: feature.geometry.coordinates[1],
      long: feature.geometry.coordinates[0],
    }
    location.country = feature.context.find((ctx: any) => ctx.id.indexOf('country') > -1)?.text

    return {
      location,
      placeName: feature.text,
    }
  })

  /**
   * after hooks
   */
  // none

  return result
}

export default mapBoxGetPlaces
