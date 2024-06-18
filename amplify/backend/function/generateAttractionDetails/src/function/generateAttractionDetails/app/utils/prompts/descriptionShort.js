"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravaDescriptionShortPrompt = void 0;
const API_1 = require("shared-types/API");
const getTravaDescriptionShortPrompt = (attractionType, relevantDescription) => {
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        const DO = [
            {
                role: 'system',
                content: `Given the details of an attraction, craft a one-sentence attention grabbing hook between 50 and 100 characters in the style of a spirited travel blogger.\n\nStick to these rules:\n\n1. Use simple, approachable language.\n2. Stay true to the provided facts.\n3. Avoid exclamation points.\n4. Avoid mentioning the attraction name.`,
            },
            {
                role: 'user',
                content: relevantDescription,
            },
        ];
        return DO;
    }
    else {
        const EAT = [
            {
                role: 'system',
                content: `Given the details of a restaurant, craft a one-sentence attention grabbing hook between 50 and 100 characters in the style of a spirited travel blogger.\n\nStick to these rules:\n\n1. Use simple, approachable language.\n2. Stay true to the provided facts.\n3. Reader should know what cuisine the restaurant serves.\n4. Avoid exclamation points.\n5. Avoid mentioning the restaurant name.`,
            },
            {
                role: 'user',
                content: relevantDescription,
            },
        ];
        return EAT;
    }
};
exports.getTravaDescriptionShortPrompt = getTravaDescriptionShortPrompt;
