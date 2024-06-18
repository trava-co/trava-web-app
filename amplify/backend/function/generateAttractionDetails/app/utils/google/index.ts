import {
  ATTRACTION_BEST_VISIT_TIME,
  ATTRACTION_TYPE,
  DayDataInput,
  HourlyDataInput,
  InfoItemInput,
  ReviewInput,
} from 'shared-types/API'
import { Browser, Page } from 'puppeteer-core'
import { withExponentialBackoff } from '../withExponentialBackoff'
import { sleepRandom } from '../sleep'

export async function visitPlacePage(browser: Browser, placeId: string): Promise<Page> {
  const page = await browser.newPage()
  // page.on('console', msg => console.log('Browser Console:', msg.text()));

  await withExponentialBackoff({
    func: async () => {
      await page.goto(`https://www.google.com/maps/place/?q=place_id:${placeId}`)
    },
    maxRetries: 5,
  })

  // sleep for 1-2 seconds to allow page to load
  await sleepRandom(1, 2)

  return page
}

export async function scrapePlaceName(page: Page, attractionId: string, destinationName: string) {
  try {
    return await withExponentialBackoff({
      func: async () => {
        // scrape the place name
        return await page.$eval('h1', (el) => el.textContent)
      },
      maxRetries: 3,
    })
  } catch (error) {
    throw new Error(
      `scrapePlaceName failed to parse place name for attraction: ${attractionId} in destination: ${destinationName}`,
    )
  }
}

export async function visitAboutTab(page: Page, placeName: string) {
  try {
    return await withExponentialBackoff({
      func: async () => {
        // Click the about tab to get more data about Amenities and Crowd, if they exist
        const aboutButton = await page.$(`button[aria-label="About ${placeName}"]`)

        if (aboutButton) {
          await aboutButton.click()
        } else {
          throw new Error(`aboutButton not found for ${placeName}`)
        }

        await sleepRandom(2, 3)
      },
      maxRetries: 3,
    })
  } catch (error) {
    throw new Error(`visitAboutTab failed for ${placeName}`)
  }
}

// google about info types
export enum InfoEnum {
  FROM_THE_BUSINESS = 'From the business',
  SERVICE_OPTIONS = 'Service options',
  HIGHLIGHTS = 'Highlights',
  POPULAR_FOR = 'Popular for',
  ACCESSIBILITY = 'Accessibility',
  ACTIVITIES = 'Activities', // added during DO scrape, not present for EAT, probably not relevant for EAT anyways.
  OFFERINGS = 'Offerings',
  DINING_OPTIONS = 'Dining options',
  AMENITIES = 'Amenities',
  ATMOSPHERE = 'Atmosphere',
  CROWD = 'Crowd',
  CHILDREN = 'Children',
  PLANNING = 'Planning',
  PAYMENTS = 'Payments',
}

export async function scrapeAboutInfoItems(
  page: Page,
  placeName: string,
  infoType: InfoEnum,
): Promise<InfoItemInput[]> {
  try {
    return await withExponentialBackoff({
      func: async () => {
        const infoElement = await page.$x(`//h2[contains(text(), "${infoType}")]/following-sibling::ul[1]`)
        if (infoElement.length > 0) {
          const infoItems: InfoItemInput[] = []
          const infoItemsElements = await infoElement[0].$$('li')

          for (let i = 0; i < infoItemsElements.length; i++) {
            const text = await (await infoItemsElements[i].getProperty('textContent')).jsonValue()

            // check for the presence of an <img> with src attribute containing string "check"
            const affirmative = await infoItemsElements[i].$('img[src*="check"]')

            // check for the presence of an <img> with src attribute containing string "not_interested"
            const negative = await infoItemsElements[i].$('img[src*="not_interested"]')

            if (!text) {
              throw new Error(`No text found for ${infoType} for ${placeName}`)
            }

            // store in an object
            const infoItem: InfoItemInput = {
              name: text,
              // only include affirmative or negative if they exist
              ...(affirmative && { affirmative: true }),
              ...(negative && { negative: true }),
            }
            // push to the infoItems array
            infoItems.push(infoItem)
          }
          return infoItems
        }
      },
      maxRetries: 3,
    })
  } catch (error) {
    throw new Error(`scrapeAboutInfoItems failed for ${placeName}`)
  }
}

