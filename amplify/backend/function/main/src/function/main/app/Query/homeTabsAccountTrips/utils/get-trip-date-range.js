"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const dateFormat_1 = require("../../../utils/enums/dateFormat");
const render_trip_date_1 = require("./render-trip-date");
const GetTripDateRange = (tripDestinationsItemsPick) => {
    let dateString;
    if (filterTripHasNoPendingDates(tripDestinationsItemsPick)) {
        const startDate = dayjs_1.default.min(tripDestinationsItemsPick.map((item) => { var _a; return (0, dayjs_1.default)((_a = item.startDate) === null || _a === void 0 ? void 0 : _a.toString(), dateFormat_1.DateFormat.YYYYMMDD); }));
        const endDate = dayjs_1.default.max(tripDestinationsItemsPick.map((item) => { var _a; return (0, dayjs_1.default)((_a = item.endDate) === null || _a === void 0 ? void 0 : _a.toString(), dateFormat_1.DateFormat.YYYYMMDD); }));
        dateString = (0, render_trip_date_1.renderTripDate)((0, dayjs_1.default)(startDate), (0, dayjs_1.default)(endDate));
    }
    else
        dateString = 'TRIP DATES PENDING';
    return dateString;
};
exports.default = GetTripDateRange;
const filterTripHasNoPendingDates = (tripDestinationsItemsPick) => !filterTripHasNoDestinations(tripDestinationsItemsPick) &&
    filterTripHasOnlyDestinationsWithDates(tripDestinationsItemsPick);
const filterTripHasNoDestinations = (tripDestinationsItemsPick) => tripDestinationsItemsPick.length === 0;
const filterTripHasOnlyDestinationsWithDates = (tripDestinationsItemsPick) => tripDestinationsItemsPick.every(filterTripDestinationHasDate);
const filterTripDestinationHasDate = (tripDestination) => tripDestination.startDate !== null && tripDestination.endDate !== null;
