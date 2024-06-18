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
const VIATOR_API_KEY = '9bc9975d-577a-4016-84e2-e5d7055ed6fd';
const getViatorProductDetails = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { url } = event.arguments;
    if (!url) {
        throw new Error('URL is required');
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
        console.log(`productResponse: ${JSON.stringify(productResponse.data, null, 2)}`);
        console.log(`pricingResponse: ${JSON.stringify(pricingResponse.data, null, 2)}`);
        const { data: productData } = productResponse;
        const { data: pricingData } = pricingResponse;
        const fixedDuration = (_a = productData.itinerary.duration) === null || _a === void 0 ? void 0 : _a.fixedDurationInMinutes;
        const variableDurationFrom = (_b = productData.itinerary.duration) === null || _b === void 0 ? void 0 : _b.variableDurationFromMinutes;
        const variableDurationTo = (_c = productData.itinerary.duration) === null || _c === void 0 ? void 0 : _c.variableDurationToMinutes;
        const duration = fixedDuration
            ? `${fixedDuration} minutes`
            : `${variableDurationFrom}-${variableDurationTo} minutes`;
        // Extract the required fields from the matchingProduct
        const responseObject = {
            __typename: 'GetViatorProductDetailsResponse',
            title: productData.title,
            rating: {
                __typename: 'ViatorRating',
                totalReviews: productData.reviews.totalReviews,
                combinedAverageRating: parseFloat(productData.reviews.combinedAverageRating.toFixed(1)),
            },
            image: productData.images[0].variants.find((variant) => variant.url).url,
            duration,
            pricing: pricingData.summary.fromPrice,
            currency: pricingData.currency,
        };
        console.log(`responseObject: ${JSON.stringify(responseObject, null, 2)}`);
        return responseObject;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to get Viator product details');
    }
});
exports.default = getViatorProductDetails;
