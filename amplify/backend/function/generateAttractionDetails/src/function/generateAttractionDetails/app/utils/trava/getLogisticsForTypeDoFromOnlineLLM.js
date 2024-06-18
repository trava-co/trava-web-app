"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogisticsForTypeDoFromOnlineLLM = void 0;
const API_1 = require("shared-types/API");
const categories_1 = require("../prompts/categories");
const mostSimilarResponse_1 = require("../prompts/mostSimilarResponse");
const reservations_1 = require("../prompts/reservations");
const targetGroup_1 = require("../prompts/targetGroup");
async function getLogisticsForTypeDoFromOnlineLLM({ attractionId, attractionName, destinationName, onlineLLMDescription, }) {
    const possibleTravaCategories = Object.values(categories_1.possibleCategories[API_1.ATTRACTION_TYPE.DO]);
    const possibleReservationValues = Object.values(reservations_1.reservationsMap);
    const possibleTargetGroups = Object.values(targetGroup_1.targetGroupMap[API_1.ATTRACTION_TYPE.DO]);
    let logistics;
    try {
        // query openai for logistics from onlineLLM descriptions
        // necessary because categories from rec sources aren't always available/more variable
        logistics = await (0, mostSimilarResponse_1.determineLogistics)({
            description: onlineLLMDescription,
            possibleTravaCategories,
            possibleReservationValues,
            possibleTargetGroups,
        });
    }
    catch (error) {
        console.error('Error querying GPT-4 for logistics from onlineLLM description for type DO');
        throw error;
    }
    // for each of the logistics, if it is a valid value, then add it to the object to return
    const { categories, reservations, targetGroups } = logistics;
    const validCategories = [];
    // check if categories is valid
    categories.forEach((category) => {
        if (possibleTravaCategories.includes(category)) {
            validCategories.push(category);
        }
    });
    // check if reservations is valid
    const validReservations = possibleReservationValues.includes(reservations)
        ? reservations
        : undefined;
    // check if targetGroups is valid
    const validTargetGroups = [];
    targetGroups.forEach((group) => {
        if (possibleTargetGroups.includes(group)) {
            validTargetGroups.push(group);
        }
    });
    // if there are no valid categories, reservations, or targetGroups from GPT-4, throw an error
    if (validCategories.length === 0 && !validReservations && validTargetGroups.length === 0) {
        throw new Error(`No valid categories, reservations, or targetGroups from GPT-4 for ${attractionName} in ${destinationName}. attractionId: ${attractionId}. onlineLLM description: ${onlineLLMDescription}`);
    }
    const validLogistics = {
        attractionCategories: validCategories,
        reservation: validReservations,
        attractionTargetGroups: validTargetGroups,
    };
    // console.log(`validLogistics for ${attractionName}: ${JSON.stringify(validLogistics, null, 2)}`)
    // return the logistics
    return validLogistics;
}
exports.getLogisticsForTypeDoFromOnlineLLM = getLogisticsForTypeDoFromOnlineLLM;
