"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeWebData = exports.scrapeYelpData = exports.scrapeGoogleWebData = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const google_1 = require("./google");
const toCamelCase_1 = require("./toCamelCase");
const constants_1 = require("./constants");
const yelp_1 = require("./yelp");
async function scrapeGoogleWebData({ attractionId, googlePlaceId, browser, attractionType, }) {
    let page = null;
    let placeWebData = {};
    let scrapedReviews = [];
    try {
        console.log(`scraping google additional info for place id: ${googlePlaceId}, website: https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`);
        page = await (0, google_1.visitPlacePage)(browser, googlePlaceId);
        console.log('visited place page');
        if (!page) {
            throw new Error('page is null');
        }
        // OVERVIEW TAB
        console.log('scraping overview tab');
        const placeName = await (0, google_1.scrapePlaceName)(page, attractionId, 'some destination name');
        console.log(`place name: ${placeName}`);
        try {
            const result = await (0, google_1.scrapePopularTimes)(page, placeName);
            if (result?.dayData) {
                placeWebData.popularTimes = result.dayData;
            }
            // console.log(`scrapePopularTimes result: ${JSON.stringify(result)}`)
            if (result?.popularTimes) {
                const bestVisitedByPopularTimes = (0, google_1.getPopularBestVisited)(result.popularTimes, attractionType);
                if (bestVisitedByPopularTimes) {
                    placeWebData.bestVisitedByPopularTimes = bestVisitedByPopularTimes;
                }
                console.log('past getPopularBestVisited');
            }
        }
        catch (error) {
            console.error(error);
        }
        const menuLink = await (0, google_1.scrapeMenuUrl)(page, attractionType, attractionId, 'some destination name').catch((error) => console.error(error));
        if (menuLink) {
            placeWebData.menuLink = menuLink;
        }
        console.log('past scrapeMenuUrl');
        // ABOUT TAB
        // Click the about tab to get more data about Amenities and Crowd, if they exist
        try {
            console.log('scraping about tab');
            await (0, google_1.visitAboutTab)(page, placeName);
            console.log('visited about tab');
            const infoPromises = Object.values(google_1.InfoEnum).map(async (infoType) => {
                let infoItems = await (0, google_1.scrapeAboutInfoItems)(page, placeName, infoType);
                if (infoItems?.length > 0) {
                    return { [(0, toCamelCase_1.toCamelCase)(infoType)]: infoItems };
                }
                else {
                    return null;
                }
            });
            console.log('past infoPromises');
            // filter out null values before Object.assign
            const infoObjects = (await Promise.all(infoPromises)).filter(Boolean);
            // filter out keys that are not in AboutBusinessInputKeys
            const filteredInfoObjects = infoObjects.map((infoObject) => {
                // Assert that infoObject is not null
                const nonNullInfoObject = infoObject;
                return Object.keys(nonNullInfoObject)
                    .filter((key) => Object.values(constants_1.AboutBusinessInputKeys).includes(key))
                    .reduce((obj, key) => {
                    obj[key] = nonNullInfoObject[key];
                    return obj;
                }, {});
            });
            const allInfo = Object.assign({}, ...filteredInfoObjects);
            console.log('past allInfo');
            if (allInfo) {
                placeWebData.aboutBusiness = allInfo;
            }
        }
        catch (error) {
            console.error(error);
        }
        // REVIEWS TAB
        console.log('scraping reviews tab');
        const googleReviews = await (0, google_1.scrapeGoogleReviews)(page, placeName, 3, attractionId, 'some destination name');
        if (googleReviews?.length > 0) {
            scrapedReviews = googleReviews;
        }
        // log the number of reviews scraped
        console.log(`scraped ${scrapedReviews.length} google reviews`);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        // close the page
        if (page) {
            try {
                await page.close();
            }
            catch {
                console.error('error closing page');
            }
        }
    }
    return {
        placeWebData,
        scrapedReviews,
    };
}
exports.scrapeGoogleWebData = scrapeGoogleWebData;
async function scrapeYelpData({ browser, placeData, }) {
    let yelpPage = null;
    let yelpWebData = null;
    try {
        console.log('scraping yelp data');
        // get yelp api data so that we can get the yelp url to visit
        const yelpApiInput = (0, yelp_1.getYelpAPIInput)(placeData);
        const yelpBusiness = await (0, yelp_1.getYelpAPIData)(yelpApiInput);
        console.log('past getYelpAPIData');
        const yelpBusinessUrl = yelpBusiness.url;
        yelpWebData = {
            id: yelpBusiness.id,
            url: yelpBusinessUrl,
            price: yelpBusiness.price?.length,
            categories: yelpBusiness.categories?.map((category) => category.title),
        };
        // scrape yelp web data
        // new page for yelp
        if (!yelpBusinessUrl) {
            throw new Error('yelpBusinessUrl is null');
        }
        console.log(`visiting yelp page: ${yelpBusinessUrl}`);
        yelpPage = await (0, yelp_1.visitYelpPage)(browser, yelpBusinessUrl);
        console.log('past visitYelpPage');
        if (!yelpPage) {
            throw new Error('page is null');
        }
        console.log('scraping amenities and more section');
        const amenities = await (0, yelp_1.scrapeAmenitiesAndMoreSection)(yelpPage);
        console.log('past scrapeAmenitiesAndMoreSection');
        if (amenities?.length > 0) {
            yelpWebData.amenities = amenities;
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        if (yelpPage) {
            try {
                await yelpPage.close();
            }
            catch {
                console.error('error closing yelp page');
            }
        }
    }
    return yelpWebData;
}
exports.scrapeYelpData = scrapeYelpData;
async function scrapeWebData({ attractionId, attractionType, googlePlaceId, placeData, }) {
    console.log(`launching puppeteer`);
    const browser = await puppeteer_core_1.default.launch({
        executablePath: await chromium_1.default.executablePath(),
        headless: chromium_1.default.headless,
        args: chromium_1.default.args,
        defaultViewport: chromium_1.default.defaultViewport,
    });
    console.log(`puppeteer launched`);
    let googleWebData = null;
    let yelpWebData = null;
    try {
        // 1. scrape google web data
        googleWebData = await scrapeGoogleWebData({
            attractionId,
            googlePlaceId,
            browser,
            attractionType,
        });
        console.log('past scrapeGoogleWebData');
    }
    catch (error) {
        console.error(error);
    }
    try {
        // 2. scrape yelp web data
        yelpWebData = await scrapeYelpData({
            browser,
            placeData,
        });
        console.log('past scrapeYelpData');
    }
    catch (error) {
        console.error(error);
    }
    // close the browser
    await browser.close();
    return {
        googleWebData,
        yelpWebData,
    };
}
exports.scrapeWebData = scrapeWebData;
