/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage($tripId: ID!) {
  onCreateMessage(tripId: $tripId) {
    id
    tripId
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    text
    system
    image {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    sent
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onDeleteUserTrip = /* GraphQL */ `subscription OnDeleteUserTrip($userId: ID!) {
  onDeleteUserTrip(userId: $userId) {
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    tripId
    trip {
      id
      name
      completed
      link
      createdAt
      updatedAt
      __typename
    }
    status
    invitedByUserId
    invitedByUser {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    inviteLink
    lastMessageReadDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserTripSubscriptionVariables,
  APITypes.OnDeleteUserTripSubscription
>;
export const onCreateUserTripByTripId = /* GraphQL */ `subscription OnCreateUserTripByTripId($tripId: ID!) {
  onCreateUserTripByTripId(tripId: $tripId) {
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    tripId
    trip {
      id
      name
      completed
      link
      createdAt
      updatedAt
      __typename
    }
    status
    invitedByUserId
    invitedByUser {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    inviteLink
    lastMessageReadDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserTripByTripIdSubscriptionVariables,
  APITypes.OnCreateUserTripByTripIdSubscription
>;
export const onDeleteUserTripByTripId = /* GraphQL */ `subscription OnDeleteUserTripByTripId($tripId: ID!) {
  onDeleteUserTripByTripId(tripId: $tripId) {
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    tripId
    trip {
      id
      name
      completed
      link
      createdAt
      updatedAt
      __typename
    }
    status
    invitedByUserId
    invitedByUser {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    inviteLink
    lastMessageReadDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserTripByTripIdSubscriptionVariables,
  APITypes.OnDeleteUserTripByTripIdSubscription
>;
export const onUpdateTripDestinationUserByTripId = /* GraphQL */ `subscription OnUpdateTripDestinationUserByTripId($tripId: ID!) {
  onUpdateTripDestinationUserByTripId(tripId: $tripId) {
    tripId
    destinationId
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    isReady
    tripPlanViewedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTripDestinationUserByTripIdSubscriptionVariables,
  APITypes.OnUpdateTripDestinationUserByTripIdSubscription
>;
export const onUpdateTripDestinationByTripId = /* GraphQL */ `subscription OnUpdateTripDestinationByTripId($tripId: ID!) {
  onUpdateTripDestinationByTripId(tripId: $tripId) {
    tripId
    destinationId
    attractionSwipes {
      nextToken
      __typename
    }
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    startDate
    endDate
    startTime
    endTime
    tripPlan {
      dayOfYear
      __typename
    }
    tripDestinationUsers {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTripDestinationByTripIdSubscriptionVariables,
  APITypes.OnUpdateTripDestinationByTripIdSubscription
>;
export const onCreateTripDestination = /* GraphQL */ `subscription OnCreateTripDestination($tripId: ID!) {
  onCreateTripDestination(tripId: $tripId) {
    tripId
    destinationId
    attractionSwipes {
      nextToken
      __typename
    }
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    startDate
    endDate
    startTime
    endTime
    tripPlan {
      dayOfYear
      __typename
    }
    tripDestinationUsers {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTripDestinationSubscriptionVariables,
  APITypes.OnCreateTripDestinationSubscription
>;
export const onDeleteTripDestination = /* GraphQL */ `subscription OnDeleteTripDestination($tripId: ID!) {
  onDeleteTripDestination(tripId: $tripId) {
    tripId
    destinationId
    attractionSwipes {
      nextToken
      __typename
    }
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    startDate
    endDate
    startTime
    endTime
    tripPlan {
      dayOfYear
      __typename
    }
    tripDestinationUsers {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTripDestinationSubscriptionVariables,
  APITypes.OnDeleteTripDestinationSubscription
>;
export const onUpdateFeatureFlag = /* GraphQL */ `subscription OnUpdateFeatureFlag($id: FeatureFlagName!) {
  onUpdateFeatureFlag(id: $id) {
    id
    isEnabled
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFeatureFlagSubscriptionVariables,
  APITypes.OnUpdateFeatureFlagSubscription
>;
export const onUpdateAttraction = /* GraphQL */ `subscription OnUpdateAttraction($id: ID!) {
  onUpdateAttraction(id: $id) {
    id
    attractionCategories
    attractionCuisine
    attractionTargetGroups
    author {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    authorId
    authorType
    bestVisited
    costCurrency
    cost
    costNote
    costType
    descriptionLong
    descriptionShort
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    destinationId
    duration
    images {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    reservation
    locations {
      id
      displayOrder
      deleted
      __typename
    }
    name
    reservationNote
    type
    isTravaCreated
    deletedAt
    privacy
    bucketListCount
    rank
    seasons {
      startMonth
      startDay
      endMonth
      endDay
      __typename
    }
    label
    createdAt
    updatedAt
    recommendationBadges
    generation {
      step
      status
      lastUpdatedAt
      failureCount
      lastFailureReason
      __typename
    }
    pendingMigration
    viatorProducts {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAttractionSubscriptionVariables,
  APITypes.OnUpdateAttractionSubscription
>;
export const onPutAttractionSwipeByTripIdByDestinationId = /* GraphQL */ `subscription OnPutAttractionSwipeByTripIdByDestinationId(
  $tripId: ID!
  $destinationId: ID!
) {
  onPutAttractionSwipeByTripIdByDestinationId(
    tripId: $tripId
    destinationId: $destinationId
  ) {
    userId
    user {
      id
      appleId
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      googleId
      location
      name
      phone
      privacy
      pushNotifications
      referralLink
      username
      createdAt
      updatedAt
      __typename
    }
    tripId
    destinationId
    destination {
      id
      authorId
      name
      icon
      timezone
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      state
      country
      continent
      deletedAt
      isTravaCreated
      googlePlaceId
      featured
      altName
      label
      pendingMigration
      createdAt
      updatedAt
      __typename
    }
    attractionId
    attraction {
      id
      attractionCategories
      attractionCuisine
      attractionTargetGroups
      authorId
      authorType
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
      label
      createdAt
      updatedAt
      recommendationBadges
      pendingMigration
      __typename
    }
    swipe
    label
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPutAttractionSwipeByTripIdByDestinationIdSubscriptionVariables,
  APITypes.OnPutAttractionSwipeByTripIdByDestinationIdSubscription
>;
