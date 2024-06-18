import { BusinessStatus, PeriodInput, PlaceDataInput, ReviewInput } from 'shared-types/API'
import { countryToContinentMap } from './country-to-continent-map'
import { getSSMVariable } from './getSSMVariable'
import { Client as GoogleClient } from '@googlemaps/google-maps-services-js'

const google = new GoogleClient({})

interface IGetGooglePlaceDetails {
  placeId: string
  GOOGLE_MAPS_KEY?: string
}

export async function getGooglePlaceDetails({
  placeId,
  GOOGLE_MAPS_KEY,
}: IGetGooglePlaceDetails): Promise<PlaceDataInput> {
  let key = GOOGLE_MAPS_KEY
  if (!key) {
    key = await getSSMVariable('GOOGLE_MAPS_API_KEY')
  }
  const { data } = await google.placeDetails({
    params: {
      place_id: placeId,
      key,
    },
  })

  if (!data?.result?.address_components || !data?.result?.geometry)
    throw new Error(`address components or coordinates not found for googlePlaceId: ${placeId}`)

  function findLongName(type: string) {
    return data.result.address_components?.find((addressField: any) => addressField.types.includes(type))?.long_name
  }

  const locationTypes = [
    'locality',
    'postal_town', // in UK and Sweden, this is the city
    'administrative_area_level_3', // 3rd lvl under country; often the city
    'sublocality', // brooklyn & other parts of NYC do not include city
    'neighborhood', // e.g., La Jolla
    'natural_feature', // e.g., cape cod
    'administrative_area_level_2', // e.g., San Diego County
  ]

  const city = locationTypes.map(findLongName).find((name) => name) || ''
  const state =
    data.result.address_components.find((addressField: any) =>
      addressField.types.includes('administrative_area_level_1'),
    )?.long_name || ''
  const countryData = data.result.address_components.find((addressField: any) => addressField.types.includes('country'))
  const country = countryData?.long_name || ''
  const continent = countryData?.short_name ? countryToContinentMap[countryData?.short_name] || '' : ''

  // following is used to classify type & bestVisited for auto-create-card
  // it exists, but the type hasn't been updated to reflect it
  const serviceKeys = [
    'serves_breakfast',
    'serves_brunch',
    'serves_lunch',
    'serves_dinner',
    'dine_in',
    'takeout',
    'delivery',
    'servesBeer',
    'servesWine',
    'servesVegetarianFood',
  ]

  let hasService = false
  const mealServices: any = {}

  for (const key of serviceKeys) {
    if (data.result[key as keyof typeof data.result]) {
      hasService = true
      // Convert the key to camelCase
      const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      mealServices[camelCaseKey] = data.result[key as keyof typeof data.result]
    }
  }

  const {
    opening_hours,
    rating,
    user_ratings_total,
    photos,
    // @ts-ignore
    reservable,
    price_level,
    reviews,
    editorial_summary,
  } = data.result

  const parsedReviews: ReviewInput[] | undefined = reviews?.map((review) => ({
    authorName: review.author_name,
    authorUrl: review.author_url,
    language: review.language,
    // @ts-ignore
    originalLanguage: review.original_language,
    profilePhotoUrl: review.profile_photo_url,
    rating: review.rating,
    relativeTimeDescription: review.relative_time_description,
    text: review.text,
    time: String(review.time),
    // @ts-ignore
    translated: review.translated,
  }))

  let placeData: PlaceDataInput = {
    name: data.result.name || '',
    coords: {
      lat: data.result.geometry.location.lat,
      long: data.result.geometry.location.lng,
    },
    city,
    state,
    country,
    continent,
    formattedAddress: data.result.formatted_address,
    googlePlacePageLink: data.result.url,
    websiteLink: data.result.website,
    phone: data.result.international_phone_number,
    businessStatus: data.result.business_status as BusinessStatus,
    mealServices: hasService ? mealServices : undefined,
    hours: opening_hours
      ? {
          weekdayText: opening_hours.weekday_text,
          periods: opening_hours.periods as PeriodInput[],
        }
      : undefined,
    rating: rating
      ? {
          score: rating,
          count: user_ratings_total,
        }
      : undefined,
    photos: photos || undefined,
    reservable: reservable || undefined,
    price: price_level || undefined,
    reviews: parsedReviews || undefined,
    editorialSummary: editorial_summary?.overview || undefined,
    types: data.result.types,
  }

  // filter out undefined values from root level
  placeData = Object.fromEntries(
    Object.entries(placeData).filter(([_, v]) => v != null && v !== undefined),
  ) as PlaceDataInput

  return placeData
}
