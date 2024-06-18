"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTripDate = void 0;
const dateFormat_1 = require("../../../utils/enums/dateFormat");
const renderTripDate = (startDate, endDate) => {
    let renderDate;
    const startDateDay = startDate.format(dateFormat_1.DateFormat.D);
    const startDateMonth = startDate.format(dateFormat_1.DateFormat.MMMM);
    const startDateYear = startDate.format(dateFormat_1.DateFormat.YYYY);
    const endDateDay = endDate.format(dateFormat_1.DateFormat.D);
    const endDateMonth = endDate.format(dateFormat_1.DateFormat.MMMM);
    const endDateYear = endDate.format(dateFormat_1.DateFormat.YYYY);
    if (startDate.toString() === endDate.toString()) {
        // example case: SEPTEMBER 8, 2021
        renderDate = startDate.format(dateFormat_1.DateFormat.MMMM_D_YYYY);
    }
    else if (startDateMonth === endDateMonth && startDateYear === endDateYear) {
        // example case: SEPTEMBER 8-18, 2021
        renderDate = `${startDateMonth} ${startDateDay}-${endDateDay}, ${startDateYear}`;
    }
    else if (startDateMonth !== endDateMonth && startDateYear === endDateYear) {
        // example case: OCTOBER 6 - NOVEMBER 6, 2021
        renderDate = `${startDateMonth} ${startDateDay} - ${endDateMonth} ${endDateDay}, ${startDateYear}`;
    }
    else {
        // example case: DECEMBER 12, 2021 - FEBRUARY 18, 2022
        renderDate = `${startDate.format(dateFormat_1.DateFormat.MMMM_D_YYYY)} - ${endDate.format(dateFormat_1.DateFormat.MMMM_D_YYYY)}`;
    }
    return renderDate;
};
exports.renderTripDate = renderTripDate;
