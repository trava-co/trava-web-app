import {
  CreateDestinationMutationVariables,
  PrivateCreateDestinationMutation,
  PrivateCreateDestinationMutationVariables,
  CoordsInput,
} from 'shared-types/API'
import ApiClient from './ApiClient'
import { privateCreateDestination } from 'shared-types/graphql/mutations'
import { Client as GoogleClient, PlaceInputType } from '@googlemaps/google-maps-services-js'
import { OTHER_DESTINATION_ID } from './constants'
import { getSSMVariable } from './getSSMVariable'

const google = new GoogleClient({})

const locationRestrictionInMeters = 50 * 1609.34 // 50 miles

const removeSpecialCharacters = (str: string) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ')

async function _privateCreateDestination(createDestinationMutationVariables: CreateDestinationMutationVariables) {
  const input = { ...createDestinationMutationVariables.input, label: 'Destination' }
  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateDestinationMutationVariables, PrivateCreateDestinationMutation>({
      query: privateCreateDestination,
      variables: { input },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateDestination
}

interface ICreateDestinationFromAttraction {
  city?: string
  state?: string
  country?: string
  continent?: string
  attractionCoords: CoordsInput
}

export const getDestinationNearbyAttraction = async ({
  city,
  state,
  country,
  continent,
  attractionCoords,
}: ICreateDestinationFromAttraction): Promise<string> => {
  // 1. Query opensearch index for destinations within 50 miles of attraction coords
  console.log("first, let's try to find an existing destination within 50 miles of the attraction coords")
  const travaDestinationNearestAttractionQuery = createOpenSearchQuery({ coords: attractionCoords })

  const travaDestinationNearestAttractionResponse = await ApiClient.get().openSearchFetch(
    'destination',
    travaDestinationNearestAttractionQuery,
  )

  // @ts-ignore
  if (travaDestinationNearestAttractionResponse.hits.hits.length) {
    // @ts-ignore
    console.log(`destination found: ${travaDestinationNearestAttractionResponse.hits.hits[0]._source.id}`)
    // @ts-ignore
    return travaDestinationNearestAttractionResponse.hits.hits[0]._source.id
  }

  console.log(`no destination found within 50 miles of attraction coords, so let's create one`)

  // 2. If no results, query google for the destination and create it
  const searchName = `${city}, ${state}, ${country}`

  // get google maps key from ssm
  const googleMapsKey = await getSSMVariable('GOOGLE_MAPS_API_KEY')

  // get google place info
  const googleResponse = await google.findPlaceFromText({
    params: {
      input: removeSpecialCharacters(searchName),
      fields: ['place_id', 'name', 'geometry'],
      key: googleMapsKey,
      inputtype: PlaceInputType.textQuery,
      ...(attractionCoords && {
        locationbias: `circle:${locationRestrictionInMeters}@${attractionCoords.lat},${attractionCoords.long}`,
      }),
    },
  })

  const googleResponseData = googleResponse.data
  const firstCandidate = googleResponseData?.candidates?.[0]

  console.log(`firstCandidate: ${JSON.stringify(firstCandidate, null, 2)}`)

  if (!firstCandidate || !firstCandidate.place_id || !firstCandidate.geometry?.location) {
    return OTHER_DESTINATION_ID
  }

  // create new destination
  const newDestination = await _privateCreateDestination({
    input: {
      name: firstCandidate.name,
      coords: {
        long: firstCandidate.geometry.location.lng,
        lat: firstCandidate.geometry.location.lat,
      },
      isTravaCreated: 1,
      googlePlaceId: firstCandidate.place_id,
      state,
      country,
      continent,
      featured: false, // featured destination is set by computeNearbyAttractionsForDestinations script
    },
  })

  if (!newDestination) {
    console.error('Error creating destination')
    return OTHER_DESTINATION_ID
  }

  return newDestination.id
}

const createOpenSearchQuery = ({ coords }: { coords: CoordsInput }) => {
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

  const filterConditions: any[] = [
    {
      term: {
        isTravaCreated: true,
      },
    },
    {
      geo_distance: {
        distance: '50mi',
        coords: {
          lat: coords.lat,
          lon: coords.long,
        },
      },
    },
  ]

  const query = {
    bool: {
      filter: filterConditions,
      must_not: mustNotConditions,
    },
  }

  // sort by distance to location
  const sort = [
    {
      _geo_distance: {
        coords: {
          lat: coords.lat,
          lon: coords.long,
        },
        order: 'asc',
        unit: 'mi',
        distance_type: 'arc',
        mode: 'min',
      },
    },
  ]

  return {
    _source: {
      includes: ['id', 'name'],
    },
    size: 1,
    query,
    sort,
  }
}
