"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
// search for at least one season within attraction that is between start and end destination dates
const filterCardsBySeasons = ({ seasons, destinationStartDate, // YYYY-MM-DD
destinationEndDate, // YYYY-MM-DD
 }) => {
    if (!seasons)
        return true;
    const destinationStartDateYear = (0, dayjs_1.default)(destinationStartDate).year();
    const destinationEndDateYear = (0, dayjs_1.default)(destinationEndDate).year();
    const destinationStartDateMMDD = (0, dayjs_1.default)(destinationStartDate).format('MM-DD');
    const destinationEndDateMMDD = (0, dayjs_1.default)(destinationEndDate).format('MM-DD');
    let destinationDates = [];
    if (destinationStartDateYear === destinationEndDateYear) {
        destinationDates.push([destinationStartDateMMDD, destinationEndDateMMDD]);
    }
    // if destination spans three calendar years, all dates are available
    else if (destinationEndDateYear - destinationStartDateYear > 1) {
        destinationDates = [[`01-01`, `12-31`]];
    }
    // if destination dates are in consecutive years, we need to add all dates in between
    else {
        destinationDates.push([destinationStartDateMMDD, `12-31`], [`01-01`, destinationEndDateMMDD]);
    }
    try {
        // no concern about complexity: max number of seasons is 2, and max number of dates is 2
        // if there's any overlap between destination dates and season dates (MM-DD), return true
        return seasons.some((season) => {
            // two date ranges overlap if (StartDate1 <= EndDate2) and (StartDate2 <= EndDate1)
            const startDateSeason = `${formatDayOrMonth(season.startMonth)}-${formatDayOrMonth(season.startDay)}`; // MM-DD
            const endDateSeason = `${formatDayOrMonth(season.endMonth)}-${formatDayOrMonth(season.endDay)}`; // MM-DD
            return destinationDates.some(([startDateDestination, endDateDestination]) => {
                return startDateSeason <= endDateDestination && startDateDestination <= endDateSeason;
            });
        });
    }
    catch (_a) {
        // it's possible that the season's date formatting could have improper values; as a safeguard, if so, we'll just exclude the attraction
        return false;
    }
};
exports.default = filterCardsBySeasons;
const formatDayOrMonth = (dayOrMonthNumber) => (dayOrMonthNumber + 1).toString().padStart(2, '0'); // input: 0-11 || 0-30
