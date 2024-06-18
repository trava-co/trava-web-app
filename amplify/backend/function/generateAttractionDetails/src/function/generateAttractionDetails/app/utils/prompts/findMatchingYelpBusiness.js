"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchingYelpBusinessIdFunctions = exports.findMatchingYelpBusiness = void 0;
const findMatchingYelpBusiness = (googlePlaceInfo, yelpBusinesses) => {
    const conversation = [
        {
            role: 'system',
            content: "You're an advanced AI model tasked with identifying matches between Google Places businesses and Yelp businesses. For each Google Place business, determine if any of the Yelp businesses are a match, focusing on the business name, address, categories, and descriptions. You should only select a match if you're extremely confident, otherwise, it's better to just return NONE.",
        },
        {
            role: 'user',
            content: `Google place business: ${googlePlaceInfo}. Yelp businesses: ${yelpBusinesses}`,
        },
    ];
    return conversation;
};
exports.findMatchingYelpBusiness = findMatchingYelpBusiness;
const getMatchingYelpBusinessIdFunctions = (enumValuesForArgument) => {
    const functions = [
        {
            name: 'log_matching_yelp_business_id',
            description: 'Logs to the console the matching yelp business id or NONE if no match',
            parameters: {
                type: 'object',
                properties: {
                    businessMatch: {
                        type: 'string',
                        description: 'The matching yelp business id or NONE if no match',
                        enum: enumValuesForArgument,
                    },
                },
                required: ['businessMatch'],
            },
        },
    ];
    return functions;
};
exports.getMatchingYelpBusinessIdFunctions = getMatchingYelpBusinessIdFunctions;
