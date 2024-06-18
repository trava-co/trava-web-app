"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravaCardGooglePlaceValidationError = exports.TravaCardValidationError = exports.TravaDoAttractionAlreadyHasDescriptionsError = exports.TravaAttractionMissingGoogleReviewsError = exports.TravaDoAttractionMissingBingInfoError = exports.ReviseShortDescriptionError = exports.TravaTargetGroupError = exports.TravaCategoriesError = exports.TravaCostError = exports.TravaDescriptionError = exports.TravaCardCreationError = exports.CreateEmbeddingsError = void 0;
class TravaCardCreationError extends Error {
    attractionId;
    attractionName;
    destinationName;
    constructor({ message, attractionId, attractionName, destinationName }) {
        super(message);
        this.name = this.constructor.name;
        this.attractionId = attractionId;
        this.attractionName = attractionName;
        this.destinationName = destinationName;
    }
}
exports.TravaCardCreationError = TravaCardCreationError;
class CreateEmbeddingsError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.CreateEmbeddingsError = CreateEmbeddingsError;
class TravaDescriptionError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaDescriptionError = TravaDescriptionError;
class TravaCategoriesError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaCategoriesError = TravaCategoriesError;
class ReviseShortDescriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.ReviseShortDescriptionError = ReviseShortDescriptionError;
class TravaCostError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaCostError = TravaCostError;
class TravaTargetGroupError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaTargetGroupError = TravaTargetGroupError;
class TravaDoAttractionMissingBingInfoError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaDoAttractionMissingBingInfoError = TravaDoAttractionMissingBingInfoError;
class TravaAttractionMissingGoogleReviewsError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaAttractionMissingGoogleReviewsError = TravaAttractionMissingGoogleReviewsError;
class TravaDoAttractionAlreadyHasDescriptionsError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaDoAttractionAlreadyHasDescriptionsError = TravaDoAttractionAlreadyHasDescriptionsError;
class TravaCardValidationError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaCardValidationError = TravaCardValidationError;
class TravaCardGooglePlaceValidationError extends TravaCardCreationError {
    constructor(error) {
        super(error);
    }
}
exports.TravaCardGooglePlaceValidationError = TravaCardGooglePlaceValidationError;
