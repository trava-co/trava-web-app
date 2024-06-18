import dayjs from 'dayjs'
import { DateFormat } from '../../../utils/enums/dateFormat'
import { renderTripDate } from './render-trip-date'
import { TripDestination } from 'shared-types/API'

type TypeTripDestinationsItemsPick = Pick<TripDestination, 'startDate' | 'endDate'>[]

const GetTripDateRange = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) => {
  let dateString: string
  if (filterTripHasNoPendingDates(tripDestinationsItemsPick)) {
    const startDate = dayjs.min(
      tripDestinationsItemsPick.map((item) => dayjs(item.startDate?.toString(), DateFormat.YYYYMMDD)),
    )
    const endDate = dayjs.max(
      tripDestinationsItemsPick.map((item) => dayjs(item.endDate?.toString(), DateFormat.YYYYMMDD)),
    )
    dateString = renderTripDate(dayjs(startDate), dayjs(endDate))
  } else dateString = 'TRIP DATES PENDING'
  return dateString
}

export default GetTripDateRange

const filterTripHasNoPendingDates = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) =>
  !filterTripHasNoDestinations(tripDestinationsItemsPick) &&
  filterTripHasOnlyDestinationsWithDates(tripDestinationsItemsPick)

const filterTripHasNoDestinations = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) =>
  tripDestinationsItemsPick.length === 0

const filterTripHasOnlyDestinationsWithDates = (tripDestinationsItemsPick: TypeTripDestinationsItemsPick) =>
  tripDestinationsItemsPick.every(filterTripDestinationHasDate)

const filterTripDestinationHasDate = (tripDestination: TypeTripDestinationsItemsPick[0]) =>
  tripDestination.startDate !== null && tripDestination.endDate !== null
