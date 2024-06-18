import { LatLngLiteral } from '@googlemaps/google-maps-services-js'
import { InfoItemInput, ReviewInput } from 'shared-types/API'
// @ts-ignore
import yelp from 'yelp-fusion'
import { YelpBusinessNotFoundError } from './YelpError'
// @ts-ignore
import haversine from 'haversine'
import { Browser, Page } from 'puppeteer-core'
import { withExponentialBackoff } from '../withExponentialBackoff'
import { sleepRandom } from '../sleep'
import { AskOpenAIChatInput, askOpenAIChat } from '../openai/askOpenAIChat'
import { CHAT_MODELS } from '../constants'
import { findMatchingYelpBusiness, getMatchingYelpBusinessIdFunctions } from '../prompts/findMatchingYelpBusiness'
import { getSSMVariable } from '../getSSMVariable'

export interface YelpData {
  api: YelpApiData
  web: YelpWebData
}

interface YelpWebData {
  reviews?: ReviewInput[]
  amenities?: InfoItemInput[]
}

export interface YelpApiData {
  id: string
  alias: string
  name: string
  image_url?: string
  is_closed?: boolean
  url?: string
  review_count?: number
  categories?: { title: string }[]
  rating?: number
  price?: string
  coordinates: { latitude: number; longitude: number }
  location: {
    address1?: string
    address2?: string
    address3?: string
    city?: string
    state?: string
    zip_code?: string
    country?: string
    display_address: string[]
  }
  phone: string
  display_phone: string
}

export interface FindYelpBusinessesByPhoneNumberInput {
  phone: string
  location: LatLngLiteral
}

export async function findYelpBusinessesByPhoneNumber({
  phone,
  location,
}: FindYelpBusinessesByPhoneNumberInput): Promise<YelpApiData[]> {
  const yelpApiKeysString = await getSSMVariable('YELP_API_KEY')

  // console.log(`yelpApiKeysString: ${yelpApiKeysString}`)

  const yelpApiKeys = yelpApiKeysString.split(',')

  // console.log(`yelpApiKeys: ${JSON.stringify(yelpApiKeys, null, 2)}`)

  // randomize the order of the keys to lessen the chance of hitting a rate limit
  yelpApiKeys.sort(() => Math.random() - 0.5)

  let data
  // console.log(`Searching for yelpBusinesses with phone: ${phone}`)
  for (const yelpApiKey of yelpApiKeys) {
    try {
      console.log(`Trying key ${yelpApiKey}`)
      const yelpClient = yelp.client(yelpApiKey)
      data = await yelpClient.phoneSearch({ phone })
      break // If successful, break the loop
    } catch (error: any) {
      console.log(`error: ${JSON.stringify(error, null, 2)}`)
      console.log(`key used: ${yelpApiKey}`)
      const errorCode = error?.error?.code
      if (errorCode === 'TOO_MANY_REQUESTS_PER_SECOND' || errorCode === 'ACCESS_LIMIT_REACHED') {
        console.error(`Failed with key ${yelpApiKey}: ${error}`)
        // If it fails with one of these errors, it will continue with the next key
      } else {
        // If the error is something else, throw it
        throw error
      }
    }
  }

  if (!data) {
    throw new Error('All API keys failed')
  }

  const parsedData = JSON.parse(data.body)

  console.log(`parsedData: ${JSON.stringify(parsedData, null, 2)}`)

  const businessesFound = parsedData.businesses as YelpApiData[]

  const numberOfBusinessesFound = businessesFound?.length

  if (numberOfBusinessesFound === 0) {
    throw new YelpBusinessNotFoundError(`${phone}`)
  }
  // Create an array to store all the Yelp businesses
  const yelpBusinesses: YelpApiData[] = []

  // Iterate over each business
  for (const matchedBusiness of businessesFound) {
    const yelpBusinessCoordinates = {
      latitude: matchedBusiness.coordinates.latitude,
      longitude: matchedBusiness.coordinates.longitude,
    }

    const googlePlaceCoordinates = {
      latitude: location.lat,
      longitude: location.lng,
    }

    const distance = haversine(yelpBusinessCoordinates, googlePlaceCoordinates, { unit: 'meter' })

    if (distance > 1600) {
      // console.log(`Skipping yelp business ${matchedBusiness.name} because it is too far away.`)
      continue
    }

    const yelpBusiness: YelpApiData = {
      id: matchedBusiness.id,
      alias: matchedBusiness.alias,
      name: matchedBusiness.name,
      image_url: matchedBusiness.image_url,
      is_closed: matchedBusiness.is_closed,
      url: matchedBusiness.url,
      review_count: matchedBusiness.review_count,
      categories: matchedBusiness.categories,
      rating: matchedBusiness.rating,
      price: matchedBusiness.price,
      coordinates: matchedBusiness.coordinates,
      location: matchedBusiness.location,
      phone: matchedBusiness.phone,
      display_phone: matchedBusiness.display_phone,
    }

    // Add the Yelp business to the array
    yelpBusinesses.push(yelpBusiness)
  }

  return yelpBusinesses
}

