"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBestVisitedByOperatingHours = exports.filterBestVisitedByMealsServed = exports.getBestVisited = void 0;
const API_1 = require("shared-types/API");
const daypartToTimeMapping = {
    [API_1.ATTRACTION_BEST_VISIT_TIME.MORNING]: { start: 400, end: 1200 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON]: { start: 1200, end: 1800 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.EVENING]: { start: 1800, end: 2400 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST]: { start: 600, end: 1200 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH]: { start: 1200, end: 1600 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.DINNER]: { start: 1600, end: 2400 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.SNACK]: { start: 0, end: 2400 },
    [API_1.ATTRACTION_BEST_VISIT_TIME.NON_APPLICABLE]: { start: 0, end: 0 },
};
// Construct new enums for DO and EAT attraction types that exclude NON_APPLICABLE from ATTRACTION_BEST_VISIT_TIME
var ApplicableBestVisitTimeDo;
(function (ApplicableBestVisitTimeDo) {
    ApplicableBestVisitTimeDo["MORNING"] = "MORNING";
    ApplicableBestVisitTimeDo["AFTERNOON"] = "AFTERNOON";
    ApplicableBestVisitTimeDo["EVENING"] = "EVENING";
})(ApplicableBestVisitTimeDo || (ApplicableBestVisitTimeDo = {}));
var ApplicableBestVisitTimeEat;
(function (ApplicableBestVisitTimeEat) {
    ApplicableBestVisitTimeEat["BREAKFAST"] = "BREAKFAST";
    ApplicableBestVisitTimeEat["LUNCH"] = "LUNCH";
    ApplicableBestVisitTimeEat["DINNER"] = "DINNER";
    // SNACK = ATTRACTION_BEST_VISIT_TIME.SNACK,
})(ApplicableBestVisitTimeEat || (ApplicableBestVisitTimeEat = {}));
function getBestVisited({ periods, mealServices, attractionType }) {
    const possibleBestVisited = Object.values(attractionType === API_1.ATTRACTION_TYPE.DO ? ApplicableBestVisitTimeDo : ApplicableBestVisitTimeEat);
    // if type ATTRACTION_TYPE.DO, then get best visited from hours of operation
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        return filterBestVisitedByOperatingHours(possibleBestVisited, periods);
    }
    // else ATTRACTION_TYPE.EAT, then get best visited from serves_breakfast, serves_brunch, serves_lunch, serves_dinner, dine_in, takeout, delivery
    else {
        const googleMealsServed = {
            breakfast: mealServices === null || mealServices === void 0 ? void 0 : mealServices.servesBreakfast,
            brunch: mealServices === null || mealServices === void 0 ? void 0 : mealServices.servesBrunch,
            lunch: mealServices === null || mealServices === void 0 ? void 0 : mealServices.servesLunch,
            dinner: mealServices === null || mealServices === void 0 ? void 0 : mealServices.servesDinner,
        };
        return filterBestVisitedByMealsServed(possibleBestVisited, googleMealsServed);
    }
}
exports.getBestVisited = getBestVisited;
// Filter out best visited times that are outside of the attraction's operating hours
function filterBestVisitedByOperatingHours(travaBestVisited, periods) {
    const bestVisited = Array.from(travaBestVisited).filter((visitTime) => {
        const { start: daypartStartTime, end: daypartEndTime } = daypartToTimeMapping[visitTime];
        if (!periods) {
            // If there are no opening hours, assume the attraction is open 24 hours
            // ex: neighborhoods like North End, Boston
            return true;
        }
        return periods.some((period) => {
            // if the 'close' key is missing, the attraction is open 24 hours
            if (!period.close) {
                return true;
            }
            let attractionOpenTime = parseInt(period.open.time);
            let attractionCloseTime = parseInt(period.close.time);
            // If closing time is smaller than opening time, add 2400 to represent the next day
            if (attractionCloseTime < attractionOpenTime) {
                attractionCloseTime += 2400;
            }
            // Adjust daypartEndTime for next day scenarios
            const adjustedDaypartEndTime = daypartEndTime <= daypartStartTime ? daypartEndTime + 2400 : daypartEndTime;
            // At least some part of the visit time should fall within the operating hours
            return daypartStartTime < attractionCloseTime && adjustedDaypartEndTime > attractionOpenTime;
        });
    });
    if (bestVisited.length === 0) {
        // If no best visited times are within operating hours, return afternoon as the default
        return [API_1.ATTRACTION_BEST_VISIT_TIME.AFTERNOON];
    }
    return bestVisited;
}
exports.filterBestVisitedByOperatingHours = filterBestVisitedByOperatingHours;
const filterBestVisitedByMealsServed = (candidatesForBestVisitedTimes, googleMealsServed) => {
    const validTimes = [];
    if (!googleMealsServed) {
        return [API_1.ATTRACTION_BEST_VISIT_TIME.DINNER];
    }
    const { breakfast, brunch, lunch, dinner } = googleMealsServed;
    candidatesForBestVisitedTimes.forEach((popularTime) => {
        if (popularTime === API_1.ATTRACTION_BEST_VISIT_TIME.BREAKFAST && (breakfast || brunch)) {
            validTimes.push(popularTime);
        }
        else if (popularTime === API_1.ATTRACTION_BEST_VISIT_TIME.LUNCH && (lunch || brunch)) {
            validTimes.push(popularTime);
        }
        else if (popularTime === API_1.ATTRACTION_BEST_VISIT_TIME.DINNER && dinner) {
            validTimes.push(popularTime);
        }
        // else if (popularTime === ATTRACTION_BEST_VISIT_TIME.SNACK) {
        //   validTimes.push(popularTime)
        // }
    });
    if (validTimes.length === 0) {
        // If no best visited times are within operating hours, return dinner as the default
        return [API_1.ATTRACTION_BEST_VISIT_TIME.DINNER];
    }
    return validTimes;
};
exports.filterBestVisitedByMealsServed = filterBestVisitedByMealsServed;
