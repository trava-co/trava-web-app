import puppeteer, { Browser, Page } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import {
  visitPlacePage,
  scrapePlaceName,
  visitAboutTab,
  InfoEnum,
  scrapeAboutInfoItems,
  scrapePopularTimes,
  scrapeGoogleReviews,
  getPopularBestVisited,
  scrapeMenuUrl,
} from './google'
import { toCamelCase } from './toCamelCase'
import { ATTRACTION_TYPE, InfoItemInput, PlaceWebDataInput, ReviewInput, YelpDataInput } from 'shared-types/API'
import { AboutBusinessInputKeys } from './constants'
import { IGetYelpAPIInput, getYelpAPIData, getYelpAPIInput, scrapeAmenitiesAndMoreSection, visitYelpPage } from './yelp'

export interface IScrapeGoogleAdditionalInfo {
  attractionId: string
  googlePlaceId: string
  browser: Browser
  attractionType: ATTRACTION_TYPE
}

export type ScrapeGoogleWebDataResult = {
  placeWebData: PlaceWebDataInput
  scrapedReviews: ReviewInput[]
}

export async function scrapeGoogleWebData({
  attractionId,
  googlePlaceId,
  browser,
  attractionType,
}: IScrapeGoogleAdditionalInfo): Promise<ScrapeGoogleWebDataResult> {
  let page: Page | null = null
  let placeWebData: PlaceWebDataInput = {}
  let scrapedReviews: ReviewInput[] = []
  try {
    console.log(
      `scraping google additional info for place id: ${googlePlaceId}, website: https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`,
    )

    page = await visitPlacePage(browser, googlePlaceId)
    console.log('visited place page')

    if (!page) {
      throw new Error('page is null')
    }

    // OVERVIEW TAB
    console.log('scraping overview tab')
    const placeName = await scrapePlaceName(page, attractionId, 'some destination name')
    console.log(`place name: ${placeName}`)

    try {
      const result = await scrapePopularTimes(page, placeName)
      if (result?.dayData) {
        placeWebData.popularTimes = result.dayData
      }
      // console.log(`scrapePopularTimes result: ${JSON.stringify(result)}`)

      if (result?.popularTimes) {
        const bestVisitedByPopularTimes = getPopularBestVisited(result.popularTimes, attractionType)
        if (bestVisitedByPopularTimes) {
          placeWebData.bestVisitedByPopularTimes = bestVisitedByPopularTimes
        }
        console.log('past getPopularBestVisited')
      }
    } catch (error) {
      console.error(error)
    }

    const menuLink = await scrapeMenuUrl(page, attractionType, attractionId, 'some destination name').catch((error) =>
      console.error(error),
    )

    if (menuLink) {
      placeWebData.menuLink = menuLink
    }

    console.log('past scrapeMenuUrl')

    // ABOUT TAB
    // Click the about tab to get more data about Amenities and Crowd, if they exist
    try {
      console.log('scraping about tab')
      await visitAboutTab(page, placeName)
      console.log('visited about tab')

      const infoPromises = Object.values(InfoEnum).map(async (infoType) => {
        let infoItems = await scrapeAboutInfoItems(page as Page, placeName, infoType)
        if (infoItems?.length > 0) {
          return { [toCamelCase(infoType)]: infoItems }
        } else {
          return null
        }
      })
      console.log('past infoPromises')

      // filter out null values before Object.assign
      const infoObjects = (await Promise.all(infoPromises)).filter(Boolean)

      // filter out keys that are not in AboutBusinessInputKeys
      const filteredInfoObjects = infoObjects.map((infoObject) => {
        // Assert that infoObject is not null
        const nonNullInfoObject = infoObject as { [x: string]: InfoItemInput[] }

        return Object.keys(nonNullInfoObject)
          .filter((key) => Object.values(AboutBusinessInputKeys).includes(key as AboutBusinessInputKeys))
          .reduce((obj, key) => {
            obj[key as AboutBusinessInputKeys] = nonNullInfoObject[key]
            return obj
          }, {} as Record<AboutBusinessInputKeys, InfoItemInput[]>)
      })

      const allInfo = Object.assign({}, ...filteredInfoObjects) as Record<
        AboutBusinessInputKeys, // one of the keys in AdditionalInfo
        InfoItemInput[]
      >

      console.log('past allInfo')

      if (allInfo) {
        placeWebData.aboutBusiness = allInfo
      }
    } catch (error) {
      console.error(error)
    }

    // REVIEWS TAB
    console.log('scraping reviews tab')
    const googleReviews = await scrapeGoogleReviews(page, placeName, 3, attractionId, 'some destination name')
    if (googleReviews?.length > 0) {
      scrapedReviews = googleReviews
    }

    // log the number of reviews scraped
    console.log(`scraped ${scrapedReviews.length} google reviews`)
  } catch (error) {
    console.error(error)
  } finally {
    // close the page
    if (page) {
      try {
        await page.close()
      } catch {
        console.error('error closing page')
      }
    }
  }

  return {
    placeWebData,
    scrapedReviews,
  }
}

