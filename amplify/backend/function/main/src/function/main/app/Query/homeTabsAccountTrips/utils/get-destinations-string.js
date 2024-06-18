"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getDestinationsString = (tripDestinationsItemsPick) => {
    const sortedTripDestinationsItems = tripDestinationsItemsPick.length === 0
        ? [] // Trip has no destinations
        : filterTripHasOnlyPendingDates(tripDestinationsItemsPick) // Trip has one or more destinations without date
            ? tripDestinationsItemsPick.sort(sortTripDestinationsASC)
            : filterTripHasSomePendingDates(tripDestinationsItemsPick) // Trip has one or more destinations with date and have one or more destinations without date
                ? [
                    ...tripDestinationsItemsPick.filter(filterTripDestinationHasDate).sort(sortTripDestinationsByStartDateAndASC),
                    ...tripDestinationsItemsPick.filter(filterTripDestinationHasNoDate).sort(sortTripDestinationsASC),
                ]
                : tripDestinationsItemsPick.sort(sortTripDestinationsByStartDateAndASC); // Trip has one or more destinations with date and NO destinations without date
    return (sortedTripDestinationsItems === null || sortedTripDestinationsItems === void 0 ? void 0 : sortedTripDestinationsItems.length) === 0
        ? 'No destinations'
        : sortedTripDestinationsItems.map((tripDestination) => tripDestination.name).join(', ');
};
exports.default = getDestinationsString;
const filterTripHasSomePendingDates = (tripDestinationsItemsPick) => tripDestinationsItemsPick.some(filterTripDestinationHasNoDate);
const filterTripHasOnlyPendingDates = (tripDestinationsItemsPick) => tripDestinationsItemsPick.every(filterTripDestinationHasNoDate);
const filterTripDestinationHasNoDate = (tripDestination) => tripDestination.startDate === null || tripDestination.endDate === null;
const filterTripDestinationHasDate = (tripDestination) => tripDestination.startDate !== null && tripDestination.endDate !== null;
const sortTripDestinationsASC = (tripDestinationA, tripDestinationB) => tripDestinationA.name.localeCompare(tripDestinationB.name);
const sortTripDestinationsByStartDateAndASC = (tripDestinationA, tripDestinationB) => !(tripDestinationA === null || tripDestinationA === void 0 ? void 0 : tripDestinationA.startDate) || !(tripDestinationB === null || tripDestinationB === void 0 ? void 0 : tripDestinationB.startDate)
    ? 1
    : tripDestinationA.startDate - tripDestinationB.startDate ||
        (tripDestinationA === null || tripDestinationA === void 0 ? void 0 : tripDestinationA.name.localeCompare(tripDestinationB === null || tripDestinationB === void 0 ? void 0 : tripDestinationB.name));
