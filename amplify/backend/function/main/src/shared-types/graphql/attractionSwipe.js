"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOnPutAttractionSwipeByTripIdByDestinationId = exports.customGetAttractionSwipe = exports.customUpdateAttractionSwipe = exports.customCreateAttractionSwipe = void 0;
exports.customCreateAttractionSwipe = `
  mutation CustomCreateAttractionSwipe($input: CreateAttractionSwipeInput!) {
    createAttractionSwipe(input: $input) {
      userId
      user {
        id
        name
        privacy
        username
        createdAt
        updatedAt
      }
      tripId
      destinationId
      destination {
        id
        authorId
        name
        icon
        state
        country
        continent
        deletedAt
        isTravaCreated
        googlePlaceId
        featured
        altName
        label
        createdAt
        updatedAt
      }
      attractionId
      attraction {
        id
        attractionCategories
        attractionCuisine
        attractionTargetGroups
        authorId
        bestVisited
        costCurrency
        cost
        costNote
        costType
        descriptionLong
        descriptionShort
        destinationId
        duration
        reservation
        name
        reservationNote
        type
        isTravaCreated
        deletedAt
        privacy
        bucketListCount
        rank
        createdAt
        updatedAt
      }
      swipe
      createdAt
      updatedAt
    }
  }
`;
exports.customUpdateAttractionSwipe = `
  mutation CustomUpdateAttractionSwipe(
    $input: UpdateAttractionSwipeInput!
    $condition: ModelAttractionSwipeConditionInput
  ) {
    updateAttractionSwipe(input: $input, condition: $condition) {
      userId
      user {
        id
        name
        privacy
        username
        createdAt
        updatedAt
      }
      tripId
      destinationId
      destination {
        id
        authorId
        name
        icon
        state
        country
        continent
        deletedAt
        isTravaCreated
        googlePlaceId
        featured
        altName
        label
        createdAt
        updatedAt
      }
      attractionId
      attraction {
        id
        attractionCategories
        attractionCuisine
        attractionTargetGroups
        authorId
        bestVisited
        costCurrency
        cost
        costNote
        costType
        descriptionLong
        descriptionShort
        destinationId
        duration
        reservation
        name
        reservationNote
        type
        isTravaCreated
        deletedAt
        privacy
        bucketListCount
        rank
        createdAt
        updatedAt
      }
      swipe
      createdAt
      updatedAt
    }
  }
`;
exports.customGetAttractionSwipe = `
  query CustomGetAttractionSwipe($userId: ID!, $tripId: ID!, $attractionId: ID!) {
    getAttractionSwipe(userId: $userId, tripId: $tripId, attractionId: $attractionId) {
      userId
      tripId
      destinationId
      attractionId
      swipe
    }
  }
`;
exports.customOnPutAttractionSwipeByTripIdByDestinationId = `
  subscription CustomOnPutAttractionSwipeByTripIdByDestinationId($tripId: ID!, $destinationId: ID!) {
    onPutAttractionSwipeByTripIdByDestinationId(tripId: $tripId, destinationId: $destinationId) {
      userId
      tripId
      destinationId
      attractionId
      swipe
      createdAt
    }
  }
`;
