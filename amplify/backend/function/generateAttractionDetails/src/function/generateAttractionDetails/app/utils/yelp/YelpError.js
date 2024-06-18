"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YelpMultipleBusinessesFoundError = exports.YelpBusinessNotFoundError = exports.YelpAPIError = void 0;
class YelpAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.YelpAPIError = YelpAPIError;
// error class for when yelp business is not found
class YelpBusinessNotFoundError extends YelpAPIError {
    phoneOrName;
    constructor(phoneOrName) {
        super(`No business found for ${phoneOrName}`);
        this.phoneOrName = phoneOrName;
    }
}
exports.YelpBusinessNotFoundError = YelpBusinessNotFoundError;
// error class for when multiple yelp businesses are found
class YelpMultipleBusinessesFoundError extends YelpAPIError {
    phoneOrName;
    numberOfBusinessesFound;
    constructor(phoneOrName, numberOfBusinessesFound) {
        super(`More than one business found for ${phoneOrName}`);
        this.phoneOrName = phoneOrName;
        this.numberOfBusinessesFound = numberOfBusinessesFound;
    }
}
exports.YelpMultipleBusinessesFoundError = YelpMultipleBusinessesFoundError;
