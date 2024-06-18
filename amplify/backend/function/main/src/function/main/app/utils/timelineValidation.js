"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLodgingDepartureNameAndAddress = exports.validateLodgingArrivalNameAndAddress = exports.validateRentalDropoffLocation = exports.validateRentalPickupLocation = exports.validateTime = exports.validateDate = exports.validateNotes = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const MAX_NOTES_LENGTH = 300;
const MAX_RENTAL_PICKUP_LOCATION_LENGTH = 120;
const MAX_RENTAL_DROPOFF_LOCATION_LENGTH = 120;
const MAX_LODGING_ARRIVAL_NAME_AND_ADDRESS_LENGTH = 120;
const MAX_LODGING_DEPARTURE_NAME_AND_ADDRESS_LENGTH = 120;
function validateNotes(notes) {
    if (notes && notes.length > MAX_NOTES_LENGTH)
        throw new ValidationException();
}
exports.validateNotes = validateNotes;
function validateDate(date) {
    if (!(0, dayjs_1.default)(date.toString(), 'YYYYMMDD', true).isValid())
        throw new ValidationException();
}
exports.validateDate = validateDate;
function validateTime(time) {
    if (!(0, dayjs_1.default)(time.toString().padStart(4, '0'), 'HHmm', true).isValid())
        throw new ValidationException();
}
exports.validateTime = validateTime;
function validateRentalPickupLocation(rentalPickupLocation) {
    if (rentalPickupLocation && rentalPickupLocation.length > MAX_RENTAL_PICKUP_LOCATION_LENGTH)
        throw new ValidationException();
}
exports.validateRentalPickupLocation = validateRentalPickupLocation;
function validateRentalDropoffLocation(rentalDropoffLocation) {
    if (rentalDropoffLocation && rentalDropoffLocation.length > MAX_RENTAL_DROPOFF_LOCATION_LENGTH)
        throw new ValidationException();
}
exports.validateRentalDropoffLocation = validateRentalDropoffLocation;
function validateLodgingArrivalNameAndAddress(lodgingArrivalNameAndAddress) {
    if (lodgingArrivalNameAndAddress && lodgingArrivalNameAndAddress.length > MAX_LODGING_ARRIVAL_NAME_AND_ADDRESS_LENGTH)
        throw new ValidationException();
}
exports.validateLodgingArrivalNameAndAddress = validateLodgingArrivalNameAndAddress;
function validateLodgingDepartureNameAndAddress(lodgingDepartureNameAndAddress) {
    if (lodgingDepartureNameAndAddress &&
        lodgingDepartureNameAndAddress.length > MAX_LODGING_DEPARTURE_NAME_AND_ADDRESS_LENGTH)
        throw new ValidationException();
}
exports.validateLodgingDepartureNameAndAddress = validateLodgingDepartureNameAndAddress;
class ValidationException extends Error {
    constructor() {
        super('Validation Exception');
    }
}