type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[]

export type PopularTimes = Record<DayOfWeek, Record<number, number>>
export async function scrapePopularTimes(
  page: Page,
  placeName: string,
): Promise<{ dayData: DayDataInput; popularTimes: PopularTimes }> {
  // look for a div with aria-label containing substring "Popular times at"
  const popularTimesElement = await withExponentialBackoff({
    func: async () => {
      return await page.$(`div[aria-label*="Popular times at ${placeName}"]`)
    },
    maxRetries: 2,
  })

  if (!popularTimesElement) {
    // console.log(`No popular times found for ${placeName}`);
    throw new Error(`No popular times found for ${placeName}`)
  }

  const weekElement = await popularTimesElement.$(`button[aria-label="Go to the previous day"] ~ div`)
  // the day elements are descendents of the week element, with class "g2BVhd"
  const dayElements = await weekElement.$$('div.g2BVhd')

  // for each day element, first check that the inner text content of the dayElement doesn't contain "Closed"
  // if it does not contain "Closed", then there consists several hoursElements, each of which contains the busy-ness for that hour
  // these can be identified by aria-label containing substring "% busy at"

  // Step 4: get the hoursElements
  let popularTimes: Partial<PopularTimes> = {}

  for (let i = 0; i < dayElements.length; i++) {
    const dayElement = dayElements[i]
    const innerText = await dayElement.evaluate((el: HTMLElement) => el.innerText)

    // Skip if the dayElement contains "Closed"
    if (innerText.includes('Closed')) continue

    // If the day is not "Closed", then get the hour elements
    const hoursElements = await dayElement.$$(`div[role="img"][aria-label*="% busy"]`)

    // Step 5: Organize the scraped hours into an object
    const dayPopularTimes: Record<number, number> = {}

    let currentHour = 0 // currentHour is necessary for fallback, which is necessary to cover present hour

    for (let hourElement of hoursElements) {
      const ariaLabelValue = await hourElement.evaluate((el: HTMLElement) => el.getAttribute('aria-label'))

      // Try to match the regular format first
      let match = ariaLabelValue.match(/(\d+)% busy at (\d+)( AM| PM)/i)

      if (!match) {
        // if this doesn't match, it may be because the string says "Currently 26% busy, usually 36% busy."
        // so we should fallback to getting the "usually" value here, looking for substring
        match = ariaLabelValue.match(/usually (\d+)% busy./i)
        // If the alternate format matches, use the current hour
        if (match) {
          dayPopularTimes[currentHour] = +match[1]
        }
      } else {
        // If the regular format matches, update the current hour
        currentHour = match[3].toLowerCase() === ' pm' && +match[2] < 12 ? +match[2] + 12 : +match[2]
        dayPopularTimes[currentHour] = +match[1]
      }

      // Increment the current hour after processing each element
      currentHour++
    }

    popularTimes[days[i]] = dayPopularTimes
  }

  /*
  logs:
  Popular times for Winspear Opera House: {"Monday":{"6":0,"7":0,"8":0,"9":0,"10":21,"11":22,"12":20,"13":16,"14":14,"15":17,"16":29,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Tuesday":{"6":0,"7":0,"8":0,"9":0,"10":24,"11":28,"12":29,"13":27,"14":21,"15":16,"16":17,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Wednesday":{"6":0,"7":0,"8":0,"9":0,"10":17,"11":20,"12":23,"13":24,"14":25,"15":28,"16":39,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Thursday":{"6":0,"7":0,"8":0,"9":0,"11":36,"12":36,"13":32,"14":27,"15":23,"16":35,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Friday":{"6":0,"7":0,"8":0,"9":0,"10":66,"11":91,"12":100,"13":86,"14":60,"15":32,"16":18,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}}
  */

  const popularTimesObject = popularTimes as PopularTimes
  // Step 6: Convert the popularTimes object to the DayDataInput format
  const dayDataInput = convertPopularTimesToDayDataInput(popularTimesObject)

  return { dayData: dayDataInput, popularTimes: popularTimesObject }
}

