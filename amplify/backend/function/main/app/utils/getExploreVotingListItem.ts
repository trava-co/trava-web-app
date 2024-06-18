import {
  AttractionSeason,
  ExploreVotingListItem,
  ExploreVotingListSwipe,
  LambdaGetAttractionDetailsForSearchAttractionQuery,
  LambdaGetAttractionDetailsForSearchAttractionQueryVariables,
} from 'shared-types/API'
import { lambdaGetAttractionDetailsForSearchAttraction } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient/ApiClient'
import filterCardsBySeasons from './filter-cards-by-seasons'

interface IGetExploreVotingListItem {
  attractionId: string
  destinationDates?: string[] | null
  inMyBucketList: boolean
  swipes?: ExploreVotingListSwipe[]
}

export async function getExploreVotingListItem({
  attractionId,
  destinationDates,
  inMyBucketList,
  swipes,
}: IGetExploreVotingListItem): Promise<ExploreVotingListItem> {
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

  let inSeason = true

  if (destinationDates?.length) {
    const seasons = attraction.seasons?.filter((season): season is AttractionSeason => !!season)

    inSeason = filterCardsBySeasons({
      seasons,
      destinationStartDate: destinationDates[0],
      destinationEndDate: destinationDates[1],
    })
  }

  const exploreVotingListItem: ExploreVotingListItem = {
    __typename: 'ExploreVotingListItem',
    attractionCategories: attraction.attractionCategories,
    attractionCuisine: attraction.attractionCuisine,
    cost: attraction.cost,
    descriptionShort: attraction.descriptionShort,
    id: attraction.id,
    image: attraction.images?.[0],
    inMyBucketList,
    inSeason,
    name: attraction.name,
    rating: attraction.locations?.[0]?.startLoc.googlePlace.data.rating,
    recommendationBadges: attraction.recommendationBadges,
    swipes,
    type: attraction.type,
  }

  return exploreVotingListItem
}
