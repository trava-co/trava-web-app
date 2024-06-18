"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCardWithAI = void 0;
const API_1 = require("shared-types/API");
const getTravaCategories_1 = require("./trava/getTravaCategories");
const getTravaCost_1 = require("./trava/getTravaCost");
const getTravaBestVisited_1 = require("./trava/getTravaBestVisited");
const getMostRelevantSentences_1 = require("./getMostRelevantSentences");
const getTravaReservations_1 = require("./trava/getTravaReservations");
const getTravaDuration_1 = require("./trava/getTravaDuration");
const getTravaTargetGroups_1 = require("./trava/getTravaTargetGroups");
const generateTravaDescriptions_1 = require("./trava/generateTravaDescriptions");
const logError_1 = require("./logError");
const TravaCardCreationErrors = __importStar(require("./TravaCardCreationErrors"));
const infoItemToString_1 = require("./infoItemToString");
const getLogisticsForTypeDoFromBing_1 = require("./trava/getLogisticsForTypeDoFromBing");
let commonCardFields = {
    costType: API_1.ATTRACTION_COST_TYPE.PERSON,
    costCurrency: API_1.CURRENCY_TYPE.USD,
    isTravaCreated: 1,
    privacy: API_1.ATTRACTION_PRIVACY.PUBLIC,
    bucketListCount: 0,
};
const now = new Date().toISOString();
async function updateCardWithAI(cardInput) {
    const { name, attractionId, travaDestinationId, attractionType, destinationName, hours, editorialSummary, reservable, reviews, mealServices, price, categories, duration, descriptions, existingTravaDescriptions, bingDescription, recommendationBadges, generateLogistics, bestVisitedByPopularTimes, aboutBusiness, yelpAmenities, authorType, } = cardInput;
    const isTypeDo = attractionType === API_1.ATTRACTION_TYPE.DO;
    const isTypeEat = attractionType === API_1.ATTRACTION_TYPE.EAT;
    const { existingDescriptionShort, existingDescriptionLong } = existingTravaDescriptions || {};
    let travaAttraction = {
        ...commonCardFields,
        id: attractionId,
        name,
        type: attractionType,
        destinationId: travaDestinationId,
        recommendationBadges,
        descriptionShort: existingDescriptionShort ?? '',
        descriptionLong: existingDescriptionLong ?? '',
        bestVisited: null,
        createdAt: now,
        updatedAt: now,
        seasons: [
            {
                startMonth: 0,
                startDay: 0,
                endMonth: 11,
                endDay: 30,
            },
        ],
        authorType,
        label: API_1.AttractionLabel.ATTRACTION,
    };
    let generatedSummary = ''; // to be populated with input to gpt-4's description generation
    const travaDescriptionsExist = travaAttraction.descriptionShort && travaAttraction.descriptionLong;
    // if type DO, and generateLogistics is true, we only need to generate logistics, which require bingDescription
    if (isTypeDo) {
        if (generateLogistics && !bingDescription) {
            throw new TravaCardCreationErrors.TravaDoAttractionMissingBingInfoError({
                attractionId,
                attractionName: name,
                destinationName,
                message: `Trava DO attraction is missing bingDescription`,
            });
        }
        else if (!generateLogistics && travaDescriptionsExist) {
            throw new TravaCardCreationErrors.TravaDoAttractionAlreadyHasDescriptionsError({
                attractionId,
                attractionName: name,
                destinationName,
                message: `Trava DO attraction already has descriptions; next step is to generate logistics`,
            });
        }
    }
    // if google reviews don't exist, throw error
    if (!reviews || reviews.length === 0) {
        throw new TravaCardCreationErrors.TravaAttractionMissingGoogleReviewsError({
            attractionId,
            attractionName: name,
            destinationName,
            message: `Trava attraction is missing google reviews`,
        });
    }
    const { amenities, atmosphere, crowd, planning } = aboutBusiness || {};
    const aboutDetails = [
        (0, infoItemToString_1.infoItemsToString)(amenities, 'Amenities'),
        (0, infoItemToString_1.infoItemsToString)(atmosphere, 'Atmosphere'),
        (0, infoItemToString_1.infoItemsToString)(crowd, 'Crowd'),
        (0, infoItemToString_1.infoItemsToString)(planning, 'Planning'),
    ].filter(Boolean);
    // Join the aboutDetails into a single string with periods in between.
    const aboutDetailsString = aboutDetails.join('. ');
    // chunks of potentially relevant text to include as input to openai request
    const allSegments = [
        aboutDetailsString,
        ...(reviews ?? []),
        ...(descriptions ?? []),
        bingDescription,
    ].filter((item) => Boolean(item));
    const relevanceMap = await (0, getMostRelevantSentences_1.getSentenceRelevanceMap)({
        segments: allSegments,
        attractionId,
        attractionName: name,
        destinationName,
        attractionType,
    });
    console.log('got relevanceMap');
    const currentInputForSummary = editorialSummary ? editorialSummary : '';
    if (!travaDescriptionsExist) {
        // if trava descriptions don't exist, generate them
        try {
            const response = await (0, generateTravaDescriptions_1.generateTravaDescriptions)({
                attractionId,
                attractionName: name,
                destinationName,
                attractionType,
                currentInputForSummary, // definitely want to include (e.g. editorial overview)
                relevanceMap,
            });
            console.log('got generated descriptions');
            travaAttraction = {
                ...travaAttraction,
                descriptionShort: response.descriptionShort,
                descriptionLong: response.descriptionLong,
            };
            generatedSummary = response.inputToSummary;
        }
        catch (error) {
            await (0, logError_1.logError)({
                error: error,
                context: `generateTravaDescriptions for ${name} in ${destinationName}`,
                shouldThrow: true,
            });
        }
    }
    if (isTypeDo) {
        // must rely on bingDescription for logistics
        if (generateLogistics) {
            try {
                console.log('updateCardWithAI second pass for type do: using bing response to get logistics from openai');
                const { attractionCategories, reservation, attractionTargetGroups } = await (0, getLogisticsForTypeDoFromBing_1.getLogisticsForTypeDoFromBing)({
                    attractionId,
                    attractionName: name,
                    destinationName,
                    bingDescription: bingDescription, // must be defined because generateLogistics is true
                });
                travaAttraction = {
                    ...travaAttraction,
                    attractionCategories,
                    reservation,
                    attractionTargetGroups,
                };
            }
            catch (error) {
                await (0, logError_1.logError)({
                    error: error,
                    context: `getLogisticsForTypeDoFromBing for ${name} in ${destinationName}`,
                    shouldThrow: true,
                });
            }
        }
        else {
            // if bingDescription doesn't exist, return travaAttraction with trava descriptions & w/o logistics. Generate bingDescription with trava descriptions, then re-invoke this fn with bingDescription
            return {
                attraction: travaAttraction,
                generatedSummary,
            };
        }
    }
    // categories, reservations, targetGroups may already exist from bingDescription
    if ((isTypeDo && !travaAttraction.attractionCategories?.length) ||
        (isTypeEat && !travaAttraction.attractionCuisine?.length)) {
        try {
            const travaCategories = await (0, getTravaCategories_1.getTravaCategories)({
                attractionId,
                attractionName: name,
                destinationName,
                recommendationSourceCategories: categories,
                attractionType,
                relevanceMap,
            });
            if (isTypeDo) {
                travaAttraction = {
                    ...travaAttraction,
                    attractionCategories: travaCategories,
                };
            }
            else if (isTypeEat) {
                travaAttraction = {
                    ...travaAttraction,
                    attractionCuisine: travaCategories,
                };
            }
        }
        catch (error) {
            await (0, logError_1.logError)({
                error: error,
                context: `getTravaCategories for ${name} in ${destinationName}`,
                shouldThrow: true,
            });
        }
    }
    else {
        console.log('Skipping getTravaCategories because categories already exist');
    }
    const mealsServed = {
        breakfast: mealServices?.servesBreakfast,
        brunch: mealServices?.servesBrunch,
        lunch: mealServices?.servesLunch,
        dinner: mealServices?.servesDinner,
    };
    try {
        const travaBestVisited = await (0, getTravaBestVisited_1.getTravaBestVisited)({
            attractionId,
            attractionName: name,
            attractionType,
            relevanceMap,
            hours,
            destinationName,
            bestVisitedByPopularTimes,
            mealsServed,
            travaCuisines: travaAttraction.attractionCuisine,
        });
        console.log(`travaBestVisited: ${JSON.stringify(travaBestVisited, null, 2)}`);
        travaAttraction = {
            ...travaAttraction,
            bestVisited: travaBestVisited,
        };
    }
    catch (error) {
        await (0, logError_1.logError)({
            error: error,
            context: `getTravaBestVisited for ${name} in ${destinationName}`,
            shouldThrow: true,
        });
    }
    try {
        const travaDuration = await (0, getTravaDuration_1.getTravaDuration)({
            attractionId,
            attractionName: name,
            destinationName,
            attractionType,
            relevanceMap,
            travaBestVisited: travaAttraction.bestVisited,
            recSourceDuration: duration,
        });
        travaAttraction = {
            ...travaAttraction,
            duration: travaDuration,
        };
    }
    catch (error) {
        await (0, logError_1.logError)({
            error: error,
            context: `getTravaDuration for ${name} in ${destinationName}`,
            shouldThrow: true,
        });
    }
    if (!travaAttraction.cost) {
        try {
            const travaCost = await (0, getTravaCost_1.getTravaCost)({
                attractionId,
                attractionName: name,
                destinationName,
                recSourcePrice: price,
                attractionType,
                relevanceMap,
                bingDescription,
            });
            travaAttraction = {
                ...travaAttraction,
                cost: travaCost,
            };
        }
        catch (error) {
            await (0, logError_1.logError)({
                error: error,
                context: `getTravaCost for ${name} in ${destinationName}`,
                shouldThrow: true,
            });
        }
    }
    else {
        console.log('Skipping getTravaCost because cost already exists');
    }
    if (!travaAttraction.reservation) {
        try {
            const travaReservation = await (0, getTravaReservations_1.getTravaReservations)({
                attractionId,
                attractionName: name,
                destinationName,
                relevanceMap,
                attractionType,
                reservable: Boolean(reservable), // google maps returns this boolean
                planning: planning?.filter((item) => Boolean(item)),
            });
            travaAttraction = {
                ...travaAttraction,
                reservation: travaReservation,
            };
        }
        catch (error) {
            await (0, logError_1.logError)({
                error: error,
                context: `getTravaReservations for ${name} in ${destinationName}`,
                shouldThrow: true,
            });
        }
    }
    else {
        console.log('Skipping getTravaReservations because reservation already exists');
    }
    if (!travaAttraction.attractionTargetGroups?.length) {
        try {
            const travaTargetGroup = await (0, getTravaTargetGroups_1.getTravaTargetGroups)({
                attractionId,
                attractionName: name,
                attractionType,
                relevanceMap,
                destinationName,
                yelpAmenities,
                aboutBusiness,
                servesVegetarianFood: mealServices?.servesVegetarianFood,
            });
            travaAttraction = {
                ...travaAttraction,
                attractionTargetGroups: travaTargetGroup,
            };
        }
        catch (error) {
            await (0, logError_1.logError)({
                error: error,
                context: `getTravaTargetGroups for ${name} in ${destinationName}`,
                shouldThrow: true,
            });
        }
    }
    else {
        console.log('Skipping getTravaTargetGroups because targetGroups already exist');
    }
    return {
        attraction: travaAttraction,
        generatedSummary,
    };
}
exports.updateCardWithAI = updateCardWithAI;
