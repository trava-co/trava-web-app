/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const federatedSignUp = /* GraphQL */ `mutation FederatedSignUp($input: FederatedSignUpInput) {
  federatedSignUp(input: $input) {
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FederatedSignUpMutationVariables,
  APITypes.FederatedSignUpMutation
>;
export const signOut = /* GraphQL */ `mutation SignOut($input: SignOutInput!) {
  signOut(input: $input) {
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignOutMutationVariables,
  APITypes.SignOutMutation
>;
export const settingsSendReport = /* GraphQL */ `mutation SettingsSendReport($input: SettingsSendReportInput!) {
  settingsSendReport(input: $input) {
    messageId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SettingsSendReportMutationVariables,
  APITypes.SettingsSendReportMutation
>;
export const createTrip = /* GraphQL */ `mutation CreateTrip($input: CustomCreateTripInput!) {
  createTrip(input: $input) {
    id
    name
    tripDestinations {
      nextToken
      __typename
    }
    members {
      nextToken
      __typename
    }
    attractionSwipes {
      nextToken
      __typename
    }
    attractionSwipesByUser {
      nextToken
      __typename
    }
    timelineEntries {
      nextToken
      __typename
    }
    completed
    messages {
      nextToken
      __typename
    }
    link
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTripMutationVariables,
  APITypes.CreateTripMutation
>;
export const updateTrip = /* GraphQL */ `mutation UpdateTrip($input: UpdateTripInput!) {
  updateTrip(input: $input) {
    id
    name
    tripDestinations {
      nextToken
      __typename
    }
    members {
      nextToken
      __typename
    }
    attractionSwipes {
      nextToken
      __typename
    }
    attractionSwipesByUser {
      nextToken
      __typename
    }
    timelineEntries {
      nextToken
      __typename
    }
    completed
    messages {
      nextToken
      __typename
    }
    link
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTripMutationVariables,
  APITypes.UpdateTripMutation
>;
export const createUserTrip = /* GraphQL */ `mutation CreateUserTrip($input: CreateUserTripInput!) {
  createUserTrip(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserTripMutationVariables,
  APITypes.CreateUserTripMutation
>;
export const updateUserTrip = /* GraphQL */ `mutation UpdateUserTrip($input: UpdateUserTripInput!) {
  updateUserTrip(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserTripMutationVariables,
  APITypes.UpdateUserTripMutation
>;
export const deleteUserTrip = /* GraphQL */ `mutation DeleteUserTrip($input: DeleteUserTripInput!) {
  deleteUserTrip(input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserTripMutationVariables,
  APITypes.DeleteUserTripMutation
>;
export const createTripDestination = /* GraphQL */ `mutation CreateTripDestination($input: CreateTripDestinationInput!) {
  createTripDestination(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTripDestinationMutationVariables,
  APITypes.CreateTripDestinationMutation
>;
export const updateTripDestination = /* GraphQL */ `mutation UpdateTripDestination($input: UpdateTripDestinationInput!) {
  updateTripDestination(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTripDestinationMutationVariables,
  APITypes.UpdateTripDestinationMutation
>;
export const deleteTripDestination = /* GraphQL */ `mutation DeleteTripDestination($input: DeleteTripDestinationInput!) {
  deleteTripDestination(input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTripDestinationMutationVariables,
  APITypes.DeleteTripDestinationMutation
>;
export const createUserFollow = /* GraphQL */ `mutation CreateUserFollow($input: CreateUserFollowInput!) {
  createUserFollow(input: $input) {
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
    followedUserId
    followedUser {
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
    approved
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserFollowMutationVariables,
  APITypes.CreateUserFollowMutation
>;
export const updateUserFollow = /* GraphQL */ `mutation UpdateUserFollow($input: UpdateUserFollowInput!) {
  updateUserFollow(input: $input) {
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
    followedUserId
    followedUser {
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
    approved
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserFollowMutationVariables,
  APITypes.UpdateUserFollowMutation
>;
export const createUserReferral = /* GraphQL */ `mutation CreateUserReferral($input: CreateUserReferralInput!) {
  createUserReferral(input: $input) {
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
    referredUserId
    referredUser {
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
    referralType
    sourceOS
    matchGuaranteed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserReferralMutationVariables,
  APITypes.CreateUserReferralMutation
>;
export const putAttractionSwipe = /* GraphQL */ `mutation PutAttractionSwipe($input: PutAttractionSwipeInput!) {
  putAttractionSwipe(input: $input) {
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
` as GeneratedMutation<
  APITypes.PutAttractionSwipeMutationVariables,
  APITypes.PutAttractionSwipeMutation
>;
export const adminCreateAttraction = /* GraphQL */ `mutation AdminCreateAttraction($input: CreateAttractionInput!) {
  adminCreateAttraction(input: $input) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AdminCreateAttractionMutationVariables,
  APITypes.AdminCreateAttractionMutation
>;
export const adminUpdateAttraction = /* GraphQL */ `mutation AdminUpdateAttraction($input: UpdateAttractionInput!) {
  adminUpdateAttraction(input: $input) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AdminUpdateAttractionMutationVariables,
  APITypes.AdminUpdateAttractionMutation
>;
export const createAttractionFromPlaceId = /* GraphQL */ `mutation CreateAttractionFromPlaceId(
  $input: CreateAttractionFromPlaceIdInput!
) {
  createAttractionFromPlaceId(input: $input) {
    existingAttractions {
      id
      name
      destinationName
      attractionCategories
      attractionCuisine
      bucketListCount
      isTravaCreated
      duration
      recommendationBadges
      type
      deletedAt
      outOfSeason
      __typename
    }
    createdAttraction {
      id
      name
      destinationName
      attractionCategories
      attractionCuisine
      bucketListCount
      isTravaCreated
      duration
      recommendationBadges
      type
      deletedAt
      outOfSeason
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAttractionFromPlaceIdMutationVariables,
  APITypes.CreateAttractionFromPlaceIdMutation
>;
export const deleteAttraction = /* GraphQL */ `mutation DeleteAttraction($input: CustomDeleteAttractionInput!) {
  deleteAttraction(input: $input) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAttractionMutationVariables,
  APITypes.DeleteAttractionMutation
>;
export const deleteUserByAdmin = /* GraphQL */ `mutation DeleteUserByAdmin($input: CustomDeleteUserInput!) {
  deleteUserByAdmin(input: $input) {
    id
    appleId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    dateOfBirth
    description
    email
    contactEmail
    facebookId
    fcmToken
    followedBy {
      nextToken
      __typename
    }
    follows {
      nextToken
      __typename
    }
    blocks {
      nextToken
      __typename
    }
    blockedBy {
      nextToken
      __typename
    }
    posts {
      nextToken
      __typename
    }
    viewedPosts {
      nextToken
      __typename
    }
    googleId
    location
    name
    phone
    privacy
    pushNotifications
    referralLink
    referrals {
      nextToken
      __typename
    }
    userFollowByMe {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    username
    userTrips {
      nextToken
      __typename
    }
    myCards {
      nextToken
      __typename
    }
    bucketList {
      nextToken
      __typename
    }
    likedPosts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserByAdminMutationVariables,
  APITypes.DeleteUserByAdminMutation
>;
export const deleteUserBySelf = /* GraphQL */ `mutation DeleteUserBySelf {
  deleteUserBySelf
}
` as GeneratedMutation<
  APITypes.DeleteUserBySelfMutationVariables,
  APITypes.DeleteUserBySelfMutation
>;
export const createTimelineEntryFlight = /* GraphQL */ `mutation CreateTimelineEntryFlight($input: CreateTimelineEntryFlightInput) {
  createTimelineEntryFlight(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTimelineEntryFlightMutationVariables,
  APITypes.CreateTimelineEntryFlightMutation
>;
export const createTimelineEntryRentalPickup = /* GraphQL */ `mutation CreateTimelineEntryRentalPickup(
  $input: CreateTimelineEntryRentalPickupInput!
) {
  createTimelineEntryRentalPickup(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTimelineEntryRentalPickupMutationVariables,
  APITypes.CreateTimelineEntryRentalPickupMutation
>;
export const createTimelineEntryRentalDropoff = /* GraphQL */ `mutation CreateTimelineEntryRentalDropoff(
  $input: CreateTimelineEntryRentalDropoffInput!
) {
  createTimelineEntryRentalDropoff(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTimelineEntryRentalDropoffMutationVariables,
  APITypes.CreateTimelineEntryRentalDropoffMutation
>;
export const createTimelineEntryLodgingArrival = /* GraphQL */ `mutation CreateTimelineEntryLodgingArrival(
  $input: CreateTimelineEntryLodgingArrivalInput!
) {
  createTimelineEntryLodgingArrival(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTimelineEntryLodgingArrivalMutationVariables,
  APITypes.CreateTimelineEntryLodgingArrivalMutation
>;
export const createTimelineEntryLodgingDeparture = /* GraphQL */ `mutation CreateTimelineEntryLodgingDeparture(
  $input: CreateTimelineEntryLodgingDepartureInput!
) {
  createTimelineEntryLodgingDeparture(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTimelineEntryLodgingDepartureMutationVariables,
  APITypes.CreateTimelineEntryLodgingDepartureMutation
>;
export const updateTimelineEntryFlight = /* GraphQL */ `mutation UpdateTimelineEntryFlight($input: UpdateTimelineEntryFlightInput!) {
  updateTimelineEntryFlight(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTimelineEntryFlightMutationVariables,
  APITypes.UpdateTimelineEntryFlightMutation
>;
export const updateTimelineEntryRentalPickup = /* GraphQL */ `mutation UpdateTimelineEntryRentalPickup(
  $input: UpdateTimelineEntryRentalPickupInput!
) {
  updateTimelineEntryRentalPickup(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTimelineEntryRentalPickupMutationVariables,
  APITypes.UpdateTimelineEntryRentalPickupMutation
>;
export const updateTimelineEntryRentalDropoff = /* GraphQL */ `mutation UpdateTimelineEntryRentalDropoff(
  $input: UpdateTimelineEntryRentalDropoffInput!
) {
  updateTimelineEntryRentalDropoff(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTimelineEntryRentalDropoffMutationVariables,
  APITypes.UpdateTimelineEntryRentalDropoffMutation
>;
export const updateTimelineEntryLodgingArrival = /* GraphQL */ `mutation UpdateTimelineEntryLodgingArrival(
  $input: UpdateTimelineEntryLodgingArrivalInput!
) {
  updateTimelineEntryLodgingArrival(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTimelineEntryLodgingArrivalMutationVariables,
  APITypes.UpdateTimelineEntryLodgingArrivalMutation
>;
export const updateTimelineEntryLodgingDeparture = /* GraphQL */ `mutation UpdateTimelineEntryLodgingDeparture(
  $input: UpdateTimelineEntryLodgingDepartureInput!
) {
  updateTimelineEntryLodgingDeparture(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTimelineEntryLodgingDepartureMutationVariables,
  APITypes.UpdateTimelineEntryLodgingDepartureMutation
>;
export const deleteTimelineEntry = /* GraphQL */ `mutation DeleteTimelineEntry($input: DeleteTimelineEntryInput!) {
  deleteTimelineEntry(input: $input) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTimelineEntryMutationVariables,
  APITypes.DeleteTimelineEntryMutation
>;
export const createDestination = /* GraphQL */ `mutation CreateDestination($input: CreateDestinationInput!) {
  createDestination(input: $input) {
    id
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
    name
    icon
    coverImage {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    timezone
    attractions {
      nextToken
      __typename
    }
    nearbyThingsToDoCount
    nearbyPlacesToEatCount
    nearbyTravaThingsToDoCount
    nearbyTravaPlacesToEatCount
    coords {
      long
      lat
      __typename
    }
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
}
` as GeneratedMutation<
  APITypes.CreateDestinationMutationVariables,
  APITypes.CreateDestinationMutation
>;
export const addRemoveFromBucketList = /* GraphQL */ `mutation AddRemoveFromBucketList($input: addRemoveFromBucketListInput!) {
  addRemoveFromBucketList(input: $input)
}
` as GeneratedMutation<
  APITypes.AddRemoveFromBucketListMutationVariables,
  APITypes.AddRemoveFromBucketListMutation
>;
export const createPost = /* GraphQL */ `mutation CreatePost($input: CustomCreatePostInput!) {
  createPost(input: $input)
}
` as GeneratedMutation<
  APITypes.CreatePostMutationVariables,
  APITypes.CreatePostMutation
>;
export const deletePost = /* GraphQL */ `mutation DeletePost($input: CustomDeletePostInput!) {
  deletePost(input: $input) {
    id
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
    description
    commentsCount
    comments {
      nextToken
      __typename
    }
    mediaType
    cloudinaryUrl
    width
    height
    format
    videoDuration
    createdAt
    updatedAt
    deletedAt
    likesCount
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePostMutationVariables,
  APITypes.DeletePostMutation
>;
export const likeDislikePost = /* GraphQL */ `mutation LikeDislikePost($input: likeDislikePostInput!) {
  likeDislikePost(input: $input)
}
` as GeneratedMutation<
  APITypes.LikeDislikePostMutationVariables,
  APITypes.LikeDislikePostMutation
>;
export const createComment = /* GraphQL */ `mutation CreateComment($input: CustomCreateComment!) {
  createComment(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateCommentMutationVariables,
  APITypes.CreateCommentMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    appleId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    dateOfBirth
    description
    email
    contactEmail
    facebookId
    fcmToken
    followedBy {
      nextToken
      __typename
    }
    follows {
      nextToken
      __typename
    }
    blocks {
      nextToken
      __typename
    }
    blockedBy {
      nextToken
      __typename
    }
    posts {
      nextToken
      __typename
    }
    viewedPosts {
      nextToken
      __typename
    }
    googleId
    location
    name
    phone
    privacy
    pushNotifications
    referralLink
    referrals {
      nextToken
      __typename
    }
    userFollowByMe {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    username
    userTrips {
      nextToken
      __typename
    }
    myCards {
      nextToken
      __typename
    }
    bucketList {
      nextToken
      __typename
    }
    likedPosts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const syncContacts = /* GraphQL */ `mutation SyncContacts($input: SyncContactsInput!) {
  syncContacts(input: $input)
}
` as GeneratedMutation<
  APITypes.SyncContactsMutationVariables,
  APITypes.SyncContactsMutation
>;
export const createTripMessageNotifications = /* GraphQL */ `mutation CreateTripMessageNotifications(
  $input: CreateTripMessageNotificationsInput!
) {
  createTripMessageNotifications(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateTripMessageNotificationsMutationVariables,
  APITypes.CreateTripMessageNotificationsMutation
>;
export const teaRexCreateEntity = /* GraphQL */ `mutation TeaRexCreateEntity($input: TeaRexCreateEntityInput!) {
  teaRexCreateEntity(input: $input)
}
` as GeneratedMutation<
  APITypes.TeaRexCreateEntityMutationVariables,
  APITypes.TeaRexCreateEntityMutation
>;
export const teaRexDeleteEntity = /* GraphQL */ `mutation TeaRexDeleteEntity($input: TeaRexDeleteEntityInput!) {
  teaRexDeleteEntity(input: $input)
}
` as GeneratedMutation<
  APITypes.TeaRexDeleteEntityMutationVariables,
  APITypes.TeaRexDeleteEntityMutation
>;
export const teaRexCreateEvent = /* GraphQL */ `mutation TeaRexCreateEvent($input: TeaRexCreateEventInput!) {
  teaRexCreateEvent(input: $input)
}
` as GeneratedMutation<
  APITypes.TeaRexCreateEventMutationVariables,
  APITypes.TeaRexCreateEventMutation
>;
export const teaRexDeleteEvent = /* GraphQL */ `mutation TeaRexDeleteEvent($input: TeaRexDeleteEventInput!) {
  teaRexDeleteEvent(input: $input)
}
` as GeneratedMutation<
  APITypes.TeaRexDeleteEventMutationVariables,
  APITypes.TeaRexDeleteEventMutation
>;
export const createUserBlock = /* GraphQL */ `mutation CreateUserBlock($input: CreateUserBlockInput!) {
  createUserBlock(input: $input) {
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
    blockedUserId
    blockedUser {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserBlockMutationVariables,
  APITypes.CreateUserBlockMutation
>;
export const uploadToCloudinary = /* GraphQL */ `mutation UploadToCloudinary($input: UploadToCloudinaryInput!) {
  uploadToCloudinary(input: $input) {
    cloudinaryUrl
    videoDuration
    width
    height
    format
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UploadToCloudinaryMutationVariables,
  APITypes.UploadToCloudinaryMutation
>;
export const tableMigration = /* GraphQL */ `mutation TableMigration($input: TableMigrationInput!) {
  tableMigration(input: $input) {
    mainTableResult {
      success
      fail
      skipped
      remaining
      __typename
    }
    imageResult {
      success
      fail
      skipped
      remaining
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.TableMigrationMutationVariables,
  APITypes.TableMigrationMutation
>;
export const migrateSingleAttraction = /* GraphQL */ `mutation MigrateSingleAttraction($input: MigrateSingleAttractionInput!) {
  migrateSingleAttraction(input: $input) {
    mainTableResult {
      success
      fail
      skipped
      remaining
      __typename
    }
    imageResult {
      success
      fail
      skipped
      remaining
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.MigrateSingleAttractionMutationVariables,
  APITypes.MigrateSingleAttractionMutation
>;
export const addMigrationFlag = /* GraphQL */ `mutation AddMigrationFlag($input: AddMigrationFlagInput!) {
  addMigrationFlag(input: $input) {
    success
    fail
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AddMigrationFlagMutationVariables,
  APITypes.AddMigrationFlagMutation
>;
export const updateGoogleAPIKey = /* GraphQL */ `mutation UpdateGoogleAPIKey($input: UpdateGoogleAPIKeyInput!) {
  updateGoogleAPIKey(input: $input) {
    envsUpdated
    envsFailed
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGoogleAPIKeyMutationVariables,
  APITypes.UpdateGoogleAPIKeyMutation
>;
export const privateCreateAttraction = /* GraphQL */ `mutation PrivateCreateAttraction(
  $input: CreateAttractionInput!
  $condition: ModelAttractionConditionInput
) {
  privateCreateAttraction(input: $input, condition: $condition) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateAttractionMutationVariables,
  APITypes.PrivateCreateAttractionMutation
>;
export const privateUpdateAttraction = /* GraphQL */ `mutation PrivateUpdateAttraction(
  $input: UpdateAttractionInput!
  $condition: ModelAttractionConditionInput
) {
  privateUpdateAttraction(input: $input, condition: $condition) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateAttractionMutationVariables,
  APITypes.PrivateUpdateAttractionMutation
>;
export const privateCreateAttractionSwipe = /* GraphQL */ `mutation PrivateCreateAttractionSwipe(
  $input: CreateAttractionSwipeInput!
  $condition: ModelAttractionSwipeConditionInput
) {
  privateCreateAttractionSwipe(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateCreateAttractionSwipeMutationVariables,
  APITypes.PrivateCreateAttractionSwipeMutation
>;
export const privateUpdateAttractionSwipe = /* GraphQL */ `mutation PrivateUpdateAttractionSwipe(
  $input: UpdateAttractionSwipeInput!
  $condition: ModelAttractionSwipeConditionInput
) {
  privateUpdateAttractionSwipe(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateUpdateAttractionSwipeMutationVariables,
  APITypes.PrivateUpdateAttractionSwipeMutation
>;
export const privateDeleteAttractionSwipe = /* GraphQL */ `mutation PrivateDeleteAttractionSwipe(
  $input: DeleteAttractionSwipeInput!
  $condition: ModelAttractionSwipeConditionInput
) {
  privateDeleteAttractionSwipe(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateDeleteAttractionSwipeMutationVariables,
  APITypes.PrivateDeleteAttractionSwipeMutation
>;
export const privateCreateDestination = /* GraphQL */ `mutation PrivateCreateDestination(
  $input: CreateDestinationInput!
  $condition: ModelDestinationConditionInput
) {
  privateCreateDestination(input: $input, condition: $condition) {
    id
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
    name
    icon
    coverImage {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    timezone
    attractions {
      nextToken
      __typename
    }
    nearbyThingsToDoCount
    nearbyPlacesToEatCount
    nearbyTravaThingsToDoCount
    nearbyTravaPlacesToEatCount
    coords {
      long
      lat
      __typename
    }
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
}
` as GeneratedMutation<
  APITypes.PrivateCreateDestinationMutationVariables,
  APITypes.PrivateCreateDestinationMutation
>;
export const updateDestination = /* GraphQL */ `mutation UpdateDestination(
  $input: UpdateDestinationInput!
  $condition: ModelDestinationConditionInput
) {
  updateDestination(input: $input, condition: $condition) {
    id
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
    name
    icon
    coverImage {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    timezone
    attractions {
      nextToken
      __typename
    }
    nearbyThingsToDoCount
    nearbyPlacesToEatCount
    nearbyTravaThingsToDoCount
    nearbyTravaPlacesToEatCount
    coords {
      long
      lat
      __typename
    }
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
}
` as GeneratedMutation<
  APITypes.UpdateDestinationMutationVariables,
  APITypes.UpdateDestinationMutation
>;
export const privateCreateDistance = /* GraphQL */ `mutation PrivateCreateDistance(
  $input: CreateDistanceInput!
  $condition: ModelDistanceConditionInput
) {
  privateCreateDistance(input: $input, condition: $condition) {
    key
    value
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateDistanceMutationVariables,
  APITypes.PrivateCreateDistanceMutation
>;
export const privateUpdateFeatureFlag = /* GraphQL */ `mutation PrivateUpdateFeatureFlag(
  $input: UpdateFeatureFlagInput!
  $condition: ModelFeatureFlagConditionInput
) {
  privateUpdateFeatureFlag(input: $input, condition: $condition) {
    id
    isEnabled
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateFeatureFlagMutationVariables,
  APITypes.PrivateUpdateFeatureFlagMutation
>;
export const privateCreateGooglePlace = /* GraphQL */ `mutation PrivateCreateGooglePlace(
  $input: CreateGooglePlaceInput!
  $condition: ModelGooglePlaceConditionInput
) {
  privateCreateGooglePlace(input: $input, condition: $condition) {
    id
    isValid
    data {
      city
      state
      country
      continent
      name
      formattedAddress
      googlePlacePageLink
      websiteLink
      phone
      businessStatus
      reservable
      price
      editorialSummary
      types
      __typename
    }
    consecutiveFailedRequests
    dataLastCheckedAt
    dataLastUpdatedAt
    webData {
      menuLink
      reservationLink
      bestVisitedByPopularTimes
      __typename
    }
    yelpData {
      id
      url
      price
      categories
      __typename
    }
    generatedSummary
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateGooglePlaceMutationVariables,
  APITypes.PrivateCreateGooglePlaceMutation
>;
export const privateUpdateGooglePlace = /* GraphQL */ `mutation PrivateUpdateGooglePlace(
  $input: UpdateGooglePlaceInput!
  $condition: ModelGooglePlaceConditionInput
) {
  privateUpdateGooglePlace(input: $input, condition: $condition) {
    id
    isValid
    data {
      city
      state
      country
      continent
      name
      formattedAddress
      googlePlacePageLink
      websiteLink
      phone
      businessStatus
      reservable
      price
      editorialSummary
      types
      __typename
    }
    consecutiveFailedRequests
    dataLastCheckedAt
    dataLastUpdatedAt
    webData {
      menuLink
      reservationLink
      bestVisitedByPopularTimes
      __typename
    }
    yelpData {
      id
      url
      price
      categories
      __typename
    }
    generatedSummary
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateGooglePlaceMutationVariables,
  APITypes.PrivateUpdateGooglePlaceMutation
>;
export const createMessage = /* GraphQL */ `mutation CreateMessage(
  $input: CreateMessageInput!
  $condition: ModelMessageConditionInput
) {
  createMessage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const updateMessage = /* GraphQL */ `mutation UpdateMessage(
  $input: UpdateMessageInput!
  $condition: ModelMessageConditionInput
) {
  updateMessage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMessageMutationVariables,
  APITypes.UpdateMessageMutation
>;
export const deleteMessage = /* GraphQL */ `mutation DeleteMessage(
  $input: DeleteMessageInput!
  $condition: ModelMessageConditionInput
) {
  deleteMessage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMessageMutationVariables,
  APITypes.DeleteMessageMutation
>;
export const privateUpdateMinimumVersion = /* GraphQL */ `mutation PrivateUpdateMinimumVersion(
  $input: UpdateMinimumVersionInput!
  $condition: ModelMinimumVersionConditionInput
) {
  privateUpdateMinimumVersion(input: $input, condition: $condition) {
    id
    minimumVersion
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateMinimumVersionMutationVariables,
  APITypes.PrivateUpdateMinimumVersionMutation
>;
export const createNotification = /* GraphQL */ `mutation CreateNotification(
  $input: CreateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  createNotification(input: $input, condition: $condition) {
    id
    receiverUserId
    senderUser {
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
    senderUserId
    type
    text
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
    postId
    post {
      id
      userId
      tripId
      destinationId
      attractionId
      description
      commentsCount
      mediaType
      cloudinaryUrl
      width
      height
      format
      videoDuration
      createdAt
      updatedAt
      deletedAt
      likesCount
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
    commentId
    comment {
      id
      postId
      userId
      text
      createdAt
      updatedAt
      __typename
    }
    showInApp
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNotificationMutationVariables,
  APITypes.CreateNotificationMutation
>;
export const updateNotification = /* GraphQL */ `mutation UpdateNotification(
  $input: UpdateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  updateNotification(input: $input, condition: $condition) {
    id
    receiverUserId
    senderUser {
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
    senderUserId
    type
    text
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
    postId
    post {
      id
      userId
      tripId
      destinationId
      attractionId
      description
      commentsCount
      mediaType
      cloudinaryUrl
      width
      height
      format
      videoDuration
      createdAt
      updatedAt
      deletedAt
      likesCount
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
    commentId
    comment {
      id
      postId
      userId
      text
      createdAt
      updatedAt
      __typename
    }
    showInApp
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNotificationMutationVariables,
  APITypes.UpdateNotificationMutation
>;
export const deleteNotification = /* GraphQL */ `mutation DeleteNotification(
  $input: DeleteNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  deleteNotification(input: $input, condition: $condition) {
    id
    receiverUserId
    senderUser {
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
    senderUserId
    type
    text
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
    postId
    post {
      id
      userId
      tripId
      destinationId
      attractionId
      description
      commentsCount
      mediaType
      cloudinaryUrl
      width
      height
      format
      videoDuration
      createdAt
      updatedAt
      deletedAt
      likesCount
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
    commentId
    comment {
      id
      postId
      userId
      text
      createdAt
      updatedAt
      __typename
    }
    showInApp
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNotificationMutationVariables,
  APITypes.DeleteNotificationMutation
>;
export const createPhotographer = /* GraphQL */ `mutation CreatePhotographer(
  $input: CreatePhotographerInput!
  $condition: ModelPhotographerConditionInput
) {
  createPhotographer(input: $input, condition: $condition) {
    id
    name
    url
    pendingMigration
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePhotographerMutationVariables,
  APITypes.CreatePhotographerMutation
>;
export const updatePhotographer = /* GraphQL */ `mutation UpdatePhotographer(
  $input: UpdatePhotographerInput!
  $condition: ModelPhotographerConditionInput
) {
  updatePhotographer(input: $input, condition: $condition) {
    id
    name
    url
    pendingMigration
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePhotographerMutationVariables,
  APITypes.UpdatePhotographerMutation
>;
export const deletePhotographer = /* GraphQL */ `mutation DeletePhotographer(
  $input: DeletePhotographerInput!
  $condition: ModelPhotographerConditionInput
) {
  deletePhotographer(input: $input, condition: $condition) {
    id
    name
    url
    pendingMigration
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePhotographerMutationVariables,
  APITypes.DeletePhotographerMutation
>;
export const privateCreatePost = /* GraphQL */ `mutation PrivateCreatePost(
  $input: CreatePostInput!
  $condition: ModelPostConditionInput
) {
  privateCreatePost(input: $input, condition: $condition) {
    id
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
    description
    commentsCount
    comments {
      nextToken
      __typename
    }
    mediaType
    cloudinaryUrl
    width
    height
    format
    videoDuration
    createdAt
    updatedAt
    deletedAt
    likesCount
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreatePostMutationVariables,
  APITypes.PrivateCreatePostMutation
>;
export const privateUpdatePost = /* GraphQL */ `mutation PrivateUpdatePost(
  $input: UpdatePostInput!
  $condition: ModelPostConditionInput
) {
  privateUpdatePost(input: $input, condition: $condition) {
    id
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
    description
    commentsCount
    comments {
      nextToken
      __typename
    }
    mediaType
    cloudinaryUrl
    width
    height
    format
    videoDuration
    createdAt
    updatedAt
    deletedAt
    likesCount
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdatePostMutationVariables,
  APITypes.PrivateUpdatePostMutation
>;
export const privateCreateTimelineEntry = /* GraphQL */ `mutation PrivateCreateTimelineEntry(
  $input: CreateTimelineEntryInput!
  $condition: ModelTimelineEntryConditionInput
) {
  privateCreateTimelineEntry(input: $input, condition: $condition) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateTimelineEntryMutationVariables,
  APITypes.PrivateCreateTimelineEntryMutation
>;
export const privateUpdateTimelineEntry = /* GraphQL */ `mutation PrivateUpdateTimelineEntry(
  $input: UpdateTimelineEntryInput!
  $condition: ModelTimelineEntryConditionInput
) {
  privateUpdateTimelineEntry(input: $input, condition: $condition) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateTimelineEntryMutationVariables,
  APITypes.PrivateUpdateTimelineEntryMutation
>;
export const privateDeleteTimelineEntry = /* GraphQL */ `mutation PrivateDeleteTimelineEntry(
  $input: DeleteTimelineEntryInput!
  $condition: ModelTimelineEntryConditionInput
) {
  privateDeleteTimelineEntry(input: $input, condition: $condition) {
    id
    tripId
    members {
      nextToken
      __typename
    }
    timelineEntryType
    notes
    date
    time
    flightDetails {
      __typename
    }
    rentalPickupLocation
    rentalDropoffLocation
    lodgingArrivalNameAndAddress
    lodgingDepartureNameAndAddress
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateDeleteTimelineEntryMutationVariables,
  APITypes.PrivateDeleteTimelineEntryMutation
>;
export const privateCreateTimelineEntryMember = /* GraphQL */ `mutation PrivateCreateTimelineEntryMember(
  $input: CreateTimelineEntryMemberInput!
  $condition: ModelTimelineEntryMemberConditionInput
) {
  privateCreateTimelineEntryMember(input: $input, condition: $condition) {
    timelineEntryId
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateTimelineEntryMemberMutationVariables,
  APITypes.PrivateCreateTimelineEntryMemberMutation
>;
export const privateDeleteTimelineEntryMember = /* GraphQL */ `mutation PrivateDeleteTimelineEntryMember(
  $input: DeleteTimelineEntryMemberInput!
  $condition: ModelTimelineEntryMemberConditionInput
) {
  privateDeleteTimelineEntryMember(input: $input, condition: $condition) {
    timelineEntryId
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateDeleteTimelineEntryMemberMutationVariables,
  APITypes.PrivateDeleteTimelineEntryMemberMutation
>;
export const privateCreateTrip = /* GraphQL */ `mutation PrivateCreateTrip(
  $input: CreateTripInput!
  $condition: ModelTripConditionInput
) {
  privateCreateTrip(input: $input, condition: $condition) {
    id
    name
    tripDestinations {
      nextToken
      __typename
    }
    members {
      nextToken
      __typename
    }
    attractionSwipes {
      nextToken
      __typename
    }
    attractionSwipesByUser {
      nextToken
      __typename
    }
    timelineEntries {
      nextToken
      __typename
    }
    completed
    messages {
      nextToken
      __typename
    }
    link
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateTripMutationVariables,
  APITypes.PrivateCreateTripMutation
>;
export const privateUpdateTrip = /* GraphQL */ `mutation PrivateUpdateTrip(
  $input: UpdateTripInput!
  $condition: ModelTripConditionInput
) {
  privateUpdateTrip(input: $input, condition: $condition) {
    id
    name
    tripDestinations {
      nextToken
      __typename
    }
    members {
      nextToken
      __typename
    }
    attractionSwipes {
      nextToken
      __typename
    }
    attractionSwipesByUser {
      nextToken
      __typename
    }
    timelineEntries {
      nextToken
      __typename
    }
    completed
    messages {
      nextToken
      __typename
    }
    link
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateTripMutationVariables,
  APITypes.PrivateUpdateTripMutation
>;
export const privateCreateTripDestination = /* GraphQL */ `mutation PrivateCreateTripDestination(
  $input: CreateTripDestinationInput!
  $condition: ModelTripDestinationConditionInput
) {
  privateCreateTripDestination(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateCreateTripDestinationMutationVariables,
  APITypes.PrivateCreateTripDestinationMutation
>;
export const privateUpdateTripDestination = /* GraphQL */ `mutation PrivateUpdateTripDestination(
  $input: UpdateTripDestinationInput!
  $condition: ModelTripDestinationConditionInput
) {
  privateUpdateTripDestination(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateUpdateTripDestinationMutationVariables,
  APITypes.PrivateUpdateTripDestinationMutation
>;
export const privateDeleteTripDestination = /* GraphQL */ `mutation PrivateDeleteTripDestination(
  $input: DeleteTripDestinationInput!
  $condition: ModelTripDestinationConditionInput
) {
  privateDeleteTripDestination(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateDeleteTripDestinationMutationVariables,
  APITypes.PrivateDeleteTripDestinationMutation
>;
export const privateCreateTripDestinationUser = /* GraphQL */ `mutation PrivateCreateTripDestinationUser(
  $input: CreateTripDestinationUserInput!
  $condition: ModelTripDestinationUserConditionInput
) {
  privateCreateTripDestinationUser(input: $input, condition: $condition) {
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
      __typename
    }
    isReady
    tripPlanViewedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateTripDestinationUserMutationVariables,
  APITypes.PrivateCreateTripDestinationUserMutation
>;
export const updateTripDestinationUser = /* GraphQL */ `mutation UpdateTripDestinationUser(
  $input: UpdateTripDestinationUserInput!
  $condition: ModelTripDestinationUserConditionInput
) {
  updateTripDestinationUser(input: $input, condition: $condition) {
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
      __typename
    }
    isReady
    tripPlanViewedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTripDestinationUserMutationVariables,
  APITypes.UpdateTripDestinationUserMutation
>;
export const privateDeleteTripDestinationUser = /* GraphQL */ `mutation PrivateDeleteTripDestinationUser(
  $input: DeleteTripDestinationUserInput!
  $condition: ModelTripDestinationUserConditionInput
) {
  privateDeleteTripDestinationUser(input: $input, condition: $condition) {
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
      __typename
    }
    isReady
    tripPlanViewedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateDeleteTripDestinationUserMutationVariables,
  APITypes.PrivateDeleteTripDestinationUserMutation
>;
export const createTripPlanLog = /* GraphQL */ `mutation CreateTripPlanLog(
  $input: CreateTripPlanLogInput!
  $condition: ModelTripPlanLogConditionInput
) {
  createTripPlanLog(input: $input, condition: $condition) {
    tripPlan {
      dayOfYear
      __typename
    }
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTripPlanLogMutationVariables,
  APITypes.CreateTripPlanLogMutation
>;
export const privateCreateUpdate = /* GraphQL */ `mutation PrivateCreateUpdate(
  $input: CreateUpdateInput!
  $condition: ModelUpdateConditionInput
) {
  privateCreateUpdate(input: $input, condition: $condition) {
    type
    parityLastProcessed
    createdAt
    updatedAt
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateUpdateMutationVariables,
  APITypes.PrivateCreateUpdateMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    appleId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    dateOfBirth
    description
    email
    contactEmail
    facebookId
    fcmToken
    followedBy {
      nextToken
      __typename
    }
    follows {
      nextToken
      __typename
    }
    blocks {
      nextToken
      __typename
    }
    blockedBy {
      nextToken
      __typename
    }
    posts {
      nextToken
      __typename
    }
    viewedPosts {
      nextToken
      __typename
    }
    googleId
    location
    name
    phone
    privacy
    pushNotifications
    referralLink
    referrals {
      nextToken
      __typename
    }
    userFollowByMe {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    username
    userTrips {
      nextToken
      __typename
    }
    myCards {
      nextToken
      __typename
    }
    bucketList {
      nextToken
      __typename
    }
    likedPosts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const privateUpdateUser = /* GraphQL */ `mutation PrivateUpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  privateUpdateUser(input: $input, condition: $condition) {
    id
    appleId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    dateOfBirth
    description
    email
    contactEmail
    facebookId
    fcmToken
    followedBy {
      nextToken
      __typename
    }
    follows {
      nextToken
      __typename
    }
    blocks {
      nextToken
      __typename
    }
    blockedBy {
      nextToken
      __typename
    }
    posts {
      nextToken
      __typename
    }
    viewedPosts {
      nextToken
      __typename
    }
    googleId
    location
    name
    phone
    privacy
    pushNotifications
    referralLink
    referrals {
      nextToken
      __typename
    }
    userFollowByMe {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    username
    userTrips {
      nextToken
      __typename
    }
    myCards {
      nextToken
      __typename
    }
    bucketList {
      nextToken
      __typename
    }
    likedPosts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateUserMutationVariables,
  APITypes.PrivateUpdateUserMutation
>;
export const privateDeleteUser = /* GraphQL */ `mutation PrivateDeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  privateDeleteUser(input: $input, condition: $condition) {
    id
    appleId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
    }
    dateOfBirth
    description
    email
    contactEmail
    facebookId
    fcmToken
    followedBy {
      nextToken
      __typename
    }
    follows {
      nextToken
      __typename
    }
    blocks {
      nextToken
      __typename
    }
    blockedBy {
      nextToken
      __typename
    }
    posts {
      nextToken
      __typename
    }
    viewedPosts {
      nextToken
      __typename
    }
    googleId
    location
    name
    phone
    privacy
    pushNotifications
    referralLink
    referrals {
      nextToken
      __typename
    }
    userFollowByMe {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    username
    userTrips {
      nextToken
      __typename
    }
    myCards {
      nextToken
      __typename
    }
    bucketList {
      nextToken
      __typename
    }
    likedPosts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateDeleteUserMutationVariables,
  APITypes.PrivateDeleteUserMutation
>;
export const privateCreateUserBlock = /* GraphQL */ `mutation PrivateCreateUserBlock(
  $input: CreateUserBlockInput!
  $condition: ModelUserBlockConditionInput
) {
  privateCreateUserBlock(input: $input, condition: $condition) {
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
    blockedUserId
    blockedUser {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateUserBlockMutationVariables,
  APITypes.PrivateCreateUserBlockMutation
>;
export const updateUserBlock = /* GraphQL */ `mutation UpdateUserBlock(
  $input: UpdateUserBlockInput!
  $condition: ModelUserBlockConditionInput
) {
  updateUserBlock(input: $input, condition: $condition) {
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
    blockedUserId
    blockedUser {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserBlockMutationVariables,
  APITypes.UpdateUserBlockMutation
>;
export const deleteUserBlock = /* GraphQL */ `mutation DeleteUserBlock(
  $input: DeleteUserBlockInput!
  $condition: ModelUserBlockConditionInput
) {
  deleteUserBlock(input: $input, condition: $condition) {
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
    blockedUserId
    blockedUser {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserBlockMutationVariables,
  APITypes.DeleteUserBlockMutation
>;
export const privateCreateUserContact = /* GraphQL */ `mutation PrivateCreateUserContact(
  $input: CreateUserContactInput!
  $condition: ModelUserContactConditionInput
) {
  privateCreateUserContact(input: $input, condition: $condition) {
    userId
    recordId
    travaUserIds
    name
    email
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateUserContactMutationVariables,
  APITypes.PrivateCreateUserContactMutation
>;
export const privateUpdateUserContact = /* GraphQL */ `mutation PrivateUpdateUserContact(
  $input: UpdateUserContactInput!
  $condition: ModelUserContactConditionInput
) {
  privateUpdateUserContact(input: $input, condition: $condition) {
    userId
    recordId
    travaUserIds
    name
    email
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateUserContactMutationVariables,
  APITypes.PrivateUpdateUserContactMutation
>;
export const privateDeleteUserContact = /* GraphQL */ `mutation PrivateDeleteUserContact(
  $input: DeleteUserContactInput!
  $condition: ModelUserContactConditionInput
) {
  privateDeleteUserContact(input: $input, condition: $condition) {
    userId
    recordId
    travaUserIds
    name
    email
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateDeleteUserContactMutationVariables,
  APITypes.PrivateDeleteUserContactMutation
>;
export const privateCreateUserFollow = /* GraphQL */ `mutation PrivateCreateUserFollow(
  $input: CreateUserFollowInput!
  $condition: ModelUserFollowConditionInput
) {
  privateCreateUserFollow(input: $input, condition: $condition) {
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
    followedUserId
    followedUser {
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
    approved
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateUserFollowMutationVariables,
  APITypes.PrivateCreateUserFollowMutation
>;
export const privateUpdateUserFollow = /* GraphQL */ `mutation PrivateUpdateUserFollow(
  $input: UpdateUserFollowInput!
  $condition: ModelUserFollowConditionInput
) {
  privateUpdateUserFollow(input: $input, condition: $condition) {
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
    followedUserId
    followedUser {
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
    approved
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateUpdateUserFollowMutationVariables,
  APITypes.PrivateUpdateUserFollowMutation
>;
export const deleteUserFollow = /* GraphQL */ `mutation DeleteUserFollow(
  $input: DeleteUserFollowInput!
  $condition: ModelUserFollowConditionInput
) {
  deleteUserFollow(input: $input, condition: $condition) {
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
    followedUserId
    followedUser {
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
    approved
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserFollowMutationVariables,
  APITypes.DeleteUserFollowMutation
>;
export const createUserPost = /* GraphQL */ `mutation CreateUserPost(
  $input: CreateUserPostInput!
  $condition: ModelUserPostConditionInput
) {
  createUserPost(input: $input, condition: $condition) {
    userId
    postId
    post {
      id
      userId
      tripId
      destinationId
      attractionId
      description
      commentsCount
      mediaType
      cloudinaryUrl
      width
      height
      format
      videoDuration
      createdAt
      updatedAt
      deletedAt
      likesCount
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserPostMutationVariables,
  APITypes.CreateUserPostMutation
>;
export const privateCreateUserReferral = /* GraphQL */ `mutation PrivateCreateUserReferral(
  $input: CreateUserReferralInput!
  $condition: ModelUserReferralConditionInput
) {
  privateCreateUserReferral(input: $input, condition: $condition) {
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
    referredUserId
    referredUser {
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
    referralType
    sourceOS
    matchGuaranteed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PrivateCreateUserReferralMutationVariables,
  APITypes.PrivateCreateUserReferralMutation
>;
export const createUserSession = /* GraphQL */ `mutation CreateUserSession(
  $input: CreateUserSessionInput!
  $condition: ModelUserSessionConditionInput
) {
  createUserSession(input: $input, condition: $condition) {
    id
    userId
    deviceType
    appVersion
    label
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserSessionMutationVariables,
  APITypes.CreateUserSessionMutation
>;
export const privateCreateUserTrip = /* GraphQL */ `mutation PrivateCreateUserTrip(
  $input: CreateUserTripInput!
  $condition: ModelUserTripConditionInput
) {
  privateCreateUserTrip(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateCreateUserTripMutationVariables,
  APITypes.PrivateCreateUserTripMutation
>;
export const privateUpdateUserTrip = /* GraphQL */ `mutation PrivateUpdateUserTrip(
  $input: UpdateUserTripInput!
  $condition: ModelUserTripConditionInput
) {
  privateUpdateUserTrip(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateUpdateUserTripMutationVariables,
  APITypes.PrivateUpdateUserTripMutation
>;
export const privateDeleteUserTrip = /* GraphQL */ `mutation PrivateDeleteUserTrip(
  $input: DeleteUserTripInput!
  $condition: ModelUserTripConditionInput
) {
  privateDeleteUserTrip(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.PrivateDeleteUserTripMutationVariables,
  APITypes.PrivateDeleteUserTripMutation
>;
export const signUp = /* GraphQL */ `mutation SignUp($input: SignUpInput) {
  signUp(input: $input) {
    id
    destination
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignUpMutationVariables,
  APITypes.SignUpMutation
>;
