"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaBestVisitedChatThread = exports.possibleBestVisitedTimes = void 0;
const API_1 = require("shared-types/API");
exports.possibleBestVisitedTimes = {
    [API_1.ATTRACTION_TYPE.DO]: {
        [API_1.ATTRACTION_BEST_VISIT_TIME.MORNING]: API_1.ATTRACTION_BEST_VISIT_TIME.MORNING,
        [API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON]: API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON,
        [API_1.ATTRACTION_BEST_VISIT_TIME.EVENING]: API_1.ATTRACTION_BEST_VISIT_TIME.EVENING,
    },
    [API_1.ATTRACTION_TYPE.EAT]: {
        [API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST]: API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST,
        [API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH]: API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH,
        [API_1.ATTRACTION_BEST_VISIT_TIME.DINNER]: API_1.ATTRACTION_BEST_VISIT_TIME.DINNER,
        [API_1.ATTRACTION_BEST_VISIT_TIME.SNACK]: API_1.ATTRACTION_BEST_VISIT_TIME.SNACK,
    },
};
const getTravaBestVisitedChatThread = (attractionName, destinationName, attractionType, attractionDescription, weekdayText) => {
    const hoursOfOperationText = weekdayText ? `Hours of operation: ${weekdayText.join('')}` : '';
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Provided an attraction, your job is to output the best times to visit, using any research provided to you and if insufficient, falling back to your own knowledge. Limit your response to only print an array consisting of elements that are one of these comma-separated values: ${Object.values(exports.possibleBestVisitedTimes[attractionType]).join(', ')}.`,
            },
            {
                role: 'user',
                content: 'For the attraction Boca Chica Cocktail Bar in Barcelona, classify the best time to visit, using this research: Boca Chica Cocktail Bar in Barcelona is a must-visit spot for those on the hunt for great tapas, delicious drinks, and a lovely night out. Hours: [Monday: 4:00-11:00 PM,Tuesday: 4:00-11:00 PM,Wednesday: 4:00-11:00 PM,Thursday: 4:00-11:00PM,Friday: 4:00 PM-1:00 AM,Saturday: 4:00 PM-1:00 AM,Sunday: 11:00 AM-11:00 PM]. Yelp categories: Wine Bars, Spanish, Tapas Bars',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.EVENING}, ${API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON}]`,
            },
            {
                role: 'user',
                content: 'For the attraction Dip into the Barton Springs Pool in Austin, classify the best time to visit, using this research: Hours: [Monday: 5:00 AM-10:00 PM,Tuesday: 5:00 AM-10:00 PM,Wednesday: 5:00 AM-10:00 PM,Thursday: 5:00 AM-10:00 PM,Friday: 5:00 AM-10:00 PM,Saturday: 5:00 AM-10:00 PM,Sunday: 5:00 AM-10:00 PM]',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON}, ${API_1.ATTRACTION_BEST_VISIT_TIME.EVENING}, ${API_1.ATTRACTION_BEST_VISIT_TIME.MORNING}]`,
            },
            {
                role: 'user',
                content: 'For the attraction Go Clubbing along the Beach in Barcelona, classify the best time to visit.',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.EVENING}]`,
            },
            {
                role: 'user',
                content: 'For the attraction Boston Public Garden in Boston, classify the best time to visit.',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON}, ${API_1.ATTRACTION_BEST_VISIT_TIME.MORNING}, ${API_1.ATTRACTION_BEST_VISIT_TIME.EVENING}]`,
            },
            {
                role: 'user',
                content: `For the attraction ${attractionName} in ${destinationName}, classify the best time to visit the attraction, using this research:${attractionDescription}. ${hoursOfOperationText}}`,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Provided a restaurant, your job is to output the best times to visit, using any research provided to you and if insufficient, falling back to your own knowledge. Limit your response to only print an array consisting of elements that are one of these comma-separated values: ${Object.values(exports.possibleBestVisitedTimes[attractionType]).join(', ')}.`,
            },
            {
                role: 'user',
                content: "For the restaurant Lou Malnati's in Chicago, classify the best time to visit the restaurant, using this research: Hours: [Monday: 11:00 AM-11:00 PM,Tuesday: 11:00 AM-11:00 PM,Wednesday: 11:00 AM-11:00 PM,Thursday: 11:00 AM-11:00 PM,Friday: 11:00 AM-12:00 AM,Saturday: 11:00 AM-12:00 AM,Sunday: 11:00 AM-11:00 PM]",
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.DINNER}, ${API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH}]`,
            },
            {
                role: 'user',
                content: 'For the restaurant Le Farfalle in Charleston, South Carolina, classify the best time to visit the restaurant, using this research: Hours: [Monday: 5:00-9:30 PM,Tuesday: 5:00-9:30 PM,Wednesday: 5:00-9:30 PM,Thursday: 5:00-10:00 PM,Friday: 5:00-10:00 PM,Saturday: 5:00-10:00 PM,Sunday: 5:00-9:30 PM]',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.DINNER}]`,
            },
            {
                role: 'user',
                content: 'For the restaurant Wildberry in Chicago, classify the best time to visit the restaurant, using this research: Hours: [Monday: 7:00 AM-2:00 PM,Tuesday: 7:00 AM-2:00 PM,Wednesday: 7:00 AM-2:00 PM,Thursday: 7:00 AM-2:00 PM,Friday: 7:00 AM-2:00 PM,Saturday: 7:00 AM-2:00 PM,Sunday: 7:00 AM-2:00 PM]',
            },
            {
                role: 'assistant',
                content: `[${API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST}, ${API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH}]`,
            },
            {
                role: 'user',
                content: `For the restaurant ${attractionName} in ${destinationName}, classify the best time to visit the restaurant, using this research:${attractionDescription}. ${hoursOfOperationText}`,
            },
        ];
        return EAT;
    }
};
exports.getTravaBestVisitedChatThread = getTravaBestVisitedChatThread;
