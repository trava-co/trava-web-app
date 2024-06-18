"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesChatThread = exports.possibleCategories = void 0;
const API_1 = require("shared-types/API");
exports.possibleCategories = {
    [API_1.ATTRACTION_TYPE.DO]: API_1.ATTRACTION_CATEGORY_TYPE,
    [API_1.ATTRACTION_TYPE.EAT]: API_1.ATTRACTION_CUISINE_TYPE,
};
// removed "Only use the functions you have been provided with.", since we're force-calling
const getCategoriesChatThread = (attractionName, destinationName, attractionType, attractionDescription) => {
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Provided an attraction, select one or two categories that best describe it, using any research provided to you and if insufficient, falling back to your own knowledge. Respond with an array consisting of one or two of these elements: ${Object.values(exports.possibleCategories[attractionType]).join(',')}. Order your selection(s) by best, first.`,
            },
            {
                role: 'user',
                content: `For the attraction Dip into the Barton Springs Pool in Austin, select one or two of the following categories that best describe it.`,
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_CATEGORY_TYPE.NATURE},${API_1.ATTRACTION_CATEGORY_TYPE.LEISURE}]`,
            },
            {
                role: 'user',
                content: `For the attraction Watch A Red Sox Game at Fenway Park in Boston, select one or two of the following categories that best describe it.`,
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_CATEGORY_TYPE.ENTERTAINMENT}]`,
            },
            {
                role: 'user',
                content: `For the attraction ${attractionName} in ${destinationName}, select one or two of the following categories that best describe it. Order your selection(s) by best, first. Use this research:${attractionDescription}.`,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Provided a restaurant, select a maximum of three cuisine types that best describe the food served, using any research provided to you and if insufficient, falling back to your own knowledge. Respond with an array consisting of up to three of these elements: ${Object.values(exports.possibleCategories[attractionType]).join(',')}. Order your selection(s) by best, first.`,
            },
            {
                role: 'user',
                content: "For the restaurant Lou Malnati's in Chicago, select a maximum of three cuisine types that best describe the food served.",
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_CUISINE_TYPE.PIZZA}]`,
            },
            {
                role: 'user',
                content: 'For the restaurant Odd Duck in Austin, select a maximum of three cuisine types that best describe the food served.',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_CUISINE_TYPE.AMERICAN_NEW},${API_1.ATTRACTION_CUISINE_TYPE.TAPAS_AND_SMALL_PLATES}]`,
            },
            {
                role: 'user',
                content: `For the restaurant ${attractionName} in ${destinationName}, select a maximum of three cuisine types that best describe the food served. Order your selection(s) by best, first. Use this research:${attractionDescription}.`,
            },
        ];
        return EAT;
    }
};
exports.getCategoriesChatThread = getCategoriesChatThread;
