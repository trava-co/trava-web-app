"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_1 = require("shared-types/API");
const scrapeWebData_1 = require("./utils/scrapeWebData");
const updateCardWithAI_1 = require("./utils/updateCardWithAI");
const askOnlineLLMToClassifyLogistics_1 = require("./utils/askOnlineLLMToClassifyLogistics");
const updateAttraction_1 = require("./utils/updateAttraction");
const updateGooglePlace_1 = require("./utils/updateGooglePlace");
const constants_1 = require("./utils/constants");
const getDestinationNearbyAttraction_1 = require("./utils/getDestinationNearbyAttraction");
const updateAttraction_2 = require("./utils/updateAttraction");
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const handler = async (event) => {
    ApiClient_1.default.get().useIamAuth();
    const { attractionId } = event.arguments;
    console.log(`starting generateAttractionDetails for attraction id ${attractionId}`);
    let attraction = null;
    try {
        // attempt to update attraction status to IN_PROGRESS. If fails, log error and return false.
        // don't want to throw error & set FAILED status just because another fn is currently processing this attraction
        attraction = await (0, updateAttraction_2.updateAttractionStatusToInProgress)({ attractionId });
    }
    catch (error) {
        console.error(`Attraction ${attractionId} is not in the GET_DETAILS step or status is not PENDING. Error: ${error?.message}`);
        if (error.code === 'TransactionCanceledException') {
            console.error(`Cancellation reasons: ${JSON.stringify(error.CancellationReasons)}`);
        }
        return false;
    }
    try {
        console.log(`attraction: ${JSON.stringify(attraction, null, 2)}`);
        // if attraction does not exist, return
        if (!attraction?.generation) {
            // should never happen because of updateAttractionStatusToInProgress transaction, but just in case/to help ts
            throw new Error(`attraction ${attractionId} does not exist, or does not have a generation field`);
        }
        const attractionFirstLocation = attraction.locations?.[0];
        if (!attractionFirstLocation) {
            throw new Error(`attraction ${attractionId} does not have a location`);
        }
        const { googlePlace } = attractionFirstLocation.startLoc;
        console.log('Getting details for attraction');
        // we must perform logic to generate single card
        // step 0: if destinationId is other, then getDestinationNearbyAttraction
        let destinationId = attraction.destinationId;
        console.log(`destinationId: ${destinationId}. is other: ${destinationId === constants_1.OTHER_DESTINATION_ID}`);
        console.log(`googlePlace.data.city: ${googlePlace.data.city}`);
        if (destinationId === constants_1.OTHER_DESTINATION_ID && googlePlace.data.city) {
            console.log(`getting destination id`);
            // get destinationId
            destinationId = await (0, getDestinationNearbyAttraction_1.getDestinationNearbyAttraction)({
                attractionCoords: {
                    lat: googlePlace.data.coords.lat,
                    long: googlePlace.data.coords.long,
                },
                city: googlePlace.data.city,
                ...(googlePlace.data.state && { state: googlePlace.data.state }),
                ...(googlePlace.data.country && { country: googlePlace.data.country }),
                ...(googlePlace.data.continent && { continent: googlePlace.data.continent }),
            });
            console.log(`updated destinationId: ${destinationId}`);
        }
        // step 0: if type DO, start request to onlineLLM
        let onlineLLMDescriptionPromise = null;
        if (attraction.type === API_1.ATTRACTION_TYPE.DO) {
            console.log(`\n\n\n Now calling askOnlineLLMToClassifyLogistics \n\n\n`);
            onlineLLMDescriptionPromise = (0, askOnlineLLMToClassifyLogistics_1.askOnlineLLMToClassifyLogistics)({
                attractionName: attraction.name,
                destinationName: googlePlace.data.city ?? '',
            });
        }
        // step 1: assemble input for scraping web data
        const placeData = {
            phone: googlePlace.data.phone,
            location: {
                lat: googlePlace.data.coords.lat,
                lng: googlePlace.data.coords.long,
            },
            name: googlePlace.data.name,
            address: googlePlace.data.formattedAddress,
            summary: googlePlace.data.editorialSummary,
        };
        const inputForWebScraping = {
            attractionId: attraction.id,
            attractionType: attraction.type,
            googlePlaceId: googlePlace.id,
            placeData,
        };
        let googleWebData = null;
        let yelpWebData = null;
        console.log(`beginning to scrape web data`);
        // step 2: call scrapeWebData
        const scrapeResult = await (0, scrapeWebData_1.scrapeWebData)(inputForWebScraping);
        googleWebData = scrapeResult.googleWebData;
        yelpWebData = scrapeResult.yelpWebData;
        if (!googleWebData) {
            throw new Error('googleWebData is null');
        }
        // step 3: prepare the input for generate card request
        // use whichever review source has more reviews
        const validScrapedReviews = googleWebData.scrapedReviews
            ?.map((review) => review?.text)
            ?.filter((review) => Boolean(review));
        const validGooglePlaceReviews = googlePlace.data.reviews
            ?.map((review) => review?.text)
            ?.filter((review) => Boolean(review));
        const reviews = (validScrapedReviews?.length ?? 0) > (validGooglePlaceReviews?.length ?? 0)
            ? validScrapedReviews
            : validGooglePlaceReviews;
        const updateCardWithAIInput = {
            name: attraction.name,
            attractionId: attraction.id,
            travaDestinationId: destinationId,
            attractionType: attraction.type,
            authorType: attraction.authorType,
            destinationName: googlePlace.data.city ?? '',
            hours: googlePlace.data.hours,
            editorialSummary: googlePlace.data.editorialSummary ?? '',
            reservable: googlePlace.data.reservable ?? false,
            reviews,
            mealServices: googlePlace.data.mealServices,
            price: googlePlace.data.price ?? yelpWebData?.price,
            categories: yelpWebData?.categories?.filter((category) => Boolean(category)),
            bestVisitedByPopularTimes: googleWebData?.placeWebData?.bestVisitedByPopularTimes?.filter((time) => Boolean(time)),
            aboutBusiness: googleWebData?.placeWebData?.aboutBusiness,
            yelpAmenities: yelpWebData?.amenities?.filter((amenity) => Boolean(amenity)),
            generateLogistics: attraction.type === API_1.ATTRACTION_TYPE.EAT,
        };
        // step 4: call updateCardWithAI
        const updateCardWithAIResponse = await (0, updateCardWithAI_1.updateCardWithAI)(updateCardWithAIInput);
        // assemble input for updateGooglePlace, which applies to both eat and do
        const updateGooglePlaceInput = {
            id: googlePlace.id,
            generatedSummary: updateCardWithAIResponse.generatedSummary,
            webData: {
                menuLink: googleWebData.placeWebData?.menuLink,
                popularTimes: googleWebData.placeWebData?.popularTimes,
                bestVisitedByPopularTimes: googleWebData.placeWebData?.bestVisitedByPopularTimes,
                aboutBusiness: googleWebData.placeWebData?.aboutBusiness,
                reviews: googleWebData.scrapedReviews,
            },
            yelpData: {
                id: yelpWebData?.id,
                url: yelpWebData?.url,
                amenities: yelpWebData?.amenities,
                price: yelpWebData?.price,
                categories: yelpWebData?.categories,
            },
        };
        console.log(`updateGooglePlaceInput: ${JSON.stringify(updateGooglePlaceInput, null, 2)}`);
        // step 5: if type eat, then update attraction and googlePlace and return
        if (attraction.type === API_1.ATTRACTION_TYPE.EAT) {
            const updateAttractionInput = {
                id: attraction.id,
                attractionCuisine: updateCardWithAIResponse.attraction.attractionCuisine,
                attractionTargetGroups: updateCardWithAIResponse.attraction.attractionTargetGroups,
                destinationId,
                descriptionLong: updateCardWithAIResponse.attraction.descriptionLong,
                descriptionShort: updateCardWithAIResponse.attraction.descriptionShort,
                cost: updateCardWithAIResponse.attraction.cost,
                bestVisited: updateCardWithAIResponse.attraction.bestVisited,
                duration: updateCardWithAIResponse.attraction.duration,
                reservation: updateCardWithAIResponse.attraction.reservation,
                seasons: updateCardWithAIResponse.attraction.seasons,
                generation: {
                    step: API_1.GenerationStep.GET_DETAILS,
                    status: API_1.Status.SUCCEEDED,
                    failureCount: 0,
                    lastUpdatedAt: new Date().toISOString(),
                },
            };
            console.log(`updateAttractionInput: ${JSON.stringify(updateAttractionInput, null, 2)}`);
            // update attraction
            const updateAttractionPromise = (0, updateAttraction_1.updateAttraction)({
                input: updateAttractionInput,
            });
            const updateGooglePlacePromise = (0, updateGooglePlace_1.updateGooglePlace)({
                input: updateGooglePlaceInput,
            });
            await Promise.all([updateAttractionPromise, updateGooglePlacePromise]);
            // if type eat, we're done
            return;
        }
        // else, type do
        // parse response, ask onlineLLM, and then invoke the function again with generateLogistics = true
        // step 6: await onlineLLMDescriptionPromise
        const onlineLLMDescription = onlineLLMDescriptionPromise ? await onlineLLMDescriptionPromise : undefined;
        if (!onlineLLMDescription) {
            // should never happen because askOnlineLLMToClassifyLogistics throws an error if onlineLLMDescription is null, but just in case
            throw new Error('generateAttractionDetails: onlineLLMDescription is null');
        }
        // step 7: call updateCardWithAI again, this time with generateLogistics = true
        const secondPassToGetLogisticsForTypeDo = await (0, updateCardWithAI_1.updateCardWithAI)({
            ...updateCardWithAIInput,
            existingTravaDescriptions: {
                existingDescriptionShort: updateCardWithAIResponse.attraction.descriptionShort,
                existingDescriptionLong: updateCardWithAIResponse.attraction.descriptionLong,
            },
            generateLogistics: true,
            onlineLLMDescription,
        });
        console.log(`Finished second pass to get logistics for type DO. Now, updating attraction and googlePlace`);
        const updateAttractionInput = {
            id: attraction.id,
            attractionCategories: secondPassToGetLogisticsForTypeDo.attraction.attractionCategories,
            attractionTargetGroups: secondPassToGetLogisticsForTypeDo.attraction.attractionTargetGroups,
            destinationId,
            descriptionLong: secondPassToGetLogisticsForTypeDo.attraction.descriptionLong,
            descriptionShort: secondPassToGetLogisticsForTypeDo.attraction.descriptionShort,
            cost: secondPassToGetLogisticsForTypeDo.attraction.cost,
            bestVisited: secondPassToGetLogisticsForTypeDo.attraction.bestVisited,
            duration: secondPassToGetLogisticsForTypeDo.attraction.duration,
            reservation: secondPassToGetLogisticsForTypeDo.attraction.reservation,
            seasons: secondPassToGetLogisticsForTypeDo.attraction.seasons,
            generation: {
                step: API_1.GenerationStep.GET_DETAILS,
                status: API_1.Status.SUCCEEDED,
                failureCount: 0,
                lastUpdatedAt: new Date().toISOString(),
            },
        };
        console.log(`updateAttractionInput: ${JSON.stringify(updateAttractionInput, null, 2)}`);
        // step 8: update attraction
        const updateAttractionPromise = (0, updateAttraction_1.updateAttraction)({
            input: updateAttractionInput,
        });
        const updateGooglePlacePromise = (0, updateGooglePlace_1.updateGooglePlace)({
            input: updateGooglePlaceInput,
        });
        await Promise.all([updateAttractionPromise, updateGooglePlacePromise]);
        return true;
    }
    catch (error) {
        // if there was a failure while getting details, update the attraction with the failure
        await (0, updateAttraction_1.updateAttractionWithFailure)({
            attractionId,
            failureCount: attraction?.generation?.failureCount ?? undefined,
            step: API_1.GenerationStep.GET_DETAILS,
            errorMessage: error?.message,
        }).catch((error) => console.error(error));
        return false;
    }
};
exports.handler = handler;
