import {
  Location,
  SearchGooglePlace,
  SearchGooglePlaceData,
  SearchLocation,
  SearchStartEndLocation,
  StartEndLocation,
} from 'shared-types/API'

export function transformAttractionLocationsToSearchLocations(locations: StartEndLocation[]): SearchStartEndLocation[] {
  return (locations ?? [])
    .filter((location): location is StartEndLocation => Boolean(location))
    .map((location) => {
      return {
        __typename: 'SearchStartEndLocation' as SearchStartEndLocation['__typename'],
        id: location.id as string,
        startLoc: transformLocation(location.startLoc),
        endLoc: transformLocation(location.endLoc),
      }
    })
}

function transformLocation(location: Location): SearchLocation {
  return {
    __typename: 'SearchLocation' as SearchLocation['__typename'],
    id: location.id as string,
    googlePlaceId: location.googlePlaceId,
    googlePlace: {
      __typename: 'SearchGooglePlace' as SearchGooglePlace['__typename'],
      data: {
        __typename: 'SearchGooglePlaceData' as SearchGooglePlaceData['__typename'],
        coords: location.googlePlace.data.coords,
        name: location.googlePlace.data.name,
        city: location.googlePlace.data.city,
        formattedAddress: location.googlePlace.data.formattedAddress,
        businessStatus: location.googlePlace.data.businessStatus,
        rating: location.googlePlace.data.rating,
        hours: location.googlePlace.data.hours,
      },
    },
  }
}
