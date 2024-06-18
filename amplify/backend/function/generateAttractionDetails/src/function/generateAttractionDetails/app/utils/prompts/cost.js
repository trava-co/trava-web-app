"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCostChatThread = exports.possibleCosts = void 0;
const API_1 = require("shared-types/API");
exports.possibleCosts = {
    [API_1.ATTRACTION_TYPE.DO]: {
        [API_1.ATTRACTION_COST.FREE]: API_1.ATTRACTION_COST.FREE,
        [API_1.ATTRACTION_COST.UNDER_TWENTY_FIVE]: API_1.ATTRACTION_COST.UNDER_TWENTY_FIVE,
        [API_1.ATTRACTION_COST.TWENTY_FIVE_TO_FIFTY]: API_1.ATTRACTION_COST.TWENTY_FIVE_TO_FIFTY,
        [API_1.ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE]: API_1.ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE,
        [API_1.ATTRACTION_COST.OVER_SEVENTY_FIVE]: API_1.ATTRACTION_COST.OVER_SEVENTY_FIVE,
    },
    [API_1.ATTRACTION_TYPE.EAT]: {
        [API_1.ATTRACTION_COST.UNDER_TEN]: API_1.ATTRACTION_COST.UNDER_TEN,
        [API_1.ATTRACTION_COST.TEN_TO_THIRTY]: API_1.ATTRACTION_COST.TEN_TO_THIRTY,
        [API_1.ATTRACTION_COST.THIRTY_TO_SIXTY]: API_1.ATTRACTION_COST.THIRTY_TO_SIXTY,
        [API_1.ATTRACTION_COST.OVER_SIXTY]: API_1.ATTRACTION_COST.OVER_SIXTY,
    },
};
const getCostChatThread = (attractionName, destinationName, attractionType, attractionDescription) => {
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Provided an attraction, estimate the average cost per person, selecting exactly one of these cost options: ${Object.values(exports.possibleCosts[attractionType]).join(',')}. Use your own knowledge and any information provided.`,
            },
            {
                role: 'user',
                content: `For the attraction Dip into the Barton Springs Pool in Austin, estimate the average cost per person. Use your preexisting knowledge on the attraction.`,
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_COST.UNDER_TWENTY_FIVE,
            },
            {
                role: 'user',
                content: `For the attraction Watch A Red Sox Game at Fenway Park in Boston, estimate the average cost per person. Use your preexisting knowledge on the attraction.`,
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_COST.FIFTY_TO_SEVENTY_FIVE,
            },
            {
                role: 'user',
                content: `For the attraction ${attractionName} in ${destinationName}, estimate the average cost per person. Use your preexisting knowledge on the attraction, avoiding hallucination at all costs. You should also use the following information I've gathered:${attractionDescription}.`,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Provided a restaurant, estimate the average cost per person, selecting exactly one of these cost options: ${Object.values(exports.possibleCosts[attractionType]).join(',')}. Use your own knowledge and any information provided.`,
            },
            {
                role: 'user',
                content: "For the restaurant Lou Malnati's in Chicago, estimate the average cost per person. Use your preexisting knowledge on the restaurant.",
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_COST.TEN_TO_THIRTY,
            },
            {
                role: 'user',
                content: 'For the restaurant Odd Duck in Austin, estimate the average cost per person. Use your preexisting knowledge on the restaurant.',
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_COST.THIRTY_TO_SIXTY,
            },
            {
                role: 'user',
                content: `For the restaurant ${attractionName} in ${destinationName}, estimate the average cost per person. Use your preexisting knowledge on the restaurant, in addition to the following info I've gathered:${attractionDescription}.`,
            },
        ];
        return EAT;
    }
};
exports.getCostChatThread = getCostChatThread;