export async function scrapeAmenitiesAndMoreSection(page: Page): Promise<InfoItemInput[]> {
  // look for the first section with aria-label="Amenities and More"
  const amenitiesAndMoreSection = await page.$('section[aria-label="Amenities and More"]')

  if (!amenitiesAndMoreSection) {
    throw new Error(`No amenities and more section found.`)
  }

  try {
    // within this section, look for a button with aria-expanded="false", and click it
    const showMoreButton = await amenitiesAndMoreSection.$('button[aria-expanded="false"]')

    if (!showMoreButton) {
      throw new Error(`No button with aria-expanded="false" found.`)
    }

    await showMoreButton.click()
  } catch (error) {
    // if there is no button with aria-expanded="false", then the amenities are already expanded
    console.warn(`No button with aria-expanded="false" found. Assuming amenities are already expanded.`)
  }

  // within amenitiesAndMoreSection,look for a div with id starting with the substring "expander-link-content"
  const expanderLinkContentDiv = await amenitiesAndMoreSection.$('div[id^="expander-link-content"]')

  if (!expanderLinkContentDiv) {
    throw new Error(`expanderLinkContentDiv not found. No div with id starting with "expander-link-content" found.`)
  }

  // get the grandchild of this div, which will be the container of the amenities divs. It will have a class beginning with "arrange_"
  const amenitiesContainer = await expanderLinkContentDiv.$('div[class*="arrange_"]')

  if (!amenitiesContainer) {
    throw new Error(`amenitiesContainer not found. No div with class starting with "arrange_" found.`)
  }

  // get references to each direct child div within amenitiesContainer with class starting with " arrange-unit_"
  const amenitiesDivs = await amenitiesContainer.$$('xpath/' + './*[starts-with(@class, "arrange-unit_")]')

  // for each div...
  const amenities: InfoItemInput[] = []
  for (const div of amenitiesDivs) {
    // get the text content inside
    const textContent = await div.evaluate((node: Element) => node.textContent)

    // now, look for a span with class starting with "icon--24-close-v2". If it exists, then this is a negative amenity
    const negativeAmenity = await div.$('span[class^="icon--24-close-v2"]')

    // now, look for a span with class starting with "icon--24-checkmark-v2". If it exists, then this is an affirmative amenity
    const affirmativeAmenity = await div.$('span[class^="icon--24-checkmark-v2"]')

    if (textContent) {
      const amenity: InfoItemInput = {
        name: textContent,
        // only add affirmative or negative if it exists
        ...(affirmativeAmenity && { affirmative: true }),
        ...(negativeAmenity && { negative: true }),
      }
      amenities.push(amenity)
    }
  }

  return amenities
}

export async function visitYelpPage(browser: Browser, yelpUrl: string): Promise<Page> {
  const page = await browser.newPage()
  // page.on('console', msg => console.log('Browser Console:', msg.text()));

  await withExponentialBackoff({
    func: async () => {
      await page.goto(yelpUrl)
    },
    maxRetries: 5,
  })

  // sleep for 1-2 seconds to allow page to load
  await sleepRandom(1, 2)

  return page
}

export interface IGetYelpAPIInput {
  phone?: string | null
  location: LatLngLiteral
  name?: string | null
  address?: string | null
  summary?: string | null
}

interface IPlaceValidationInfo {
  name: string
  address: string
  description?: string[]
}