function convertPopularTimesToDayDataInput(popularTimes: PopularTimes): DayDataInput {
  const dayDataInput: DayDataInput = {}

  for (const day in popularTimes) {
    const hourlyData: HourlyDataInput = { hours: [] }
    for (const hour in popularTimes[day as DayOfWeek]) {
      hourlyData.hours.push({
        hour: parseInt(hour),
        value: popularTimes[day as DayOfWeek][hour],
      })
    }
    dayDataInput[day as DayOfWeek] = hourlyData
  }

  return dayDataInput
}

export async function scrapeGoogleReviews(
  page: Page,
  placeName: string,
  pagesToScrape: number,
  attractionId: string,
  destinationName: string,
) {
  pagesToScrape = pagesToScrape || 3 // in case falsy

  let reviews: ReviewInput[] = []
  try {
    await withExponentialBackoff({
      func: async () => {
        // reset reviews
        reviews = []
        // wait for div element with aria-label="Refine reviews"
        await page.waitForSelector(`button[aria-label="Reviews for ${placeName}"]`, { timeout: 10000 })
        // Click the reviews tab to load the reviews
        const reviewsButton = await page.$(`button[aria-label="Reviews for ${placeName}"]`)

        if (reviewsButton) {
          await reviewsButton.click()
        }

        await sleepRandom(2, 3)

        // wait for div element with classes m6QErb DxyBCb kA9KIf dS8AEf
        await page.waitForSelector(`div.m6QErb.DxyBCb.kA9KIf.dS8AEf`, {
          timeout: 10000,
        })

        // this is the scrollContainer of the reviews
        const scrollContainer = await page.$(`div.m6QErb.DxyBCb.kA9KIf.dS8AEf`)

        await sleepRandom(2, 3)

        // Scroll within the scrollContainer
        for (let i = 0; i < pagesToScrape; i++) {
          await page.evaluate(async (container) => {
            // @ts-ignore
            return container.scrollTo(0, container.scrollHeight)
          }, scrollContainer)

          // Sleep between scrolls to allow the page to load new reviews
          await sleepRandom(2, 3)
        }

        // sleep for 1-2 seconds
        await sleepRandom(1, 2)

        // get all divs with class jftiEf. these are the reviews
        const reviewElements = await page.$$('div.jftiEf')

        // for each review, get the author_name, author_url, profile_photo_url, rating, relative_time_description, language, and text
        /* 
        each review has this structure: <div aria-label="${author_name}"><div><div><div><button data-href="${author_url}"><img src="${profile_photo_url}"></button></div><div></div><div></div><div><div><span aira-label="${rating} stars"></span><span>${relative_time_description}</span><div></div></div><div><div lang=${language}><span>${text}</span><span><button aria-label="See more">More</button></span>
    
        tricky part: the last span may contain a button or may be empty. If it contains a button, we'll want to click it, which will populate the full review text in the previous span, at which point we'll grab the text from the previous span. If it's empty, we'll still want to grab the text from the previous span.
        */

        // Process only the first 30 reviews
        for (let i = 0; i < Math.min(30, reviewElements.length); i++) {
          const reviewElement = reviewElements[i]

          let author_name = await page.evaluate((el) => el.getAttribute('aria-label'), reviewElement)

          // Get author_url
          const authorUrlElement = await reviewElement.$('button[data-href]')
          let author_url = authorUrlElement
            ? await page.evaluate((el) => el.getAttribute('data-href'), authorUrlElement)
            : ''

          // Get profile_photo_url
          const profilePhotoElement = await reviewElement.$('img')
          let profile_photo_url = profilePhotoElement
            ? await page.evaluate((el) => el.getAttribute('src'), profilePhotoElement)
            : ''

          // Get rating
          // ratingElementParent is a div with class DU9Pgb
          const ratingElementParent = await reviewElement.$('div.DU9Pgb')
          // first child of ratingElementParent that is a span contains the rating
          const ratingElement = ratingElementParent ? await ratingElementParent.$('span') : null

          // if this span has an aria-label attribute, get the rating from that
          // otherwise, get the rating from the textContent
          let rating = ratingElement
            ? await page.evaluate((el) => {
                const ratingStr = el.getAttribute('aria-label') || el.textContent
                return ratingStr ? parseInt(ratingStr) : null
              }, ratingElement)
            : null

          // the next span after the rating element is the relative_time_description element
          const relativeTimeDescriptionElement = ratingElement ? await ratingElementParent?.$('span + span') : null
          // grab the relative_time_description from the textContent
          let relative_time_description = relativeTimeDescriptionElement
            ? await page.evaluate((el) => el.textContent, relativeTimeDescriptionElement)
            : ''

          // remove all text after "ago"
          relative_time_description = relative_time_description?.split('ago')[0] + 'ago'

          // Get review text and language.
          // reviewDivElement is a div with class "MyEned"
          const reviewDivElement = await reviewElement.$('div.MyEned')
          // alt: const reviewDivElement = await reviewElement.$('div[lang]');
          let language = reviewDivElement ? await page.evaluate((el) => el.getAttribute('lang'), reviewDivElement) : ''
          let text = reviewDivElement ? await reviewDivElement.$eval('span', (el) => el.textContent) : ''

          // Check if there's a "See more" button and click it if so
          const seeMoreButton = await reviewElement.$('button[aria-label="See more"]')
          if (seeMoreButton) {
            await seeMoreButton.click()
            // get the updated text
            text = reviewDivElement ? await reviewDivElement.$eval('span', (el) => el.textContent) : ''
          }

          if (!text) {
            // skip this review if there's no text
            continue
          }

          // store in an object
          let review: ReviewInput = {
            authorName: author_name || 'n/a',
            authorUrl: author_url || 'n/a',
            language: language || 'n/a',
            profilePhotoUrl: profile_photo_url || 'n/a',
            rating: rating || -1,
            relativeTimeDescription: relative_time_description,
            text,
            time: 'n/a',
          }

          if ((review.text?.length ?? 0) > 0) {
            // push to the reviews array
            reviews.push(review)
          }
        }
      },
      maxRetries: 3,
    })
  } catch (error) {
    if (reviews.length === 0) {
      // if no reviews were scraped, throw an error
      throw new Error(
        `scrapePlaceDetails failed to scrape google reviews for attraction ${attractionId} in destination ${destinationName}`,
      )
    }
  }
  return reviews
}

