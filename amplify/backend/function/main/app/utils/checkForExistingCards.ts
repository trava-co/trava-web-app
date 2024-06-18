import { ATTRACTION_PRIVACY, AttractionExistsItem, GooglePlace } from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import dbClient from './dbClient'
import getTableName from './getTableName'

interface ICheckForExistingCards {
  googlePlaceId: string
  userId: string
  destinationDates?: Array<string | null>
}

/**
 * Retrieves existing attractions matching the provided googlePlaceId
 */
export const checkForExistingCards = async ({
  googlePlaceId,
  userId,
  destinationDates,
}: ICheckForExistingCards): Promise<{
  existingGooglePlace: GooglePlace | null
  existingAttractions: AttractionExistsItem[] | null
}> => {
  const googlePlaceTableName = getTableName(process.env.API_TRAVA_GOOGLEPLACETABLE_NAME)
  // First, validate that the Google Place ID exists in the Google Places table
  const { Item: googlePlace } = await dbClient
    .get({
      TableName: googlePlaceTableName,
      Key: {
        id: googlePlaceId,
      },
    })
    .promise()

  if (!googlePlace) {
    console.log('checkForExistingCards: googlePlace does not exist in DB')
    return {
      existingGooglePlace: null,
      existingAttractions: null,
    }
  }

  console.log('checkForExistingCards: googlePlace exists in DB')

  const filteredDestinationDates = destinationDates?.filter(Boolean) as string[] | undefined
  const validatedDestinationDates = filteredDestinationDates?.length === 2 ? filteredDestinationDates : undefined

  // Then, query the OpenSearch index with the Google Place ID to get the attraction
  const openSearchQuery = createOpenSearchQuery(googlePlaceId, userId, validatedDestinationDates)

  const openSearchResponse = await ApiClient.get().useIamAuth().openSearchFetch('attraction', openSearchQuery)

  // @ts-ignore
  const matchedAttractions: any[] = openSearchResponse.hits.hits

  const existingAttractions: AttractionExistsItem[] =
    // @ts-ignore
    matchedAttractions.map((hit) => {
      const { _source, sort } = hit

      return {
        __typename: 'AttractionExistsItem',
        id: _source.id,
        name: _source.name,
        locations: _source.locations,
        duration: _source.duration,
        destinationName: _source.destination.name,
        attractionCategories: _source.attractionCategories,
        attractionCuisine: _source.attractionCuisine,
        bucketListCount: _source.bucketListCount,
        isTravaCreated: _source.isTravaCreated,
        images: _source.images,
        author: _source.author,
        type: _source.type,
        deletedAt: _source.deletedAt,
        outOfSeason: sort?.[0] === 0, // if destinationDates don't exist, sort is undefined, so this would be false, which is what we want (can't technically be out of season if there are no dates)
        recommendationBadges: _source.recommendationBadges,
      }
    })

  return {
    existingGooglePlace: googlePlace as GooglePlace,
    existingAttractions,
  }
}

const createOpenSearchQuery = (googlePlaceId: string, userId: string, destinationDates?: string[]) => {
  const mustNotConditions = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
  ]

  const filterConditions = [
    {
      // either should be public or should be created by me
      bool: {
        should: [
          {
            term: {
              privacy: ATTRACTION_PRIVACY.PUBLIC,
            },
          },
          {
            term: {
              'author.id': userId,
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
    {
      term: {
        googlePlaceIds: googlePlaceId,
      },
    },
  ]

  const sort = destinationDates
    ? [
        {
          // inSeason
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              source:
                "double result = 0.0; boolean inSeason = false; String destinationStartDate = params.destination_start_date; String destinationEndDate = params.destination_end_date; if (doc['seasons'].length == 0) { inSeason = true; } else { int destinationStartYear = Integer.parseInt(destinationStartDate.substring(0, 4)); int destinationEndYear = Integer.parseInt(destinationEndDate.substring(0, 4)); String destinationStartDateMMDD = destinationStartDate.substring(5, 10); String destinationEndDateMMDD = destinationEndDate.substring(5, 10); String[][] destinationDates; if (destinationStartYear == destinationEndYear) { destinationDates = new String[1][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = destinationEndDateMMDD; } else if (destinationEndYear - destinationStartYear > 1) { destinationDates = new String[1][2]; destinationDates[0][0] = '01-01'; destinationDates[0][1] = '12-31'; } else { destinationDates = new String[2][2]; destinationDates[0][0] = destinationStartDateMMDD; destinationDates[0][1] = '12-31'; destinationDates[1][0] = '01-01'; destinationDates[1][1] = destinationEndDateMMDD; } for (int i = 0; i < doc['seasons'].length; ++i) { String season = doc['seasons'][i]; String startDateSeason = season.substring(0, 5); String endDateSeason = season.substring(6); for (int j = 0; j < destinationDates.length; ++j) { String startDateDestination = destinationDates[j][0]; String endDateDestination = destinationDates[j][1]; if (startDateSeason.compareTo(endDateDestination) <= 0 && endDateSeason.compareTo(startDateDestination) >= 0) { inSeason = true; break; } } } } result = inSeason ? 1.0 : 0.0; return result;",
              params: {
                destination_start_date: destinationDates[0],
                destination_end_date: destinationDates[1],
              },
            },
            order: 'desc',
          },
        },
      ]
    : {}

  const query = {
    bool: {
      filter: filterConditions,
      must_not: mustNotConditions,
    },
  }

  return {
    _source: {
      includes: [
        'id',
        'name',
        'locations',
        'duration',
        'destination',
        'seasons',
        'attractionCategories',
        'attractionCuisine',
        'bucketListCount',
        'isTravaCreated',
        'images',
        'author',
        'type',
        'recommendationBadges',
        'deletedAt',
      ],
    },
    size: 500,
    query,
    sort,
  }
}
