import {
  AttractionExistsItem,
  Coords,
  CreateAttractionInput,
  SearchGooglePlace,
  SearchGooglePlaceData,
  SearchLocation,
  SearchStartEndLocation,
  StartEndLocationInput,
  CoordsInput,
} from 'shared-types/API'

interface IGetAttractionExistsItem {
  attraction: CreateAttractionInput
  coords: CoordsInput
}

function getAttractionExistsItem({ attraction, coords }: IGetAttractionExistsItem): AttractionExistsItem {
  const locations: SearchStartEndLocation[] = (attraction.locations ?? [])
    .filter((location): location is StartEndLocationInput => Boolean(location))
    .map((location) => {
      return {
        __typename: 'SearchStartEndLocation' as SearchStartEndLocation['__typename'],
        id: location.id as string,
        startLoc: {
          __typename: 'SearchLocation' as SearchLocation['__typename'],
          id: location.startLoc.id as string,
          googlePlaceId: location.startLoc.googlePlaceId,
          googlePlace: {
            __typename: 'SearchGooglePlace' as SearchGooglePlace['__typename'],
            data: {
              __typename: 'SearchGooglePlaceData' as SearchGooglePlaceData['__typename'],
              coords: {
                __typename: 'Coords' as Coords['__typename'],
                ...coords,
              },
            },
          },
        },
        endLoc: {
          __typename: 'SearchLocation' as SearchLocation['__typename'],
          id: location.endLoc.id as string,
          googlePlaceId: location.endLoc.googlePlaceId,
          googlePlace: {
            __typename: 'SearchGooglePlace' as SearchGooglePlace['__typename'],
            data: {
              __typename: 'SearchGooglePlaceData' as SearchGooglePlaceData['__typename'],
              coords: {
                __typename: 'Coords' as Coords['__typename'],
                ...coords,
              },
            },
          },
        },
      }
    })

  return {
    __typename: 'AttractionExistsItem',
    id: attraction.id!,
    name: attraction.name,
    locations,
    duration: attraction.duration,
    type: attraction.type,
    attractionCategories: attraction.attractionCategories,
    attractionCuisine: attraction.attractionCuisine,
    bucketListCount: attraction.bucketListCount,
    isTravaCreated: attraction.isTravaCreated,
    deletedAt: attraction.deletedAt,
  }
}

export { getAttractionExistsItem }