enum TimeOfDay {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

enum MealTime {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

type DoTimeRanges = {
  [key in TimeOfDay]: { start: number; end: number }
}

type EatTimeRanges = {
  [key in MealTime]: { start: number; end: number }
}

type AttractionTimeRanges = {
  [ATTRACTION_TYPE.DO]: DoTimeRanges
  [ATTRACTION_TYPE.EAT]: EatTimeRanges
}

export function getPopularBestVisited(popularTimes: PopularTimes, attractionType: ATTRACTION_TYPE) {
  // Define the time ranges for different attraction types
  // ok if intervals aren't equal, as we'll be taking the top 3 busiest hours within each interval
  const timeRanges: AttractionTimeRanges = {
    [ATTRACTION_TYPE.DO]: {
      [TimeOfDay.MORNING]: { start: 4, end: 12 },
      [TimeOfDay.AFTERNOON]: { start: 12, end: 18 },
      [TimeOfDay.EVENING]: { start: 18, end: 24 },
    },
    [ATTRACTION_TYPE.EAT]: {
      [MealTime.BREAKFAST]: { start: 4, end: 11 },
      [MealTime.LUNCH]: { start: 11, end: 15 },
      [MealTime.DINNER]: { start: 17, end: 24 },
    },
  }

  const timeRangesForAttraction = timeRanges[attractionType]

  let timesByDay: Record<string, Record<string, number>> = {} // eventually looks like {"Sunday": {..}, "Monday": {...}, ...}
  let totalTimes: Record<string, number> = {}

  // for each day, construct an object like {"MORNING": 0, "AFTERNOON": 55, "EVENING": 233}, which contains each enumerable key in timeRanges, with value which is the sum of the busy-ness of the top 3 hours in that time range

  // Iterate over each day
  for (let day in popularTimes) {
    timesByDay[day] = {} // initialize the object for this day {"Sunday": {}}

    // Iterate over each time range
    // timeRangesForAttraction: {"MORNING": { start: 4, end: 12 }, "AFTERNOON": { start: 12, end: 18 }, "EVENING": { start: 18, end: 24 }}
    for (const [timeRange, { start, end }] of Object.entries(timeRangesForAttraction)) {
      const popularTimesArray = Object.entries(popularTimes[day as DayOfWeek]).map(([hour, busyness]) => [
        parseInt(hour),
        busyness,
      ]) as Array<[number, number]> // [[6, 0], [7, 0], [8, 0], ...]

      // Get the hours and their busyness for this time range
      const hoursInTimeRange = popularTimesArray
        .filter(([hour]) => hour >= start && hour < end) // filter out hours that aren't in the time range
        .sort((a, b) => b[1] - a[1]) // sort by busyness, descending
        .slice(0, 3)

      // Sum the busyness of the top 3 hours
      const top3HoursBusyness = hoursInTimeRange.reduce((sum, [, busyness]) => sum + busyness, 0)

      timesByDay[day][timeRange] = top3HoursBusyness // store the busyness for this time range, ex: {"Sunday": { "MORNING": 0, "AFTERNOON": 55, "EVENING": 233}}

      /*
          output:
          {"Monday": { "MORNING": 0, "AFTERNOON": 55, "EVENING": 233}, "Tuesday": { "MORNING": 0, "AFTERNOON": 85, "EVENING": 215}, ... repeat for each day}
          */

      // now that we have an object with key day, value of an object with the enumerable keys in timeRanges and values being the sum of the top 3 hours in that time range, we'd like to determine the aggregated value for each time range across the week

      /*
          output:
          {"MORNING": 0, "AFTERNOON": 842, "EVENING": 1323}
          */

      // Accumulate the total busyness for this time range across all days
      totalTimes[timeRange] = (totalTimes[timeRange] || 0) + top3HoursBusyness
    }
  }

  // log the totalTimes object
  // console.log(`totalTimes: ${JSON.stringify(totalTimes)}`);

  // finally, order the time ranges by their aggregated value, remove those with value 0, and return an array of the time ranges in order of most busy to least busy
  // Order the time ranges by their aggregated value and remove those with value 0
  let orderedTimeRanges = Object.entries(totalTimes)
    .filter(([, busyness]) => busyness > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([timeRange]) => timeRange) as ATTRACTION_BEST_VISIT_TIME[]

  return orderedTimeRanges

  /*
  output:
  ["EVENING","AFTERNOON"]
  */
}

export async function scrapeMenuUrl(
  page: Page,
  attractionType: ATTRACTION_TYPE,
  attractionId: string,
  destinationName: string,
) {
  if (attractionType === ATTRACTION_TYPE.DO) {
    return null
  }
  try {
    return await withExponentialBackoff({
      func: async () => {
        // scrape the menu
        // @ts-ignore
        const menuLink = await page.$eval('a[data-item-id="menu"]', (a) => a.href)
        console.log(`menuLink: ${menuLink}`)
        return menuLink
      },
      maxRetries: 2,
    })
  } catch (error) {
    throw new Error(
      `scrapeMenuUrl failed to parse menu for attraction ${attractionId} in destination ${destinationName}`,
    )
  }
}
