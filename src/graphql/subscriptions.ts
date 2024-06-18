/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($tripId: ID!) {
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
      }
      text
      system
      image {
        bucket
        region
        key
        googlePhotoReference
      }
      sent
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserTrip = /* GraphQL */ `
  subscription OnDeleteUserTrip($userId: ID!) {
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
      }
      tripId
      trip {
        id
        name
        completed
        link
        createdAt
        updatedAt
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
      }
      inviteLink
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserTripByTripId = /* GraphQL */ `
  subscription OnCreateUserTripByTripId($tripId: ID!) {
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
      }
      tripId
      trip {
        id
        name
        completed
        link
        createdAt
        updatedAt
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
      }
      inviteLink
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserTripByTripId = /* GraphQL */ `
  subscription OnDeleteUserTripByTripId($tripId: ID!) {
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
      }
      tripId
      trip {
        id
        name
        completed
        link
        createdAt
        updatedAt
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
      }
      inviteLink
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTripDestinationUserByTripId = /* GraphQL */ `
  subscription OnUpdateTripDestinationUserByTripId($tripId: ID!) {
    onUpdateTripDestinationUserByTripId(tripId: $tripId) {
      tripId
      destinationId
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
      }
      isReady
      tripPlanViewedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTripDestinationByTripId = /* GraphQL */ `
  subscription OnUpdateTripDestinationByTripId($tripId: ID!) {
    onUpdateTripDestinationByTripId(tripId: $tripId) {
      tripId
      destinationId
      attractionSwipes {
        nextToken
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
      }
      startDate
      endDate
      startTime
      endTime
      tripPlan {
        dayOfYear
      }
      tripDestinationUsers {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTripDestination = /* GraphQL */ `
  subscription OnCreateTripDestination($tripId: ID!) {
    onCreateTripDestination(tripId: $tripId) {
      tripId
      destinationId
      attractionSwipes {
        nextToken
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
      }
      startDate
      endDate
      startTime
      endTime
      tripPlan {
        dayOfYear
      }
      tripDestinationUsers {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTripDestination = /* GraphQL */ `
  subscription OnDeleteTripDestination($tripId: ID!) {
    onDeleteTripDestination(tripId: $tripId) {
      tripId
      destinationId
      attractionSwipes {
        nextToken
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
      }
      startDate
      endDate
      startTime
      endTime
      tripPlan {
        dayOfYear
      }
      tripDestinationUsers {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFeatureFlag = /* GraphQL */ `
  subscription OnUpdateFeatureFlag($id: FeatureFlagName!) {
    onUpdateFeatureFlag(id: $id) {
      id
      isEnabled
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAttraction = /* GraphQL */ `
  subscription OnUpdateAttraction($id: ID!) {
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
      }
      destinationId
      duration
      images {
        bucket
        region
        key
        googlePhotoReference
      }
      reservation
      locations {
        id
        displayOrder
        deleted
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
      }
      pendingMigration
    }
  }
`;
export const onPutAttractionSwipeByTripIdByDestinationId = /* GraphQL */ `
  subscription OnPutAttractionSwipeByTripIdByDestinationId(
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
      }
      swipe
      label
      createdAt
      updatedAt
    }
  }
`;