export function getYelpAPIInput({ phone, location, name, address, summary }: IGetYelpAPIInput) {
  if (!phone || !name || !address) {
    throw new Error(
      `getYelpAPIInput: missing required input: ${JSON.stringify(
        `phone: ${phone}, name: ${name}, address: ${address}, summary: ${summary}`,
      )}`,
    )
  }

  const parsedPhone = (phone[0] === '+' ? '+' : '') + phone.slice(1).replace(/[^0-9]/g, '')

  console.log(`querying yelp api with phone: ${parsedPhone}`)

  const description = summary ? [summary] : []

  const yelpAPIInput: IGetYelpAPIData = {
    phone: parsedPhone,
    location,
    placeValidationInfo: {
      name,
      address,
      ...(description.length > 0 && { description }),
    },
  }

  return yelpAPIInput
}

interface IGetYelpAPIData {
  phone: string
  location: LatLngLiteral
  placeValidationInfo: IPlaceValidationInfo
}

export async function getYelpAPIData({ phone, location, placeValidationInfo }: IGetYelpAPIData): Promise<YelpApiData> {
  const yelpBusinesses = (await findYelpBusinessesByPhoneNumber({
    phone,
    location,
  })) as YelpApiData[]

  const numberOfBusinessesFound = yelpBusinesses.length

  if (numberOfBusinessesFound === 0) {
    throw new Error(`No yelp businesses found for phone: ${phone}.`)
  }
  if (numberOfBusinessesFound === 1) {
    return yelpBusinesses[0]
  } else {
    const selectableYelpBusinesses = yelpBusinesses.map((business) => ({
      id: business.id,
      name: business.name,
      alias: business.alias,
      categories: business.categories,
      review_count: business.review_count,
      ...(business.location.display_address && {
        address: business.location.display_address.join(',') ?? business.location.address1,
      }),
    }))

    const selectableYelpBusinessIds = selectableYelpBusinesses.map((business) => business.id)

    const enumValuesForArgument = ['NONE', ...selectableYelpBusinessIds]

    // construct a formatted string consisting of name, address, and description
    const googlePlaceInfo = `name: ${placeValidationInfo.name}, address: ${placeValidationInfo.address}${
      placeValidationInfo.description ? `, description: ${placeValidationInfo.description}` : ''
    }`

    const yelpBusinessesInfo = selectableYelpBusinesses.map(
      (business, businessIndex) =>
        `Candidate ${businessIndex + 1}: Yelp business id: ${business.id}, name: ${business.name}${
          business.address ? `, address: ${business.address}` : ''
        }${
          business.categories?.length ? `, categories: ${business.categories.map((category) => category.title)}` : ''
        }${business.alias ? `, alias: ${business.alias}` : ''}${
          business.review_count ? `, review count: ${business.review_count}` : ''
        }.`,
    )

    const messages = findMatchingYelpBusiness(googlePlaceInfo, yelpBusinessesInfo.join('\n'))

    console.log(`find matching yelp business messages: ${JSON.stringify(messages, null, 2)}`)

    const functions = getMatchingYelpBusinessIdFunctions(enumValuesForArgument)

    const openAIChatInput: AskOpenAIChatInput = {
      messages,
      functions,
      temperature: 0,
      model: CHAT_MODELS.NEW_GPT_4,
      callFunction: {
        // force openai to call the function
        type: 'function',
        function: {
          name: 'log_matching_yelp_business_id',
        },
      },
      maxTokensForAnswer: 100,
      context: `Get the yelp business id for the following business. \n\n`,
      logging: false, // turn off token tracker
    }

    const selectableYelpBusinessNames = selectableYelpBusinesses.map(
      (business) => `${business.name}, ${business.address}`,
    )

    console.log(`\nQuerying openAI with these possible values to choose from: ${selectableYelpBusinessNames}\n`)

    const response = await askOpenAIChat(openAIChatInput)

    const { businessMatch } = response

    console.log(`openai responds with selected business: ${businessMatch}`)

    // check if the businessMatch is within enumValuesForArgument
    if (enumValuesForArgument.includes(businessMatch)) {
      // check if the businessMatch is NONE
      if (businessMatch !== 'NONE') {
        // if not NONE, then we have a match
        const matchingYelpBusiness = yelpBusinesses.find((business) => business.id === businessMatch)

        if (!matchingYelpBusiness) {
          throw new Error(`No matching yelp business found for businessMatch: ${businessMatch}`)
        }

        return matchingYelpBusiness
      }
    } else {
      throw new Error(`openAI response is not a valid businessMatch: ${businessMatch}`)
    }

    throw new Error(`No matching yelp business found for phone: ${phone}.`)
  }
}
