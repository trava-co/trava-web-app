import { TripDestination, Destination } from 'shared-types/API'

type TypeTripDestinationsItemsPick = (Pick<TripDestination, 'startDate' | 'endDate'> & Pick<Destination, 'name'>)[]

const getDestinationsString = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) => {
  const sortedTripDestinationsItems =
    tripDestinationsItemsPick.length === 0
      ? [] // Trip has no destinations
      : filterTripHasOnlyPendingDates(tripDestinationsItemsPick) // Trip has one or more destinations without date
      ? tripDestinationsItemsPick.sort(sortTripDestinationsASC)
      : filterTripHasSomePendingDates(tripDestinationsItemsPick) // Trip has one or more destinations with date and have one or more destinations without date
      ? [
          ...tripDestinationsItemsPick.filter(filterTripDestinationHasDate).sort(sortTripDestinationsByStartDateAndASC),
          ...tripDestinationsItemsPick.filter(filterTripDestinationHasNoDate).sort(sortTripDestinationsASC),
        ]
      : tripDestinationsItemsPick.sort(sortTripDestinationsByStartDateAndASC) // Trip has one or more destinations with date and NO destinations without date

  return sortedTripDestinationsItems?.length === 0
    ? 'No destinations'
    : sortedTripDestinationsItems.map((tripDestination) => tripDestination.name).join(', ')
}

export default getDestinationsString

const filterTripHasSomePendingDates = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) =>
  tripDestinationsItemsPick.some(filterTripDestinationHasNoDate)

const filterTripHasOnlyPendingDates = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) =>
  tripDestinationsItemsPick.every(filterTripDestinationHasNoDate)

const filterTripDestinationHasNoDate = (tripDestination: TypeTripDestinationsItemsPick[0]) =>
  tripDestination.startDate === null || tripDestination.endDate === null

const filterTripDestinationHasDate = (tripDestination: TypeTripDestinationsItemsPick[0]) =>
  tripDestination.startDate !== null && tripDestination.endDate !== null

const sortTripDestinationsASC = (
  tripDestinationA: TypeTripDestinationsItemsPick[0],
  tripDestinationB: TypeTripDestinationsItemsPick[0],
) => tripDestinationA.name.localeCompare(tripDestinationB.name)

const sortTripDestinationsByStartDateAndASC = (
  tripDestinationA: TypeTripDestinationsItemsPick[0],
  tripDestinationB: TypeTripDestinationsItemsPick[0],
) =>
  !tripDestinationA?.startDate || !tripDestinationB?.startDate
    ? 1
    : tripDestinationA.startDate - tripDestinationB.startDate ||
      tripDestinationA?.name.localeCompare(tripDestinationB?.name)
