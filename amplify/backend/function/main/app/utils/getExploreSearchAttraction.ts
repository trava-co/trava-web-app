import {
  CoordsInput,
  ExploreSearchAttractionItem,
  LambdaGetAttractionDetailsForSearchAttractionQuery,
  LambdaGetAttractionDetailsForSearchAttractionQueryVariables,
} from 'shared-types/API'
import { lambdaGetAttractionDetailsForSearchAttraction } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'
import { transformAttractionLocationsToSearchLocations } from './transformLocationsToSearchLocations'
import * as turf from '@turf/turf'

interface IGetExploreSearchAttraction {
  attractionId: string
  centerCoords?: CoordsInput | null
}

export async function getExploreSearchAttraction({
  attractionId,
  centerCoords,
}: IGetExploreSearchAttraction): Promise<ExploreSearchAttractionItem> {
  const res = await ApiClient.get().apiFetch<
    LambdaGetAttractionDetailsForSearchAttractionQueryVariables,
    LambdaGetAttractionDetailsForSearchAttractionQuery
  >({
    query: lambdaGetAttractionDetailsForSearchAttraction,
    variables: {
      id: attractionId,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  const attraction = res.data?.getAttraction
  if (!attraction) {
    throw new Error('Attraction not found')
  }

  const validLocations = attraction.locations?.filter(
    (location): location is NonNullable<typeof location> => !!location,
  )

  if (!validLocations?.length) {
    throw new Error('Attraction has no locations')
  }

  const searchLocations = transformAttractionLocationsToSearchLocations(validLocations)

  let minDistance: number | undefined

  if (centerCoords) {
    const searchLocationsCoordinatePairs: [number, number][] = []

    for (const location of searchLocations) {
      const startLocCoords = location.startLoc.googlePlace?.data.coords
      startLocCoords && searchLocationsCoordinatePairs.push([startLocCoords.long, startLocCoords.lat])
      const endLocCoords = location.endLoc.googlePlace?.data.coords
      endLocCoords && searchLocationsCoordinatePairs.push([endLocCoords.long, endLocCoords.lat])
    }

    // get the min haversine distance between any of the searchLocationsCoordinatePairs and the centerCoords
    minDistance = searchLocationsCoordinatePairs.reduce((minDistance, coordinatePair) => {
      const distance = turf.distance(coordinatePair, [centerCoords.long, centerCoords.lat])
      return distance < minDistance ? distance : minDistance
    }, Infinity)
  }

  const searchAttraction: ExploreSearchAttractionItem = {
    __typename: 'ExploreSearchAttractionItem',
    attractionCategories: attraction.attractionCategories,
    attractionCuisine: attraction.attractionCuisine,
    ...(attraction.author && {
      id: attraction.author.id,
      name: attraction.author.name,
      username: attraction.author.username,
      avatar: attraction.author.avatar,
    }),
    bucketListCount: attraction.bucketListCount,
    ...(centerCoords && { distance: minDistance }),
    duration: attraction.duration,
    id: attraction.id,
    images: attraction.images,
    isTravaCreated: attraction.isTravaCreated,
    locations: searchLocations,
    name: attraction.name,
    recommendationBadges: attraction.recommendationBadges,
    type: attraction.type,
  }

  return searchAttraction
}
