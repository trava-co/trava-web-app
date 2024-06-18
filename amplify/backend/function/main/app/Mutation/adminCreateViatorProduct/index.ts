import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'
import {
  CreateViatorProductInput,
  AdminCreateViatorProductMutationVariables,
  PrivateCreateViatorProductMutationVariables,
  PrivateCreateViatorProductMutation,
  RatingInput,
} from 'shared-types/API'
import { CREATE_VIATOR_PRODUCT_NOT_AUTHORIZED } from 'shared-types/lambdaErrors'
import { privateCreateViatorProduct } from 'shared-types/graphql/mutations'
import ApiClient from '../../utils/ApiClient/ApiClient'

const VIATOR_API_KEY = '9bc9975d-577a-4016-84e2-e5d7055ed6fd'

const adminCreateViatorProduct: AppSyncResolverHandler<AdminCreateViatorProductMutationVariables, any> = async (
  event,
) => {
  console.log(`starting adminCreateViatorProduct:`)

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CREATE_VIATOR_PRODUCT_NOT_AUTHORIZED)
  }

  if (
    !(
      'claims' in event.identity &&
      'cognito:groups' in event.identity.claims &&
      event.identity.claims['cognito:groups'].includes('admin')
    )
  ) {
    throw new Error(CREATE_VIATOR_PRODUCT_NOT_AUTHORIZED)
  }

  const { id, url, attractionId, displayOrder } = event.arguments.input

  // shouldn't happen but just in case
  if (!id || !url || !attractionId || !displayOrder) {
    throw new Error('Invalid input')
  }

  try {
    // 1. Parse the productCode from the slug
    const productCodeMatch = url.match(/tours\/[^/]+\/[^/]+\/d\d+-([^/?]+)/)
    if (!productCodeMatch) {
      throw new Error('Invalid Viator link format')
    }
    const productCode = productCodeMatch[1]
    console.log(`productCode: ${productCode}`)

    const headers = {
      'exp-api-key': VIATOR_API_KEY,
      'Accept-Language': 'en-US',
      Accept: 'application/json;version=2.0',
      'Content-Type': 'application/json;version=2.0',
    }

    // 2. Query the products endpoint with the productCode
    const productResponsePromise = axios.get(`https://api.viator.com/partner/products/${productCode}`, {
      headers,
    })

    // Query the pricing endpoint with the productCode
    const pricingResponsePromise = axios.get(`https://api.viator.com/partner/availability/schedules/${productCode}`, {
      headers,
    })

    const [productResponse, pricingResponse] = await Promise.all([productResponsePromise, pricingResponsePromise])

    console.log(`productResponse exists: ${!!productResponse}`)
    console.log(`pricingResponse exists: ${!!pricingResponse}`)

    const { data: productData } = productResponse
    const { data: pricingData } = pricingResponse

    // 3. Begin constructing the input for the createViatorProduct mutation
    // 3a. Price Details
    const fromPrice = pricingData.summary?.fromPrice
    const currency = pricingData.currency

    // if either are null, throw error
    if (!fromPrice || !currency) {
      throw new Error('No pricing data found')
    }

    // pricing looks like this: 150.00, currency looks like this: USD
    // use currencyDictionary to display the currency symbol and format the price. if not found, just display the currency and price
    const priceText = currencyDictionary[currency]
      ? `${currencyDictionary[currency]}${fromPrice}`
      : `${fromPrice} ${currency}`

    // 3b. Rating Details
    const rating: RatingInput = {
      score: parseFloat(productData.reviews.combinedAverageRating.toFixed(1)),
      count: productData.reviews.totalReviews,
    }

    if (!rating.score || !rating.count) {
      throw new Error('No rating data found')
    }

    // 3c. Image Details
    // get the first image with height over 200 and width over 300. If none, cut in half and try again
    // if still none, get the first image
    const findVariantWithAspectRatio = (minHeight: number, minWidth: number) => {
      const targetRatio = 2 / 3
      const tolerance = 0.01 // Adjust tolerance as needed

      for (const image of productData.images) {
        const variant = image.variants.find((v: any) => {
          const aspectRatio = v.height / v.width
          const ratioDifference = Math.abs(aspectRatio - targetRatio)

          return ratioDifference <= tolerance && v.height > minHeight && v.width > minWidth
        })

        if (variant) {
          return variant
        }
      }

      return null
    }

    const variant =
      findVariantWithAspectRatio(200, 300) ||
      findVariantWithAspectRatio(100, 150) ||
      (productData.images[0].variants ? productData.images[0].variants[0] : null)

    console.log(`variant: ${JSON.stringify(variant, null, 2)}`)

    if (!variant?.url) {
      throw new Error('No image found')
    }

    // 3d. Duration Details
    const fixedDuration = productData.itinerary.duration?.fixedDurationInMinutes
    const variableDurationFrom = productData.itinerary.duration?.variableDurationFromMinutes
    const variableDurationTo = productData.itinerary.duration?.variableDurationToMinutes

    const duration = fixedDuration
      ? `${fixedDuration} minutes`
      : `${variableDurationFrom}-${variableDurationTo} minutes`

    // Extract the required fields from the matchingProduct
    const input: CreateViatorProductInput = {
      id,
      attractionId,
      viatorLink: url,
      displayOrder,
      name: productData.title,
      priceText,
      rating,
      coverImageUrl: variant.url,
      duration,
      pricing: fromPrice,
      currency,
    }

    console.log(`input: ${JSON.stringify(input, null, 2)}`)

    // 4. Call the createViatorProduct mutation
    const result = await ApiClient.get().apiFetch<
      PrivateCreateViatorProductMutationVariables,
      PrivateCreateViatorProductMutation
    >({
      query: privateCreateViatorProduct,
      variables: {
        input,
      },
    })

    console.log(`result: ${JSON.stringify(result, null, 2)}`)
    return result.data?.privateCreateViatorProduct
  } catch (error) {
    console.error(error)
    throw new Error('Failed to get Viator product details')
  }
}

const currencyDictionary: Record<string, string> = {
  AUD: 'A$', // Australian Dollar
  BRL: 'R$', // Brazilian Real
  CAD: 'CA$', // Canadian Dollar
  CHF: 'CHF', // Swiss Franc
  DKK: 'kr.', // Danish Krone
  EUR: '€', // Euro
  GBP: '£', // British Pound
  HKD: 'HK$', // Hong Kong Dollar
  INR: '₹', // Indian Rupee
  JPY: '¥', // Japanese Yen
  NOK: 'kr', // Norwegian Krone
  NZD: 'NZ$', // New Zealand Dollar
  SEK: 'kr', // Swedish Krona
  SGD: 'S$', // Singapore Dollar
  TWD: 'NT$', // Taiwan Dollar
  USD: '$', // US Dollar
  ZAR: 'R', // South African Rand
}

export default adminCreateViatorProduct