export async function scrapeYelpData({
  browser,
  placeData,
}: {
  browser: Browser
  placeData: IGetYelpAPIInput
}): Promise<YelpDataInput | null> {
  let yelpPage: Page | null = null
  let yelpWebData: YelpDataInput | null = null

  try {
    console.log('scraping yelp data')
    // get yelp api data so that we can get the yelp url to visit
    const yelpApiInput = getYelpAPIInput(placeData)

    const yelpBusiness = await getYelpAPIData(yelpApiInput)
    console.log('past getYelpAPIData')
    const yelpBusinessUrl = yelpBusiness.url

    yelpWebData = {
      id: yelpBusiness.id,
      url: yelpBusinessUrl,
      price: yelpBusiness.price?.length,
      categories: yelpBusiness.categories?.map((category) => category.title),
    }

    // scrape yelp web data
    // new page for yelp
    if (!yelpBusinessUrl) {
      throw new Error('yelpBusinessUrl is null')
    }
    console.log(`visiting yelp page: ${yelpBusinessUrl}`)
    yelpPage = await visitYelpPage(browser, yelpBusinessUrl)
    console.log('past visitYelpPage')

    if (!yelpPage) {
      throw new Error('page is null')
    }

    console.log('scraping amenities and more section')
    const amenities = await scrapeAmenitiesAndMoreSection(yelpPage)
    console.log('past scrapeAmenitiesAndMoreSection')

    if (amenities?.length > 0) {
      yelpWebData.amenities = amenities
    }
  } catch (error) {
    console.error(error)
  } finally {
    if (yelpPage) {
      try {
        await yelpPage.close()
      } catch {
        console.error('error closing yelp page')
      }
    }
  }

  return yelpWebData
}

export interface IScrapeWebData {
  attractionId: string
  attractionType: ATTRACTION_TYPE
  googlePlaceId: string
  placeData: IGetYelpAPIInput
}

export type ScrapeWebDataResult = {
  googleWebData: ScrapeGoogleWebDataResult | null
  yelpWebData: YelpDataInput | null
}

export async function scrapeWebData({
  attractionId,
  attractionType,
  googlePlaceId,
  placeData,
}: IScrapeWebData): Promise<ScrapeWebDataResult> {
  console.log(`launching puppeteer`)
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
  })

  console.log(`puppeteer launched`)

  let googleWebData: ScrapeGoogleWebDataResult | null = null
  let yelpWebData: YelpDataInput | null = null

  try {
    // 1. scrape google web data
    googleWebData = await scrapeGoogleWebData({
      attractionId,
      googlePlaceId,
      browser,
      attractionType,
    })
    console.log('past scrapeGoogleWebData')
  } catch (error) {
    console.error(error)
  }

  try {
    // 2. scrape yelp web data
    yelpWebData = await scrapeYelpData({
      browser,
      placeData,
    })
    console.log('past scrapeYelpData')
  } catch (error) {
    console.error(error)
  }

  // close the browser
  await browser.close()

  return {
    googleWebData,
    yelpWebData,
  }
}
