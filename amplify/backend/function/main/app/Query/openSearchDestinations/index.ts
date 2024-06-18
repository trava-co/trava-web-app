import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CoordsInput,
  OpenSearchDestinationsQueryVariables,
  OpenSearchDestinationsResponse,
  SearchDestinationItem,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { CUSTOM_NOT_AUTHORIZED_SEARCH_DESTINATION_MESSAGE } from 'shared-types/lambdaErrors'
import { OTHER_DESTINATION_ID } from '../../utils/constants'

const createQueryObjects = (query: any) => {
  if (!query) {
    return ''
  }
  const header = JSON.stringify({})
  const body = JSON.stringify(query)
  return header + '\n' + body + '\n'
}

const createOpenSearchQuery = ({
  searchString,
  centerCoords,
  featured,
  authorId,
}: {
  searchString: string | null | undefined
  centerCoords?: CoordsInput | null
  featured: boolean
  authorId?: string | null
}) => {
  const matchConditions: any[] = []

  const mustNotConditions: any[] = [
    {
      exists: {
        field: 'deletedAt',
      },
    },
    {
      term: { id: OTHER_DESTINATION_ID },
    },
  ]

  const filterConditions: any[] = []

  if (featured) {
    filterConditions.push({
      term: {
        featured: true,
      },
    })
  } else {
    filterConditions.push({
      term: {
        featured: false,
      },
    })
  }

  // Require either isTravaCreated or authorId to match
  filterConditions.push({
    bool: {
      should: [{ term: { isTravaCreated: true } }, { term: { authorId: authorId } }],
      minimum_should_match: 1,
    },
  })

  // If there is a search string, use a multi_match query. Else, only return destinations with at least 10 nearby experiences
  if (searchString) {
    matchConditions.push({
      multi_match: {
        query: searchString,
        fields: ['name', 'altName', 'state', 'country', 'continent'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    })
  } else {
    filterConditions.push({
      range: {
        nearbyExperiencesCount: {
          gte: 10,
        },
      },
    })
  }

  const query = searchString
    ? {
        bool: {
          must: matchConditions,
          filter: filterConditions,
          must_not: mustNotConditions,
        },
      }
    : {
        bool: {
          filter: filterConditions,
          must_not: mustNotConditions,
        },
      }

  // if there's a search string, sort by relevance.
  // if no search string: if location provided, sort by distance to location. Else, sort by nearby experiences count.
  const sort = searchString
    ? {}
    : centerCoords
    ? [
        {
          _geo_distance: {
            coords: {
              lat: centerCoords.lat,
              lon: centerCoords.long,
            },
            order: 'asc',
            unit: 'mi',
            distance_type: 'arc',
            mode: 'min',
          },
        },
      ]
    : [
        {
          nearbyExperiencesCount: {
            order: 'desc',
          },
        },
      ]

  return {
    _source: {
      excludes: [
        'embedding',
        'coverImage',
        'nearbyThingsToDoCount',
        'nearbyPlacesToEatCount',
        'googlePlaceId',
        'label',
        'continent',
        'createdAt',
        'updatedAt',
      ],
    },
    size: 50,
    query,
    sort,
  }
}

const openSearchDestinations: AppSyncResolverHandler<
  OpenSearchDestinationsQueryVariables,
  OpenSearchDestinationsResponse
> = async (event) => {
  console.log('openSearchDestinations')

  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_SEARCH_DESTINATION_MESSAGE)
  }

  const { searchString, centerCoords } = event.arguments.input

  const featuredDestinationsQuery = createOpenSearchQuery({
    searchString,
    centerCoords,
    featured: true,
    authorId: event.identity.sub,
  })

  const otherDestinationsQuery = createOpenSearchQuery({
    searchString,
    centerCoords,
    featured: false,
    authorId: event.identity.sub,
  })

  const msearchQueryParts = [createQueryObjects(featuredDestinationsQuery), createQueryObjects(otherDestinationsQuery)]

  const msearchQuery = msearchQueryParts.join('')

  // @ts-ignore
  const msearchResponse = await ApiClient.get().openSearchMSearch('destination', msearchQuery)
  // @ts-ignore
  const [featuredDestinationsResponse, otherDestinationsResponse] = msearchResponse.responses || []

  const getSearchDestinationItem = (hit: any): SearchDestinationItem => {
    const { _source } = hit
    return {
      __typename: 'SearchDestinationItem',
      id: _source.id,
      name: _source.name,
      icon: _source.icon,
      coords: { long: _source.coords[0], lat: _source.coords[1], __typename: 'Coords' },
      state: _source.state,
      country: _source.country,
      numberOfExperiences: _source.nearbyExperiencesCount,
    }
  }

  const featured = featuredDestinationsResponse.hits.hits.map(getSearchDestinationItem)
  const other = otherDestinationsResponse.hits.hits.map(getSearchDestinationItem)

  return {
    __typename: 'OpenSearchDestinationsResponse',
    featured, // populated with destinations with >= 10 nearby experiences
    other, // populated with destinations with < 10 nearby experiences
  }
}

export default openSearchDestinations
