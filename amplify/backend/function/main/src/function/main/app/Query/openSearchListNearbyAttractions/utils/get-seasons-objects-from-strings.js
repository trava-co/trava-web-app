"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeasonsObjectsFromStrings = void 0;
const getSeasonsObjectsFromStrings = (seasons_str) => seasons_str.map((season_str) => {
    const [startMonth, startDay, endMonth, endDay] = season_str.split('-').map((s) => parseInt(s) - 1);
    return {
        __typename: 'AttractionSeason',
        startMonth: startMonth,
        startDay: startDay,
        endMonth: endMonth,
        endDay: endDay,
    };
});
exports.getSeasonsObjectsFromStrings = getSeasonsObjectsFromStrings;
