"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeMenuUrl = exports.getPopularBestVisited = exports.scrapeGoogleReviews = exports.scrapePopularTimes = exports.scrapeAboutInfoItems = exports.InfoEnum = exports.visitAboutTab = exports.scrapePlaceName = exports.visitPlacePage = void 0;
const API_1 = require("shared-types/API");
const withExponentialBackoff_1 = require("../withExponentialBackoff");
const sleep_1 = require("../sleep");
async function visitPlacePage(browser, placeId) {
    const page = await browser.newPage();
    // page.on('console', msg => console.log('Browser Console:', msg.text()));
    await (0, withExponentialBackoff_1.withExponentialBackoff)({
        func: async () => {
            await page.goto(`https://www.google.com/maps/place/?q=place_id:${placeId}`);
        },
        maxRetries: 5,
    });
    // sleep for 1-2 seconds to allow page to load
    await (0, sleep_1.sleepRandom)(1, 2);
    return page;
}
exports.visitPlacePage = visitPlacePage;
async function scrapePlaceName(page, attractionId, destinationName) {
    try {
        return await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: async () => {
                // scrape the place name
                return await page.$eval('h1', (el) => el.textContent);
            },
            maxRetries: 3,
        });
    }
    catch (error) {
        throw new Error(`scrapePlaceName failed to parse place name for attraction: ${attractionId} in destination: ${destinationName}`);
    }
}
exports.scrapePlaceName = scrapePlaceName;
async function visitAboutTab(page, placeName) {
    try {
        return await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: async () => {
                // Click the about tab to get more data about Amenities and Crowd, if they exist
                const aboutButton = await page.$(`button[aria-label="About ${placeName}"]`);
                if (aboutButton) {
                    await aboutButton.click();
                }
                else {
                    throw new Error(`aboutButton not found for ${placeName}`);
                }
                await (0, sleep_1.sleepRandom)(2, 3);
            },
            maxRetries: 3,
        });
    }
    catch (error) {
        throw new Error(`visitAboutTab failed for ${placeName}`);
    }
}
exports.visitAboutTab = visitAboutTab;
// google about info types
var InfoEnum;
(function (InfoEnum) {
    InfoEnum["FROM_THE_BUSINESS"] = "From the business";
    InfoEnum["SERVICE_OPTIONS"] = "Service options";
    InfoEnum["HIGHLIGHTS"] = "Highlights";
    InfoEnum["POPULAR_FOR"] = "Popular for";
    InfoEnum["ACCESSIBILITY"] = "Accessibility";
    InfoEnum["ACTIVITIES"] = "Activities";
    InfoEnum["OFFERINGS"] = "Offerings";
    InfoEnum["DINING_OPTIONS"] = "Dining options";
    InfoEnum["AMENITIES"] = "Amenities";
    InfoEnum["ATMOSPHERE"] = "Atmosphere";
    InfoEnum["CROWD"] = "Crowd";
    InfoEnum["CHILDREN"] = "Children";
    InfoEnum["PLANNING"] = "Planning";
    InfoEnum["PAYMENTS"] = "Payments";
})(InfoEnum || (exports.InfoEnum = InfoEnum = {}));
async function scrapeAboutInfoItems(page, placeName, infoType) {
    try {
        return await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: async () => {
                const infoElement = await page.$x(`//h2[contains(text(), "${infoType}")]/following-sibling::ul[1]`);
                if (infoElement.length > 0) {
                    const infoItems = [];
                    const infoItemsElements = await infoElement[0].$$('li');
                    for (let i = 0; i < infoItemsElements.length; i++) {
                        const text = await (await infoItemsElements[i].getProperty('textContent')).jsonValue();
                        // check for the presence of an <img> with src attribute containing string "check"
                        const affirmative = await infoItemsElements[i].$('img[src*="check"]');
                        // check for the presence of an <img> with src attribute containing string "not_interested"
                        const negative = await infoItemsElements[i].$('img[src*="not_interested"]');
                        if (!text) {
                            throw new Error(`No text found for ${infoType} for ${placeName}`);
                        }
                        // store in an object
                        const infoItem = {
                            name: text,
                            // only include affirmative or negative if they exist
                            ...(affirmative && { affirmative: true }),
                            ...(negative && { negative: true }),
                        };
                        // push to the infoItems array
                        infoItems.push(infoItem);
                    }
                    return infoItems;
                }
            },
            maxRetries: 3,
        });
    }
    catch (error) {
        throw new Error(`scrapeAboutInfoItems failed for ${placeName}`);
    }
}
exports.scrapeAboutInfoItems = scrapeAboutInfoItems;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
async function scrapePopularTimes(page, placeName) {
    // look for a div with aria-label containing substring "Popular times at"
    const popularTimesElement = await (0, withExponentialBackoff_1.withExponentialBackoff)({
        func: async () => {
            return await page.$(`div[aria-label*="Popular times at ${placeName}"]`);
        },
        maxRetries: 2,
    });
    if (!popularTimesElement) {
        // console.log(`No popular times found for ${placeName}`);
        throw new Error(`No popular times found for ${placeName}`);
    }
    const weekElement = await popularTimesElement.$(`button[aria-label="Go to the previous day"] ~ div`);
    // the day elements are descendents of the week element, with class "g2BVhd"
    const dayElements = await weekElement.$$('div.g2BVhd');
    // for each day element, first check that the inner text content of the dayElement doesn't contain "Closed"
    // if it does not contain "Closed", then there consists several hoursElements, each of which contains the busy-ness for that hour
    // these can be identified by aria-label containing substring "% busy at"
    // Step 4: get the hoursElements
    let popularTimes = {};
    for (let i = 0; i < dayElements.length; i++) {
        const dayElement = dayElements[i];
        const innerText = await dayElement.evaluate((el) => el.innerText);
        // Skip if the dayElement contains "Closed"
        if (innerText.includes('Closed'))
            continue;
        // If the day is not "Closed", then get the hour elements
        const hoursElements = await dayElement.$$(`div[role="img"][aria-label*="% busy"]`);
        // Step 5: Organize the scraped hours into an object
        const dayPopularTimes = {};
        let currentHour = 0; // currentHour is necessary for fallback, which is necessary to cover present hour
        for (let hourElement of hoursElements) {
            const ariaLabelValue = await hourElement.evaluate((el) => el.getAttribute('aria-label'));
            // Try to match the regular format first
            let match = ariaLabelValue.match(/(\d+)% busy at (\d+)( AM| PM)/i);
            if (!match) {
                // if this doesn't match, it may be because the string says "Currently 26% busy, usually 36% busy."
                // so we should fallback to getting the "usually" value here, looking for substring
                match = ariaLabelValue.match(/usually (\d+)% busy./i);
                // If the alternate format matches, use the current hour
                if (match) {
                    dayPopularTimes[currentHour] = +match[1];
                }
            }
            else {
                // If the regular format matches, update the current hour
                currentHour = match[3].toLowerCase() === ' pm' && +match[2] < 12 ? +match[2] + 12 : +match[2];
                dayPopularTimes[currentHour] = +match[1];
            }
            // Increment the current hour after processing each element
            currentHour++;
        }
        popularTimes[days[i]] = dayPopularTimes;
    }
    /*
    logs:
    Popular times for Winspear Opera House: {"Monday":{"6":0,"7":0,"8":0,"9":0,"10":21,"11":22,"12":20,"13":16,"14":14,"15":17,"16":29,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Tuesday":{"6":0,"7":0,"8":0,"9":0,"10":24,"11":28,"12":29,"13":27,"14":21,"15":16,"16":17,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Wednesday":{"6":0,"7":0,"8":0,"9":0,"10":17,"11":20,"12":23,"13":24,"14":25,"15":28,"16":39,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Thursday":{"6":0,"7":0,"8":0,"9":0,"11":36,"12":36,"13":32,"14":27,"15":23,"16":35,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"Friday":{"6":0,"7":0,"8":0,"9":0,"10":66,"11":91,"12":100,"13":86,"14":60,"15":32,"16":18,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}}
    */
    const popularTimesObject = popularTimes;
    // Step 6: Convert the popularTimes object to the DayDataInput format
    const dayDataInput = convertPopularTimesToDayDataInput(popularTimesObject);
    return { dayData: dayDataInput, popularTimes: popularTimesObject };
}
exports.scrapePopularTimes = scrapePopularTimes;
function convertPopularTimesToDayDataInput(popularTimes) {
    const dayDataInput = {};
    for (const day in popularTimes) {
        const hourlyData = { hours: [] };
        for (const hour in popularTimes[day]) {
            hourlyData.hours.push({
                hour: parseInt(hour),
                value: popularTimes[day][hour],
            });
        }
        dayDataInput[day] = hourlyData;
    }
    return dayDataInput;
}
async function scrapeGoogleReviews(page, placeName, pagesToScrape, attractionId, destinationName) {
    pagesToScrape = pagesToScrape || 3; // in case falsy
    let reviews = [];
    try {
        await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: async () => {
                // reset reviews
                reviews = [];
                // wait for div element with aria-label="Refine reviews"
                await page.waitForSelector(`button[aria-label="Reviews for ${placeName}"]`, { timeout: 10000 });
                // Click the reviews tab to load the reviews
                const reviewsButton = await page.$(`button[aria-label="Reviews for ${placeName}"]`);
                if (reviewsButton) {
                    await reviewsButton.click();
                }
                await (0, sleep_1.sleepRandom)(2, 3);
                // wait for div element with classes m6QErb DxyBCb kA9KIf dS8AEf
                await page.waitForSelector(`div.m6QErb.DxyBCb.kA9KIf.dS8AEf`, {
                    timeout: 10000,
                });
                // this is the scrollContainer of the reviews
                const scrollContainer = await page.$(`div.m6QErb.DxyBCb.kA9KIf.dS8AEf`);
                await (0, sleep_1.sleepRandom)(2, 3);
                // Scroll within the scrollContainer
                for (let i = 0; i < pagesToScrape; i++) {
                    await page.evaluate(async (container) => {
                        // @ts-ignore
                        return container.scrollTo(0, container.scrollHeight);
                    }, scrollContainer);
                    // Sleep between scrolls to allow the page to load new reviews
                    await (0, sleep_1.sleepRandom)(2, 3);
                }
                // sleep for 1-2 seconds
                await (0, sleep_1.sleepRandom)(1, 2);
                // get all divs with class jftiEf. these are the reviews
                const reviewElements = await page.$$('div.jftiEf');
                // for each review, get the author_name, author_url, profile_photo_url, rating, relative_time_description, language, and text
                /*
                each review has this structure: <div aria-label="${author_name}"><div><div><div><button data-href="${author_url}"><img src="${profile_photo_url}"></button></div><div></div><div></div><div><div><span aira-label="${rating} stars"></span><span>${relative_time_description}</span><div></div></div><div><div lang=${language}><span>${text}</span><span><button aria-label="See more">More</button></span>
            
                tricky part: the last span may contain a button or may be empty. If it contains a button, we'll want to click it, which will populate the full review text in the previous span, at which point we'll grab the text from the previous span. If it's empty, we'll still want to grab the text from the previous span.
                */
                // Process only the first 30 reviews
                for (let i = 0; i < Math.min(30, reviewElements.length); i++) {
                    const reviewElement = reviewElements[i];
                    let author_name = await page.evaluate((el) => el.getAttribute('aria-label'), reviewElement);
                    // Get author_url
                    const authorUrlElement = await reviewElement.$('button[data-href]');
                    let author_url = authorUrlElement
                        ? await page.evaluate((el) => el.getAttribute('data-href'), authorUrlElement)
                        : '';
                    // Get profile_photo_url
                    const profilePhotoElement = await reviewElement.$('img');
                    let profile_photo_url = profilePhotoElement
                        ? await page.evaluate((el) => el.getAttribute('src'), profilePhotoElement)
                        : '';
                    // Get rating
                    // ratingElementParent is a div with class DU9Pgb
                    const ratingElementParent = await reviewElement.$('div.DU9Pgb');
                    // first child of ratingElementParent that is a span contains the rating
                    const ratingElement = ratingElementParent ? await ratingElementParent.$('span') : null;
                    // if this span has an aria-label attribute, get the rating from that
                    // otherwise, get the rating from the textContent
                    let rating = ratingElement
                        ? await page.evaluate((el) => {
                            const ratingStr = el.getAttribute('aria-label') || el.textContent;
                            return ratingStr ? parseInt(ratingStr) : null;
                        }, ratingElement)
                        : null;
                    // the next span after the rating element is the relative_time_description element
                    const relativeTimeDescriptionElement = ratingElement ? await ratingElementParent?.$('span + span') : null;
                    // grab the relative_time_description from the textContent
                    let relative_time_description = relativeTimeDescriptionElement
                        ? await page.evaluate((el) => el.textContent, relativeTimeDescriptionElement)
                        : '';
                    // remove all text after "ago"
                    relative_time_description = relative_time_description?.split('ago')[0] + 'ago';
                    // Get review text and language.
                    // reviewDivElement is a div with class "MyEned"
                    const reviewDivElement = await reviewElement.$('div.MyEned');
                    // alt: const reviewDivElement = await reviewElement.$('div[lang]');
                    let language = reviewDivElement ? await page.evaluate((el) => el.getAttribute('lang'), reviewDivElement) : '';
                    let text = reviewDivElement ? await reviewDivElement.$eval('span', (el) => el.textContent) : '';
                    // Check if there's a "See more" button and click it if so
                    const seeMoreButton = await reviewElement.$('button[aria-label="See more"]');
                    if (seeMoreButton) {
                        await seeMoreButton.click();
                        // get the updated text
                        text = reviewDivElement ? await reviewDivElement.$eval('span', (el) => el.textContent) : '';
                    }
                    if (!text) {
                        // skip this review if there's no text
                        continue;
                    }
                    // store in an object
                    let review = {
                        authorName: author_name || 'n/a',
                        authorUrl: author_url || 'n/a',
                        language: language || 'n/a',
                        profilePhotoUrl: profile_photo_url || 'n/a',
                        rating: rating || -1,
                        relativeTimeDescription: relative_time_description,
                        text,
                        time: 'n/a',
                    };
                    if ((review.text?.length ?? 0) > 0) {
                        // push to the reviews array
                        reviews.push(review);
                    }
                }
            },
            maxRetries: 3,
        });
    }
    catch (error) {
        if (reviews.length === 0) {
            // if no reviews were scraped, throw an error
            throw new Error(`scrapePlaceDetails failed to scrape google reviews for attraction ${attractionId} in destination ${destinationName}`);
        }
    }
    return reviews;
}
exports.scrapeGoogleReviews = scrapeGoogleReviews;
var TimeOfDay;
(function (TimeOfDay) {
    TimeOfDay["MORNING"] = "MORNING";
    TimeOfDay["AFTERNOON"] = "AFTERNOON";
    TimeOfDay["EVENING"] = "EVENING";
})(TimeOfDay || (TimeOfDay = {}));
var MealTime;
(function (MealTime) {
    MealTime["BREAKFAST"] = "BREAKFAST";
    MealTime["LUNCH"] = "LUNCH";
    MealTime["DINNER"] = "DINNER";
})(MealTime || (MealTime = {}));
function getPopularBestVisited(popularTimes, attractionType) {
    // Define the time ranges for different attraction types
    // ok if intervals aren't equal, as we'll be taking the top 3 busiest hours within each interval
    const timeRanges = {
        [API_1.ATTRACTION_TYPE.DO]: {
            [TimeOfDay.MORNING]: { start: 4, end: 12 },
            [TimeOfDay.AFTERNOON]: { start: 12, end: 18 },
            [TimeOfDay.EVENING]: { start: 18, end: 24 },
        },
        [API_1.ATTRACTION_TYPE.EAT]: {
            [MealTime.BREAKFAST]: { start: 4, end: 11 },
            [MealTime.LUNCH]: { start: 11, end: 15 },
            [MealTime.DINNER]: { start: 17, end: 24 },
        },
    };
    const timeRangesForAttraction = timeRanges[attractionType];
    let timesByDay = {}; // eventually looks like {"Sunday": {..}, "Monday": {...}, ...}
    let totalTimes = {};
    // for each day, construct an object like {"MORNING": 0, "AFTERNOON": 55, "EVENING": 233}, which contains each enumerable key in timeRanges, with value which is the sum of the busy-ness of the top 3 hours in that time range
    // Iterate over each day
    for (let day in popularTimes) {
        timesByDay[day] = {}; // initialize the object for this day {"Sunday": {}}
        // Iterate over each time range
        // timeRangesForAttraction: {"MORNING": { start: 4, end: 12 }, "AFTERNOON": { start: 12, end: 18 }, "EVENING": { start: 18, end: 24 }}
        for (const [timeRange, { start, end }] of Object.entries(timeRangesForAttraction)) {
            const popularTimesArray = Object.entries(popularTimes[day]).map(([hour, busyness]) => [
                parseInt(hour),
                busyness,
            ]); // [[6, 0], [7, 0], [8, 0], ...]
            // Get the hours and their busyness for this time range
            const hoursInTimeRange = popularTimesArray
                .filter(([hour]) => hour >= start && hour < end) // filter out hours that aren't in the time range
                .sort((a, b) => b[1] - a[1]) // sort by busyness, descending
                .slice(0, 3);
            // Sum the busyness of the top 3 hours
            const top3HoursBusyness = hoursInTimeRange.reduce((sum, [, busyness]) => sum + busyness, 0);
            timesByDay[day][timeRange] = top3HoursBusyness; // store the busyness for this time range, ex: {"Sunday": { "MORNING": 0, "AFTERNOON": 55, "EVENING": 233}}
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
            totalTimes[timeRange] = (totalTimes[timeRange] || 0) + top3HoursBusyness;
        }
    }
    // log the totalTimes object
    // console.log(`totalTimes: ${JSON.stringify(totalTimes)}`);
    // finally, order the time ranges by their aggregated value, remove those with value 0, and return an array of the time ranges in order of most busy to least busy
    // Order the time ranges by their aggregated value and remove those with value 0
    let orderedTimeRanges = Object.entries(totalTimes)
        .filter(([, busyness]) => busyness > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([timeRange]) => timeRange);
    return orderedTimeRanges;
    /*
    output:
    ["EVENING","AFTERNOON"]
    */
}
exports.getPopularBestVisited = getPopularBestVisited;
async function scrapeMenuUrl(page, attractionType, attractionId, destinationName) {
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        return null;
    }
    try {
        return await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: async () => {
                // scrape the menu
                // @ts-ignore
                const menuLink = await page.$eval('a[data-item-id="menu"]', (a) => a.href);
                console.log(`menuLink: ${menuLink}`);
                return menuLink;
            },
            maxRetries: 2,
        });
    }
    catch (error) {
        throw new Error(`scrapeMenuUrl failed to parse menu for attraction ${attractionId} in destination ${destinationName}`);
    }
}
exports.scrapeMenuUrl = scrapeMenuUrl;
