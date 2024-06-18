"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYelpAPIData = exports.getYelpAPIInput = exports.visitYelpPage = exports.scrapeAmenitiesAndMoreSection = exports.findYelpBusinessesByPhoneNumber = void 0;
// @ts-ignore
const yelp_fusion_1 = __importDefault(require("yelp-fusion"));
const YelpError_1 = require("./YelpError");
// @ts-ignore
const haversine_1 = __importDefault(require("haversine"));
const withExponentialBackoff_1 = require("../withExponentialBackoff");
const sleep_1 = require("../sleep");
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const constants_1 = require("../constants");
const findMatchingYelpBusiness_1 = require("../prompts/findMatchingYelpBusiness");
const getSSMVariable_1 = require("../getSSMVariable");
async function findYelpBusinessesByPhoneNumber({ phone, location, }) {
    const yelpApiKeysString = await (0, getSSMVariable_1.getSSMVariable)('YELP_API_KEY');
    // console.log(`yelpApiKeysString: ${yelpApiKeysString}`)
    const yelpApiKeys = yelpApiKeysString.split(',');
    // console.log(`yelpApiKeys: ${JSON.stringify(yelpApiKeys, null, 2)}`)
    // randomize the order of the keys to lessen the chance of hitting a rate limit
    yelpApiKeys.sort(() => Math.random() - 0.5);
    let data;
    // console.log(`Searching for yelpBusinesses with phone: ${phone}`)
    for (const yelpApiKey of yelpApiKeys) {
        try {
            console.log(`Trying key ${yelpApiKey}`);
            const yelpClient = yelp_fusion_1.default.client(yelpApiKey);
            data = await yelpClient.phoneSearch({ phone });
            break; // If successful, break the loop
        }
        catch (error) {
            console.log(`error: ${JSON.stringify(error, null, 2)}`);
            console.log(`key used: ${yelpApiKey}`);
            const errorCode = error?.error?.code;
            if (errorCode === 'TOO_MANY_REQUESTS_PER_SECOND' || errorCode === 'ACCESS_LIMIT_REACHED') {
                console.error(`Failed with key ${yelpApiKey}: ${error}`);
                // If it fails with one of these errors, it will continue with the next key
            }
            else {
                // If the error is something else, throw it
                throw error;
            }
        }
    }
    if (!data) {
        throw new Error('All API keys failed');
    }
    const parsedData = JSON.parse(data.body);
    console.log(`parsedData: ${JSON.stringify(parsedData, null, 2)}`);
    const businessesFound = parsedData.businesses;
    const numberOfBusinessesFound = businessesFound?.length;
    if (numberOfBusinessesFound === 0) {
        throw new YelpError_1.YelpBusinessNotFoundError(`${phone}`);
    }
    // Create an array to store all the Yelp businesses
    const yelpBusinesses = [];
    // Iterate over each business
    for (const matchedBusiness of businessesFound) {
        const yelpBusinessCoordinates = {
            latitude: matchedBusiness.coordinates.latitude,
            longitude: matchedBusiness.coordinates.longitude,
        };
        const googlePlaceCoordinates = {
            latitude: location.lat,
            longitude: location.lng,
        };
        const distance = (0, haversine_1.default)(yelpBusinessCoordinates, googlePlaceCoordinates, { unit: 'meter' });
        if (distance > 1600) {
            // console.log(`Skipping yelp business ${matchedBusiness.name} because it is too far away.`)
            continue;
        }
        const yelpBusiness = {
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
        };
        // Add the Yelp business to the array
        yelpBusinesses.push(yelpBusiness);
    }
    return yelpBusinesses;
}
exports.findYelpBusinessesByPhoneNumber = findYelpBusinessesByPhoneNumber;
async function scrapeAmenitiesAndMoreSection(page) {
    // look for the first section with aria-label="Amenities and More"
    const amenitiesAndMoreSection = await page.$('section[aria-label="Amenities and More"]');
    if (!amenitiesAndMoreSection) {
        throw new Error(`No amenities and more section found.`);
    }
    try {
        // within this section, look for a button with aria-expanded="false", and click it
        const showMoreButton = await amenitiesAndMoreSection.$('button[aria-expanded="false"]');
        if (!showMoreButton) {
            throw new Error(`No button with aria-expanded="false" found.`);
        }
        await showMoreButton.click();
    }
    catch (error) {
        // if there is no button with aria-expanded="false", then the amenities are already expanded
        console.warn(`No button with aria-expanded="false" found. Assuming amenities are already expanded.`);
    }
    // within amenitiesAndMoreSection,look for a div with id starting with the substring "expander-link-content"
    const expanderLinkContentDiv = await amenitiesAndMoreSection.$('div[id^="expander-link-content"]');
    if (!expanderLinkContentDiv) {
        throw new Error(`expanderLinkContentDiv not found. No div with id starting with "expander-link-content" found.`);
    }
    // get the grandchild of this div, which will be the container of the amenities divs. It will have a class beginning with "arrange_"
    const amenitiesContainer = await expanderLinkContentDiv.$('div[class*="arrange_"]');
    if (!amenitiesContainer) {
        throw new Error(`amenitiesContainer not found. No div with class starting with "arrange_" found.`);
    }
    // get references to each direct child div within amenitiesContainer with class starting with " arrange-unit_"
    const amenitiesDivs = await amenitiesContainer.$$('xpath/' + './*[starts-with(@class, "arrange-unit_")]');
    // for each div...
    const amenities = [];
    for (const div of amenitiesDivs) {
        // get the text content inside
        const textContent = await div.evaluate((node) => node.textContent);
        // now, look for a span with class starting with "icon--24-close-v2". If it exists, then this is a negative amenity
        const negativeAmenity = await div.$('span[class^="icon--24-close-v2"]');
        // now, look for a span with class starting with "icon--24-checkmark-v2". If it exists, then this is an affirmative amenity
        const affirmativeAmenity = await div.$('span[class^="icon--24-checkmark-v2"]');
        if (textContent) {
            const amenity = {
                name: textContent,
                // only add affirmative or negative if it exists
                ...(affirmativeAmenity && { affirmative: true }),
                ...(negativeAmenity && { negative: true }),
            };
            amenities.push(amenity);
        }
    }
    return amenities;
}
exports.scrapeAmenitiesAndMoreSection = scrapeAmenitiesAndMoreSection;
async function visitYelpPage(browser, yelpUrl) {
    const page = await browser.newPage();
    // page.on('console', msg => console.log('Browser Console:', msg.text()));
    await (0, withExponentialBackoff_1.withExponentialBackoff)({
        func: async () => {
            await page.goto(yelpUrl);
        },
        maxRetries: 5,
    });
    // sleep for 1-2 seconds to allow page to load
    await (0, sleep_1.sleepRandom)(1, 2);
    return page;
}
exports.visitYelpPage = visitYelpPage;
function getYelpAPIInput({ phone, location, name, address, summary }) {
    if (!phone || !name || !address) {
        throw new Error(`getYelpAPIInput: missing required input: ${JSON.stringify(`phone: ${phone}, name: ${name}, address: ${address}, summary: ${summary}`)}`);
    }
    const parsedPhone = (phone[0] === '+' ? '+' : '') + phone.slice(1).replace(/[^0-9]/g, '');
    console.log(`querying yelp api with phone: ${parsedPhone}`);
    const description = summary ? [summary] : [];
    const yelpAPIInput = {
        phone: parsedPhone,
        location,
        placeValidationInfo: {
            name,
            address,
            ...(description.length > 0 && { description }),
        },
    };
    return yelpAPIInput;
}
exports.getYelpAPIInput = getYelpAPIInput;
async function getYelpAPIData({ phone, location, placeValidationInfo }) {
    const yelpBusinesses = (await findYelpBusinessesByPhoneNumber({
        phone,
        location,
    }));
    const numberOfBusinessesFound = yelpBusinesses.length;
    if (numberOfBusinessesFound === 0) {
        throw new Error(`No yelp businesses found for phone: ${phone}.`);
    }
    if (numberOfBusinessesFound === 1) {
        return yelpBusinesses[0];
    }
    else {
        const selectableYelpBusinesses = yelpBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            alias: business.alias,
            categories: business.categories,
            review_count: business.review_count,
            ...(business.location.display_address && {
                address: business.location.display_address.join(',') ?? business.location.address1,
            }),
        }));
        const selectableYelpBusinessIds = selectableYelpBusinesses.map((business) => business.id);
        const enumValuesForArgument = ['NONE', ...selectableYelpBusinessIds];
        // construct a formatted string consisting of name, address, and description
        const googlePlaceInfo = `name: ${placeValidationInfo.name}, address: ${placeValidationInfo.address}${placeValidationInfo.description ? `, description: ${placeValidationInfo.description}` : ''}`;
        const yelpBusinessesInfo = selectableYelpBusinesses.map((business, businessIndex) => `Candidate ${businessIndex + 1}: Yelp business id: ${business.id}, name: ${business.name}${business.address ? `, address: ${business.address}` : ''}${business.categories?.length ? `, categories: ${business.categories.map((category) => category.title)}` : ''}${business.alias ? `, alias: ${business.alias}` : ''}${business.review_count ? `, review count: ${business.review_count}` : ''}.`);
        const messages = (0, findMatchingYelpBusiness_1.findMatchingYelpBusiness)(googlePlaceInfo, yelpBusinessesInfo.join('\n'));
        console.log(`find matching yelp business messages: ${JSON.stringify(messages, null, 2)}`);
        const functions = (0, findMatchingYelpBusiness_1.getMatchingYelpBusinessIdFunctions)(enumValuesForArgument);
        const openAIChatInput = {
            messages,
            functions,
            temperature: 0,
            model: constants_1.CHAT_MODELS.NEW_GPT_4,
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
        };
        const selectableYelpBusinessNames = selectableYelpBusinesses.map((business) => `${business.name}, ${business.address}`);
        console.log(`\nQuerying openAI with these possible values to choose from: ${selectableYelpBusinessNames}\n`);
        const response = await (0, askOpenAIChat_1.askOpenAIChat)(openAIChatInput);
        const { businessMatch } = response;
        console.log(`openai responds with selected business: ${businessMatch}`);
        // check if the businessMatch is within enumValuesForArgument
        if (enumValuesForArgument.includes(businessMatch)) {
            // check if the businessMatch is NONE
            if (businessMatch !== 'NONE') {
                // if not NONE, then we have a match
                const matchingYelpBusiness = yelpBusinesses.find((business) => business.id === businessMatch);
                if (!matchingYelpBusiness) {
                    throw new Error(`No matching yelp business found for businessMatch: ${businessMatch}`);
                }
                return matchingYelpBusiness;
            }
        }
        else {
            throw new Error(`openAI response is not a valid businessMatch: ${businessMatch}`);
        }
        throw new Error(`No matching yelp business found for phone: ${phone}.`);
    }
}
exports.getYelpAPIData = getYelpAPIData;
