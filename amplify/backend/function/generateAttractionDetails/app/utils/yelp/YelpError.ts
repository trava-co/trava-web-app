class YelpAPIError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
  }
}

// error class for when yelp business is not found
class YelpBusinessNotFoundError extends YelpAPIError {
  phoneOrName: string

  constructor(phoneOrName: string) {
    super(`No business found for ${phoneOrName}`)
    this.phoneOrName = phoneOrName
  }
}

// error class for when multiple yelp businesses are found
class YelpMultipleBusinessesFoundError extends YelpAPIError {
  phoneOrName: string
  numberOfBusinessesFound: number

  constructor(phoneOrName: string, numberOfBusinessesFound: number) {
    super(`More than one business found for ${phoneOrName}`)
    this.phoneOrName = phoneOrName
    this.numberOfBusinessesFound = numberOfBusinessesFound
  }
}

export { YelpAPIError, YelpBusinessNotFoundError, YelpMultipleBusinessesFoundError }
