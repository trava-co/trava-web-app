import { AppSyncResolverHandler } from 'aws-lambda'
import {
  Coords,
  GoogleGetPlaceDetailsLocation,
  GoogleGetPlaceDetailsQueryVariables,
  GoogleGetPlaceDetailsResult,
  Hours,
  OpenCloseTime,
  Period,
  Rating,
} from 'shared-types/API'
import { getGooglePlaceDetails } from '../../utils/getGooglePlaceDetails'
import { getTimezoneFromCoords } from '../../utils/getTimezoneFromCoords'

const googleGetPlaceDetails: AppSyncResolverHandler<
  GoogleGetPlaceDetailsQueryVariables,
  GoogleGetPlaceDetailsResult
> = async (event) => {
  console.log('googleGetPlaceDetails')

  /**
   * Main query
   */

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  const { placeId } = event.arguments.input
  // todo: https://travausa.atlassian.net/browse/TRV-955 deviceLanguage does not map to the google api, so we need to create a custom mapping at some point

  if (!placeId) throw new Error('invalid arguments')

  const placeData = await getGooglePlaceDetails({ placeId })

  // TODO: migrate this to simply return the placeData object. many frontend changes will be required.
  // https://travausa.atlassian.net/browse/TRV-1326
  let response: GoogleGetPlaceDetailsResult = {
    __typename: 'GoogleGetPlaceDetailsResult' as GoogleGetPlaceDetailsResult['__typename'],
    placeName: placeData.name,
    location: {
      __typename: 'Location' as GoogleGetPlaceDetailsLocation['__typename'],
      city: placeData.city,
      state: placeData.state,
      country: placeData.country,
      continent: placeData.continent,
      googlePlaceId: placeId,
      formattedAddress: placeData.formattedAddress,
      googlePlacePageLink: placeData.googlePlacePageLink,
      websiteLink: placeData.websiteLink,
      phone: placeData.phone,
      businessStatus: placeData.businessStatus,
      timezone: getTimezoneFromCoords(placeData.coords),
      // add __typename to nested objects
      coords: {
        ...placeData.coords,
        __typename: 'Coords' as Coords['__typename'],
      },
      googleRating: {
        ...placeData.rating,
        __typename: 'Rating' as Rating['__typename'],
      },
      ...(placeData.hours && {
        hours: {
          ...placeData.hours,
          __typename: 'Hours' as Hours['__typename'],
          periods: placeData.hours?.periods?.map((period) => ({
            __typename: 'Period' as Period['__typename'],
            open: {
              __typename: 'OpenCloseTime' as OpenCloseTime['__typename'],
              ...period.open,
            },
            ...(period.close && {
              close: {
                __typename: 'OpenCloseTime' as OpenCloseTime['__typename'],
                ...period.close,
              },
            }),
          })),
        },
      }),
    },
  }

  return response

  /**
   * after hooks
   */
  // none
}

export default googleGetPlaceDetails
