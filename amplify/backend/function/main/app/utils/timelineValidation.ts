import { TimelineEntry } from 'shared-types/API'
import dayjs from 'dayjs'

const MAX_NOTES_LENGTH = 300
const MAX_RENTAL_PICKUP_LOCATION_LENGTH = 120
const MAX_RENTAL_DROPOFF_LOCATION_LENGTH = 120
const MAX_LODGING_ARRIVAL_NAME_AND_ADDRESS_LENGTH = 120
const MAX_LODGING_DEPARTURE_NAME_AND_ADDRESS_LENGTH = 120

function validateNotes(notes: TimelineEntry['notes']) {
  if (notes && notes.length > MAX_NOTES_LENGTH) throw new ValidationException()
}

function validateDate(date: TimelineEntry['date']) {
  if (!dayjs(date.toString(), 'YYYYMMDD', true).isValid()) throw new ValidationException()
}

function validateTime(time: TimelineEntry['time']) {
  if (!dayjs(time.toString().padStart(4, '0'), 'HHmm', true).isValid()) throw new ValidationException()
}

function validateRentalPickupLocation(rentalPickupLocation: TimelineEntry['rentalPickupLocation']) {
  if (rentalPickupLocation && rentalPickupLocation.length > MAX_RENTAL_PICKUP_LOCATION_LENGTH)
    throw new ValidationException()
}

function validateRentalDropoffLocation(rentalDropoffLocation: TimelineEntry['rentalDropoffLocation']) {
  if (rentalDropoffLocation && rentalDropoffLocation.length > MAX_RENTAL_DROPOFF_LOCATION_LENGTH)
    throw new ValidationException()
}

function validateLodgingArrivalNameAndAddress(
  lodgingArrivalNameAndAddress: TimelineEntry['lodgingArrivalNameAndAddress'],
) {
  if (lodgingArrivalNameAndAddress && lodgingArrivalNameAndAddress.length > MAX_LODGING_ARRIVAL_NAME_AND_ADDRESS_LENGTH)
    throw new ValidationException()
}

function validateLodgingDepartureNameAndAddress(
  lodgingDepartureNameAndAddress: TimelineEntry['lodgingDepartureNameAndAddress'],
) {
  if (
    lodgingDepartureNameAndAddress &&
    lodgingDepartureNameAndAddress.length > MAX_LODGING_DEPARTURE_NAME_AND_ADDRESS_LENGTH
  )
    throw new ValidationException()
}

class ValidationException extends Error {
  constructor() {
    super('Validation Exception')
  }
}

export {
  validateNotes,
  validateDate,
  validateTime,
  validateRentalPickupLocation,
  validateRentalDropoffLocation,
  validateLodgingArrivalNameAndAddress,
  validateLodgingDepartureNameAndAddress,
}
