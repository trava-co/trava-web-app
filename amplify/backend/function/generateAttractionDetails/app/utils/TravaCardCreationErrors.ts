interface ErrorInput {
  message: string
  attractionId: string
  attractionName: string
  destinationName: string
}

class TravaCardCreationError extends Error {
  attractionId: string
  attractionName: string
  destinationName: string

  constructor({ message, attractionId, attractionName, destinationName }: ErrorInput) {
    super(message)
    this.name = this.constructor.name
    this.attractionId = attractionId
    this.attractionName = attractionName
    this.destinationName = destinationName
  }
}

class CreateEmbeddingsError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaDescriptionError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaCategoriesError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class ReviseShortDescriptionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class TravaCostError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaTargetGroupError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaDoAttractionMissingBingInfoError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaAttractionMissingGoogleReviewsError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaDoAttractionAlreadyHasDescriptionsError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaCardValidationError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

class TravaCardGooglePlaceValidationError extends TravaCardCreationError {
  constructor(error: ErrorInput) {
    super(error)
  }
}

export {
  CreateEmbeddingsError,
  TravaCardCreationError,
  TravaDescriptionError,
  TravaCostError,
  TravaCategoriesError,
  TravaTargetGroupError,
  ReviseShortDescriptionError,
  TravaDoAttractionMissingBingInfoError,
  TravaAttractionMissingGoogleReviewsError,
  TravaDoAttractionAlreadyHasDescriptionsError,
  TravaCardValidationError,
  TravaCardGooglePlaceValidationError,
}
