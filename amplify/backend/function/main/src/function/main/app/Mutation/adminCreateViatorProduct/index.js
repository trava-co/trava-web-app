"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const mutations_1 = require("shared-types/graphql/mutations");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const VIATOR_API_KEY = '9bc9975d-577a-4016-84e2-e5d7055ed6fd';
const adminCreateViatorProduct = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    console.log(`starting adminCreateViatorProduct:`);
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CREATE_VIATOR_PRODUCT_NOT_AUTHORIZED);
    }
    if (!('claims' in event.identity &&
        'cognito:groups' in event.identity.claims &&
        event.identity.claims['cognito:groups'].includes('admin'))) {
        throw new Error(lambdaErrors_1.CREATE_VIATOR_PRODUCT_NOT_AUTHORIZED);
    }
    const { id, url, attractionId, displayOrder } = event.arguments.input;
    // shouldn't happen but just in case
    if (!id || !url || !attractionId || !displayOrder) {
        throw new Error('Invalid input');
    }
    try {
        // 1. Parse the productCode from the slug
        const productCodeMatch = url.match(/tours\/[^/]+\/[^/]+\/d\d+-([^/?]+)/);
        if (!productCodeMatch) {
            throw new Error('Invalid Viator link format');
        }
        const productCode = productCodeMatch[1];
        console.log(`productCode: ${productCode}`);
        const headers = {
            'exp-api-key': VIATOR_API_KEY,
            'Accept-Language': 'en-US',
            Accept: 'application/json;version=2.0',
            'Content-Type': 'application/json;version=2.0',
        };
        // 2. Query the products endpoint with the productCode
        const productResponsePromise = axios_1.default.get(`https://api.viator.com/partner/products/${productCode}`, {
            headers,
        });
        // Query the pricing endpoint with the productCode
        const pricingResponsePromise = axios_1.default.get(`https://api.viator.com/partner/availability/schedules/${productCode}`, {
            headers,
        });
        const [productResponse, pricingResponse] = yield Promise.all([productResponsePromise, pricingResponsePromise]);
        console.log(`productResponse exists: ${!!productResponse}`);
        console.log(`pricingResponse exists: ${!!pricingResponse}`);
        const { data: productData } = productResponse;
        const { data: pricingData } = pricingResponse;
        // 3. Begin constructing the input for the createViatorProduct mutation
        // 3a. Price Details
        const fromPrice = (_a = pricingData.summary) === null || _a === void 0 ? void 0 : _a.fromPrice;
        const currency = pricingData.currency;
        // if either are null, throw error
        if (!fromPrice || !currency) {
            throw new Error('No pricing data found');
        }
        // pricing looks like this: 150.00, currency looks like this: USD
        // use currencyDictionary to display the currency symbol and format the price. if not found, just display the currency and price
        const priceText = currencyDictionary[currency]
            ? `${currencyDictionary[currency]}${fromPrice}`
            : `${fromPrice} ${currency}`;
        // 3b. Rating Details
        const rating = {
            score: parseFloat(productData.reviews.combinedAverageRating.toFixed(1)),
            count: productData.reviews.totalReviews,
        };
        if (!rating.score || !rating.count) {
            throw new Error('No rating data found');
        }
        // 3c. Image Details
        // get the first image with height over 200 and width over 300. If none, cut in half and try again
        // if still none, get the first image
        const findVariantWithAspectRatio = (minHeight, minWidth) => {
            const targetRatio = 2 / 3;
            const tolerance = 0.01; // Adjust tolerance as needed
            for (const image of productData.images) {
                const variant = image.variants.find((v) => {
                    const aspectRatio = v.height / v.width;
                    const ratioDifference = Math.abs(aspectRatio - targetRatio);
                    return ratioDifference <= tolerance && v.height > minHeight && v.width > minWidth;
                });
                if (variant) {
                    return variant;
                }
            }
            return null;
        };
        const variant = findVariantWithAspectRatio(200, 300) ||
            findVariantWithAspectRatio(100, 150) ||
            (productData.images[0].variants ? productData.images[0].variants[0] : null);
        console.log(`variant: ${JSON.stringify(variant, null, 2)}`);
        if (!(variant === null || variant === void 0 ? void 0 : variant.url)) {
            throw new Error('No image found');
        }
        // 3d. Duration Details
        const fixedDuration = (_b = productData.itinerary.duration) === null || _b === void 0 ? void 0 : _b.fixedDurationInMinutes;
        const variableDurationFrom = (_c = productData.itinerary.duration) === null || _c === void 0 ? void 0 : _c.variableDurationFromMinutes;
        const variableDurationTo = (_d = productData.itinerary.duration) === null || _d === void 0 ? void 0 : _d.variableDurationToMinutes;
        const duration = fixedDuration
            ? `${fixedDuration} minutes`
            : `${variableDurationFrom}-${variableDurationTo} minutes`;
        // Extract the required fields from the matchingProduct
        const input = {
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
        };
        console.log(`input: ${JSON.stringify(input, null, 2)}`);
        // 4. Call the createViatorProduct mutation
        const result = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateCreateViatorProduct,
            variables: {
                input,
            },
        });
        console.log(`result: ${JSON.stringify(result, null, 2)}`);
        return (_e = result.data) === null || _e === void 0 ? void 0 : _e.privateCreateViatorProduct;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to get Viator product details');
    }
});
const currencyDictionary = {
    AUD: 'A$',
    BRL: 'R$',
    CAD: 'CA$',
    CHF: 'CHF',
    DKK: 'kr.',
    EUR: '€',
    GBP: '£',
    HKD: 'HK$',
    INR: '₹',
    JPY: '¥',
    NOK: 'kr',
    NZD: 'NZ$',
    SEK: 'kr',
    SGD: 'S$',
    TWD: 'NT$',
    USD: '$',
    ZAR: 'R', // South African Rand
};
exports.default = adminCreateViatorProduct;
