import {
  CoordsInput,
  ItinerarySearchAttractionItem,
  LambdaGetAttractionDetailsForSearchAttractionQuery,
  LambdaGetAttractionDetailsForSearchAttractionQueryVariables,
  AttractionSeason,
  VotingResultsInput,
} from 'shared-types/API'
import { lambdaGetAttractionDetailsForSearchAttraction } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'
import { transformAttractionLocationsToSearchLocations } from './transformLocationsToSearchLocations'
import * as turf from '@turf/turf'
import filterCardsBySeasons from './filter-cards-by-seasons'

interface IGetItinerarySearchAttraction {
  attractionId: string
  centerCoords: CoordsInput
  destinationDates: string[]
  inMyBucketList: boolean
  onItinerary: boolean
  votingResults?: VotingResultsInput
}

export async function getItinerarySearchAttraction({
  attractionId,
  centerCoords,
  destinationDates,
  inMyBucketList,
  onItinerary,
  votingResults,
}: IGetItinerarySearchAttraction): Promise<ItinerarySearchAttractionItem> {
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
  const searchLocationsCoordinatePairs: [number, number][] = []

  for (const location of searchLocations) {
    const startLocCoords = location.startLoc.googlePlace?.data.coords
    startLocCoords && searchLocationsCoordinatePairs.push([startLocCoords.long, startLocCoords.lat])
    const endLocCoords = location.endLoc.googlePlace?.data.coords
    endLocCoords && searchLocationsCoordinatePairs.push([endLocCoords.long, endLocCoords.lat])
  }

  // get the min haversine distance between any of the searchLocationsCoordinatePairs and the centerCoords
  const minDistance = searchLocationsCoordinatePairs.reduce((minDistance, coordinatePair) => {
    const distance = turf.distance(coordinatePair, [centerCoords.long, centerCoords.lat])
    return distance < minDistance ? distance : minDistance
  }, Infinity)

  const seasons = attraction.seasons?.filter((season): season is AttractionSeason => !!season)

  const inSeason = filterCardsBySeasons({
    seasons,
    destinationStartDate: destinationDates[0],
    destinationEndDate: destinationDates[1],
  })

  const searchAttraction: ItinerarySearchAttractionItem = {
    __typename: 'ItinerarySearchAttractionItem',
    attractionCategories: attraction.attractionCategories,
    attractionCuisine: attraction.attractionCuisine,
    ...(attraction.author && {
      id: attraction.author.id,
      name: attraction.author.name,
      username: attraction.author.username,
      avatar: attraction.author.avatar,
    }),
    bucketListCount: attraction.bucketListCount,
    distance: minDistance,
    duration: attraction.duration,
    id: attraction.id,
    images: attraction.images,
    isTravaCreated: attraction.isTravaCreated,
    locations: searchLocations,
    name: attraction.name,
    recommendationBadges: attraction.recommendationBadges,
    type: attraction.type,
    yesVotes: votingResults?.yesVotes || 0,
    noVotes: votingResults?.noVotes || 0,
    inMyBucketList,
    onItinerary,
    inSeason,
  }

  return searchAttraction
}
