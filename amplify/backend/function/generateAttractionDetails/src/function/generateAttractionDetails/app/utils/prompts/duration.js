"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaDurationChatThread = exports.possibleDurations = void 0;
const API_1 = require("shared-types/API");
exports.possibleDurations = {
    [API_1.ATTRACTION_TYPE.DO]: {
        [API_1.ATTRACTION_DURATION.LESS_THAN_AN_HOUR]: API_1.ATTRACTION_DURATION.LESS_THAN_AN_HOUR,
        [API_1.ATTRACTION_DURATION.ONE_TWO_HOURS]: API_1.ATTRACTION_DURATION.ONE_TWO_HOURS,
        [API_1.ATTRACTION_DURATION.TWO_THREE_HOURS]: API_1.ATTRACTION_DURATION.TWO_THREE_HOURS,
        [API_1.ATTRACTION_DURATION.MORE_THAN_THREE_HOURS]: API_1.ATTRACTION_DURATION.MORE_THAN_THREE_HOURS,
    },
    [API_1.ATTRACTION_TYPE.EAT]: {
        [API_1.ATTRACTION_DURATION.LESS_THAN_AN_HOUR]: API_1.ATTRACTION_DURATION.LESS_THAN_AN_HOUR,
        [API_1.ATTRACTION_DURATION.ONE_TWO_HOURS]: API_1.ATTRACTION_DURATION.ONE_TWO_HOURS,
        [API_1.ATTRACTION_DURATION.TWO_THREE_HOURS]: API_1.ATTRACTION_DURATION.TWO_THREE_HOURS,
    },
};
const getTravaDurationChatThread = (attractionName, destinationName, attractionType, attractionDescription) => {
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Provided an attraction, your job is to determine the suggested duration, using any research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of the following comma-separated options:${Object.values(exports.possibleDurations[API_1.ATTRACTION_TYPE.DO]).join(',')}.`,
            },
            {
                role: 'user',
                content: 'Determine the suggested duration for the attraction "Dip into the Barton Springs Pool" in Austin.',
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_DURATION.TWO_THREE_HOURS,
            },
            {
                role: 'user',
                content: 'Determine the suggested duration for the attraction "Watch A Red Sox Game at Fenway Park" in Boston.',
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_DURATION.MORE_THAN_THREE_HOURS,
            },
            {
                role: 'user',
                content: `Determine the suggested duration for the attraction ${attractionName} in ${destinationName}. Here's my research:${attractionDescription}.`,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Provided a place, your job is to determine the suggested duration, using any research provided to you and if insufficient, falling back to your own knowledge. Constrain your output to one of the following comma-separated options:${Object.values(exports.possibleDurations[API_1.ATTRACTION_TYPE.EAT]).join(',')}`,
            },
            {
                role: 'user',
                content: "Determine the suggested duration for dining at Lou Malnati's in Chicago.",
            },
            {
                role: 'assistant',
                content: API_1.ATTRACTION_DURATION.ONE_TWO_HOURS,
            },
            {
                role: 'user',
                content: `Determine the suggested duration for dining at ${attractionName} in ${destinationName}. Here's my research:${attractionDescription}.`,
            },
        ];
        return EAT;
    }
};
exports.getTravaDurationChatThread = getTravaDurationChatThread;
