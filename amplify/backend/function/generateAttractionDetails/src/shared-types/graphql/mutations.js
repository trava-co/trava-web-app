"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMigrationFlag = exports.migrateSingleAttraction = exports.tableMigration = exports.uploadToCloudinary = exports.createUserBlock = exports.teaRexDeleteEvent = exports.teaRexCreateEvent = exports.teaRexDeleteEntity = exports.teaRexCreateEntity = exports.createTripMessageNotifications = exports.syncContacts = exports.updateUser = exports.createComment = exports.likeDislikePost = exports.deletePost = exports.createPost = exports.addRemoveFromBucketList = exports.createDestination = exports.deleteTimelineEntry = exports.updateTimelineEntryLodgingDeparture = exports.updateTimelineEntryLodgingArrival = exports.updateTimelineEntryRentalDropoff = exports.updateTimelineEntryRentalPickup = exports.updateTimelineEntryFlight = exports.createTimelineEntryLodgingDeparture = exports.createTimelineEntryLodgingArrival = exports.createTimelineEntryRentalDropoff = exports.createTimelineEntryRentalPickup = exports.createTimelineEntryFlight = exports.deleteUserBySelf = exports.deleteUserByAdmin = exports.deleteAttraction = exports.createAttractionFromPlaceId = exports.adminUpdateAttraction = exports.adminCreateAttraction = exports.putAttractionSwipe = exports.createUserReferral = exports.updateUserFollow = exports.createUserFollow = exports.deleteTripDestination = exports.updateTripDestination = exports.createTripDestination = exports.deleteUserTrip = exports.updateUserTrip = exports.createUserTrip = exports.updateTrip = exports.createTrip = exports.settingsSendReport = exports.signOut = exports.federatedSignUp = void 0;
exports.privateUpdateUserFollow = exports.privateCreateUserFollow = exports.privateDeleteUserContact = exports.privateUpdateUserContact = exports.privateCreateUserContact = exports.deleteUserBlock = exports.updateUserBlock = exports.privateCreateUserBlock = exports.privateDeleteUser = exports.privateUpdateUser = exports.createUser = exports.privateCreateUpdate = exports.createTripPlanLog = exports.privateDeleteTripDestinationUser = exports.updateTripDestinationUser = exports.privateCreateTripDestinationUser = exports.privateDeleteTripDestination = exports.privateUpdateTripDestination = exports.privateCreateTripDestination = exports.privateUpdateTrip = exports.privateCreateTrip = exports.privateDeleteTimelineEntryMember = exports.privateCreateTimelineEntryMember = exports.privateDeleteTimelineEntry = exports.privateUpdateTimelineEntry = exports.privateCreateTimelineEntry = exports.privateUpdatePost = exports.privateCreatePost = exports.deletePhotographer = exports.updatePhotographer = exports.createPhotographer = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.privateUpdateMinimumVersion = exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.privateUpdateGooglePlace = exports.privateCreateGooglePlace = exports.privateUpdateFeatureFlag = exports.privateCreateDistance = exports.updateDestination = exports.privateCreateDestination = exports.privateDeleteAttractionSwipe = exports.privateUpdateAttractionSwipe = exports.privateCreateAttractionSwipe = exports.privateUpdateAttraction = exports.privateCreateAttraction = exports.updateGoogleAPIKey = void 0;
exports.signUp = exports.privateDeleteUserTrip = exports.privateUpdateUserTrip = exports.privateCreateUserTrip = exports.createUserSession = exports.privateCreateUserReferral = exports.createUserPost = exports.deleteUserFollow = void 0;
exports.federatedSignUp = `
  mutation FederatedSignUp($input: FederatedSignUpInput) {
    federatedSignUp(input: $input) {
      id
    }
  }
`;
exports.signOut = `
  mutation SignOut($input: SignOutInput!) {
    signOut(input: $input) {
      id
    }
  }
`;
exports.settingsSendReport = `
  mutation SettingsSendReport($input: SettingsSendReportInput!) {
    settingsSendReport(input: $input) {
      messageId
    }
  }
`;
exports.createTrip = `
  mutation CreateTrip($input: CustomCreateTripInput!) {
    createTrip(input: $input) {
      id
      name
      tripDestinations {
        nextToken
      }
      members {
        nextToken
      }
      attractionSwipes {
        nextToken
      }
      attractionSwipesByUser {
        nextToken
      }
      timelineEntries {
        nextToken
      }
      completed
      messages {
        nextToken
      }
      link
      createdAt
      updatedAt
    }
  }
`;
exports.updateTrip = `
  mutation UpdateTrip($input: UpdateTripInput!) {
    updateTrip(input: $input) {
      id
      name
      tripDestinations {
        nextToken
      }
      members {
        nextToken
      }
      attractionSwipes {
        nextToken
      }
      attractionSwipesByUser {
        nextToken
      }
      timelineEntries {
        nextToken
      }
      completed
      messages {
        nextToken
      }
      link
      createdAt
      updatedAt
    }
  }
`;
exports.createUserTrip = `
  mutation CreateUserTrip($input: CreateUserTripInput!) {
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
exports.updateUserTrip = `
  mutation UpdateUserTrip($input: UpdateUserTripInput!) {
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
exports.deleteUserTrip = `
  mutation DeleteUserTrip($input: DeleteUserTripInput!) {
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
exports.createTripDestination = `
  mutation CreateTripDestination($input: CreateTripDestinationInput!) {
    createTripDestination(input: $input) {
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
exports.updateTripDestination = `
  mutation UpdateTripDestination($input: UpdateTripDestinationInput!) {
    updateTripDestination(input: $input) {
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
exports.deleteTripDestination = `
  mutation DeleteTripDestination($input: DeleteTripDestinationInput!) {
    deleteTripDestination(input: $input) {
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
exports.createUserFollow = `
  mutation CreateUserFollow($input: CreateUserFollowInput!) {
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
      }
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.updateUserFollow = `
  mutation UpdateUserFollow($input: UpdateUserFollowInput!) {
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
      }
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.createUserReferral = `
  mutation CreateUserReferral($input: CreateUserReferralInput!) {
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
      }
      referralType
      sourceOS
      matchGuaranteed
      createdAt
      updatedAt
    }
  }
`;
exports.putAttractionSwipe = `
  mutation PutAttractionSwipe($input: PutAttractionSwipeInput!) {
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
exports.adminCreateAttraction = `
  mutation AdminCreateAttraction($input: CreateAttractionInput!) {
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
exports.adminUpdateAttraction = `
  mutation AdminUpdateAttraction($input: UpdateAttractionInput!) {
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
exports.createAttractionFromPlaceId = `
  mutation CreateAttractionFromPlaceId(
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
      }
    }
  }
`;
exports.deleteAttraction = `
  mutation DeleteAttraction($input: CustomDeleteAttractionInput!) {
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
exports.deleteUserByAdmin = `
  mutation DeleteUserByAdmin($input: CustomDeleteUserInput!) {
    deleteUserByAdmin(input: $input) {
      id
      appleId
      avatar {
        bucket
        region
        key
        googlePhotoReference
      }
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      blocks {
        nextToken
      }
      blockedBy {
        nextToken
      }
      posts {
        nextToken
      }
      viewedPosts {
        nextToken
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
      }
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      username
      userTrips {
        nextToken
      }
      myCards {
        nextToken
      }
      bucketList {
        nextToken
      }
      likedPosts {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
exports.deleteUserBySelf = `
  mutation DeleteUserBySelf {
    deleteUserBySelf
  }
`;
exports.createTimelineEntryFlight = `
  mutation CreateTimelineEntryFlight($input: CreateTimelineEntryFlightInput) {
    createTimelineEntryFlight(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.createTimelineEntryRentalPickup = `
  mutation CreateTimelineEntryRentalPickup(
    $input: CreateTimelineEntryRentalPickupInput!
  ) {
    createTimelineEntryRentalPickup(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.createTimelineEntryRentalDropoff = `
  mutation CreateTimelineEntryRentalDropoff(
    $input: CreateTimelineEntryRentalDropoffInput!
  ) {
    createTimelineEntryRentalDropoff(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.createTimelineEntryLodgingArrival = `
  mutation CreateTimelineEntryLodgingArrival(
    $input: CreateTimelineEntryLodgingArrivalInput!
  ) {
    createTimelineEntryLodgingArrival(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.createTimelineEntryLodgingDeparture = `
  mutation CreateTimelineEntryLodgingDeparture(
    $input: CreateTimelineEntryLodgingDepartureInput!
  ) {
    createTimelineEntryLodgingDeparture(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.updateTimelineEntryFlight = `
  mutation UpdateTimelineEntryFlight($input: UpdateTimelineEntryFlightInput!) {
    updateTimelineEntryFlight(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.updateTimelineEntryRentalPickup = `
  mutation UpdateTimelineEntryRentalPickup(
    $input: UpdateTimelineEntryRentalPickupInput!
  ) {
    updateTimelineEntryRentalPickup(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.updateTimelineEntryRentalDropoff = `
  mutation UpdateTimelineEntryRentalDropoff(
    $input: UpdateTimelineEntryRentalDropoffInput!
  ) {
    updateTimelineEntryRentalDropoff(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.updateTimelineEntryLodgingArrival = `
  mutation UpdateTimelineEntryLodgingArrival(
    $input: UpdateTimelineEntryLodgingArrivalInput!
  ) {
    updateTimelineEntryLodgingArrival(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.updateTimelineEntryLodgingDeparture = `
  mutation UpdateTimelineEntryLodgingDeparture(
    $input: UpdateTimelineEntryLodgingDepartureInput!
  ) {
    updateTimelineEntryLodgingDeparture(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.deleteTimelineEntry = `
  mutation DeleteTimelineEntry($input: DeleteTimelineEntryInput!) {
    deleteTimelineEntry(input: $input) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.createDestination = `
  mutation CreateDestination($input: CreateDestinationInput!) {
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
      }
      authorId
      name
      icon
      coverImage {
        bucket
        region
        key
        googlePhotoReference
      }
      timezone
      attractions {
        nextToken
      }
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      coords {
        long
        lat
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
    }
  }
`;
exports.addRemoveFromBucketList = `
  mutation AddRemoveFromBucketList($input: addRemoveFromBucketListInput!) {
    addRemoveFromBucketList(input: $input)
  }
`;
exports.createPost = `
  mutation CreatePost($input: CustomCreatePostInput!) {
    createPost(input: $input)
  }
`;
exports.deletePost = `
  mutation DeletePost($input: CustomDeletePostInput!) {
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
      description
      commentsCount
      comments {
        nextToken
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
    }
  }
`;
exports.likeDislikePost = `
  mutation LikeDislikePost($input: likeDislikePostInput!) {
    likeDislikePost(input: $input)
  }
`;
exports.createComment = `
  mutation CreateComment($input: CustomCreateComment!) {
    createComment(input: $input)
  }
`;
exports.updateUser = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      appleId
      avatar {
        bucket
        region
        key
        googlePhotoReference
      }
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      blocks {
        nextToken
      }
      blockedBy {
        nextToken
      }
      posts {
        nextToken
      }
      viewedPosts {
        nextToken
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
      }
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      username
      userTrips {
        nextToken
      }
      myCards {
        nextToken
      }
      bucketList {
        nextToken
      }
      likedPosts {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
exports.syncContacts = `
  mutation SyncContacts($input: SyncContactsInput!) {
    syncContacts(input: $input)
  }
`;
exports.createTripMessageNotifications = `
  mutation CreateTripMessageNotifications(
    $input: CreateTripMessageNotificationsInput!
  ) {
    createTripMessageNotifications(input: $input)
  }
`;
exports.teaRexCreateEntity = `
  mutation TeaRexCreateEntity($input: TeaRexCreateEntityInput!) {
    teaRexCreateEntity(input: $input)
  }
`;
exports.teaRexDeleteEntity = `
  mutation TeaRexDeleteEntity($input: TeaRexDeleteEntityInput!) {
    teaRexDeleteEntity(input: $input)
  }
`;
exports.teaRexCreateEvent = `
  mutation TeaRexCreateEvent($input: TeaRexCreateEventInput!) {
    teaRexCreateEvent(input: $input)
  }
`;
exports.teaRexDeleteEvent = `
  mutation TeaRexDeleteEvent($input: TeaRexDeleteEventInput!) {
    teaRexDeleteEvent(input: $input)
  }
`;
exports.createUserBlock = `
  mutation CreateUserBlock($input: CreateUserBlockInput!) {
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.uploadToCloudinary = `
  mutation UploadToCloudinary($input: UploadToCloudinaryInput!) {
    uploadToCloudinary(input: $input) {
      cloudinaryUrl
      videoDuration
      width
      height
      format
    }
  }
`;
exports.tableMigration = `
  mutation TableMigration($input: TableMigrationInput!) {
    tableMigration(input: $input) {
      mainTableResult {
        success
        fail
        skipped
        remaining
      }
      imageResult {
        success
        fail
        skipped
        remaining
      }
    }
  }
`;
exports.migrateSingleAttraction = `
  mutation MigrateSingleAttraction($input: MigrateSingleAttractionInput!) {
    migrateSingleAttraction(input: $input) {
      mainTableResult {
        success
        fail
        skipped
        remaining
      }
      imageResult {
        success
        fail
        skipped
        remaining
      }
    }
  }
`;
exports.addMigrationFlag = `
  mutation AddMigrationFlag($input: AddMigrationFlagInput!) {
    addMigrationFlag(input: $input) {
      success
      fail
    }
  }
`;
exports.updateGoogleAPIKey = `
  mutation UpdateGoogleAPIKey($input: UpdateGoogleAPIKeyInput!) {
    updateGoogleAPIKey(input: $input) {
      envsUpdated
      envsFailed
    }
  }
`;
exports.privateCreateAttraction = `
  mutation PrivateCreateAttraction(
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
exports.privateUpdateAttraction = `
  mutation PrivateUpdateAttraction(
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
exports.privateCreateAttractionSwipe = `
  mutation PrivateCreateAttractionSwipe(
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
exports.privateUpdateAttractionSwipe = `
  mutation PrivateUpdateAttractionSwipe(
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
exports.privateDeleteAttractionSwipe = `
  mutation PrivateDeleteAttractionSwipe(
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
exports.privateCreateDestination = `
  mutation PrivateCreateDestination(
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
      }
      authorId
      name
      icon
      coverImage {
        bucket
        region
        key
        googlePhotoReference
      }
      timezone
      attractions {
        nextToken
      }
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      coords {
        long
        lat
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
    }
  }
`;
exports.updateDestination = `
  mutation UpdateDestination(
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
      }
      authorId
      name
      icon
      coverImage {
        bucket
        region
        key
        googlePhotoReference
      }
      timezone
      attractions {
        nextToken
      }
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
      nearbyTravaThingsToDoCount
      nearbyTravaPlacesToEatCount
      coords {
        long
        lat
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
    }
  }
`;
exports.privateCreateDistance = `
  mutation PrivateCreateDistance(
    $input: CreateDistanceInput!
    $condition: ModelDistanceConditionInput
  ) {
    privateCreateDistance(input: $input, condition: $condition) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateFeatureFlag = `
  mutation PrivateUpdateFeatureFlag(
    $input: UpdateFeatureFlagInput!
    $condition: ModelFeatureFlagConditionInput
  ) {
    privateUpdateFeatureFlag(input: $input, condition: $condition) {
      id
      isEnabled
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateGooglePlace = `
  mutation PrivateCreateGooglePlace(
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
      }
      consecutiveFailedRequests
      dataLastCheckedAt
      dataLastUpdatedAt
      webData {
        menuLink
        reservationLink
        bestVisitedByPopularTimes
      }
      yelpData {
        id
        url
        price
        categories
      }
      generatedSummary
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateGooglePlace = `
  mutation PrivateUpdateGooglePlace(
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
      }
      consecutiveFailedRequests
      dataLastCheckedAt
      dataLastUpdatedAt
      webData {
        menuLink
        reservationLink
        bestVisitedByPopularTimes
      }
      yelpData {
        id
        url
        price
        categories
      }
      generatedSummary
      createdAt
      updatedAt
    }
  }
`;
exports.createMessage = `
  mutation CreateMessage(
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
exports.updateMessage = `
  mutation UpdateMessage(
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
exports.deleteMessage = `
  mutation DeleteMessage(
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
exports.privateUpdateMinimumVersion = `
  mutation PrivateUpdateMinimumVersion(
    $input: UpdateMinimumVersionInput!
    $condition: ModelMinimumVersionConditionInput
  ) {
    privateUpdateMinimumVersion(input: $input, condition: $condition) {
      id
      minimumVersion
      createdAt
      updatedAt
    }
  }
`;
exports.createNotification = `
  mutation CreateNotification(
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
      commentId
      comment {
        id
        postId
        userId
        text
        createdAt
        updatedAt
      }
      showInApp
      createdAt
      updatedAt
    }
  }
`;
exports.updateNotification = `
  mutation UpdateNotification(
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
      commentId
      comment {
        id
        postId
        userId
        text
        createdAt
        updatedAt
      }
      showInApp
      createdAt
      updatedAt
    }
  }
`;
exports.deleteNotification = `
  mutation DeleteNotification(
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
      commentId
      comment {
        id
        postId
        userId
        text
        createdAt
        updatedAt
      }
      showInApp
      createdAt
      updatedAt
    }
  }
`;
exports.createPhotographer = `
  mutation CreatePhotographer(
    $input: CreatePhotographerInput!
    $condition: ModelPhotographerConditionInput
  ) {
    createPhotographer(input: $input, condition: $condition) {
      id
      name
      url
      pendingMigration
    }
  }
`;
exports.updatePhotographer = `
  mutation UpdatePhotographer(
    $input: UpdatePhotographerInput!
    $condition: ModelPhotographerConditionInput
  ) {
    updatePhotographer(input: $input, condition: $condition) {
      id
      name
      url
      pendingMigration
    }
  }
`;
exports.deletePhotographer = `
  mutation DeletePhotographer(
    $input: DeletePhotographerInput!
    $condition: ModelPhotographerConditionInput
  ) {
    deletePhotographer(input: $input, condition: $condition) {
      id
      name
      url
      pendingMigration
    }
  }
`;
exports.privateCreatePost = `
  mutation PrivateCreatePost(
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
      description
      commentsCount
      comments {
        nextToken
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
    }
  }
`;
exports.privateUpdatePost = `
  mutation PrivateUpdatePost(
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
      description
      commentsCount
      comments {
        nextToken
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
    }
  }
`;
exports.privateCreateTimelineEntry = `
  mutation PrivateCreateTimelineEntry(
    $input: CreateTimelineEntryInput!
    $condition: ModelTimelineEntryConditionInput
  ) {
    privateCreateTimelineEntry(input: $input, condition: $condition) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateTimelineEntry = `
  mutation PrivateUpdateTimelineEntry(
    $input: UpdateTimelineEntryInput!
    $condition: ModelTimelineEntryConditionInput
  ) {
    privateUpdateTimelineEntry(input: $input, condition: $condition) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.privateDeleteTimelineEntry = `
  mutation PrivateDeleteTimelineEntry(
    $input: DeleteTimelineEntryInput!
    $condition: ModelTimelineEntryConditionInput
  ) {
    privateDeleteTimelineEntry(input: $input, condition: $condition) {
      id
      tripId
      members {
        nextToken
      }
      timelineEntryType
      notes
      date
      time
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateTimelineEntryMember = `
  mutation PrivateCreateTimelineEntryMember(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateDeleteTimelineEntryMember = `
  mutation PrivateDeleteTimelineEntryMember(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateTrip = `
  mutation PrivateCreateTrip(
    $input: CreateTripInput!
    $condition: ModelTripConditionInput
  ) {
    privateCreateTrip(input: $input, condition: $condition) {
      id
      name
      tripDestinations {
        nextToken
      }
      members {
        nextToken
      }
      attractionSwipes {
        nextToken
      }
      attractionSwipesByUser {
        nextToken
      }
      timelineEntries {
        nextToken
      }
      completed
      messages {
        nextToken
      }
      link
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateTrip = `
  mutation PrivateUpdateTrip(
    $input: UpdateTripInput!
    $condition: ModelTripConditionInput
  ) {
    privateUpdateTrip(input: $input, condition: $condition) {
      id
      name
      tripDestinations {
        nextToken
      }
      members {
        nextToken
      }
      attractionSwipes {
        nextToken
      }
      attractionSwipesByUser {
        nextToken
      }
      timelineEntries {
        nextToken
      }
      completed
      messages {
        nextToken
      }
      link
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateTripDestination = `
  mutation PrivateCreateTripDestination(
    $input: CreateTripDestinationInput!
    $condition: ModelTripDestinationConditionInput
  ) {
    privateCreateTripDestination(input: $input, condition: $condition) {
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
exports.privateUpdateTripDestination = `
  mutation PrivateUpdateTripDestination(
    $input: UpdateTripDestinationInput!
    $condition: ModelTripDestinationConditionInput
  ) {
    privateUpdateTripDestination(input: $input, condition: $condition) {
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
exports.privateDeleteTripDestination = `
  mutation PrivateDeleteTripDestination(
    $input: DeleteTripDestinationInput!
    $condition: ModelTripDestinationConditionInput
  ) {
    privateDeleteTripDestination(input: $input, condition: $condition) {
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
exports.privateCreateTripDestinationUser = `
  mutation PrivateCreateTripDestinationUser(
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
      }
      isReady
      tripPlanViewedAt
      createdAt
      updatedAt
    }
  }
`;
exports.updateTripDestinationUser = `
  mutation UpdateTripDestinationUser(
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
      }
      isReady
      tripPlanViewedAt
      createdAt
      updatedAt
    }
  }
`;
exports.privateDeleteTripDestinationUser = `
  mutation PrivateDeleteTripDestinationUser(
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
      }
      isReady
      tripPlanViewedAt
      createdAt
      updatedAt
    }
  }
`;
exports.createTripPlanLog = `
  mutation CreateTripPlanLog(
    $input: CreateTripPlanLogInput!
    $condition: ModelTripPlanLogConditionInput
  ) {
    createTripPlanLog(input: $input, condition: $condition) {
      tripPlan {
        dayOfYear
      }
      createdAt
      id
      updatedAt
    }
  }
`;
exports.privateCreateUpdate = `
  mutation PrivateCreateUpdate(
    $input: CreateUpdateInput!
    $condition: ModelUpdateConditionInput
  ) {
    privateCreateUpdate(input: $input, condition: $condition) {
      type
      parityLastProcessed
      createdAt
      updatedAt
      id
    }
  }
`;
exports.createUser = `
  mutation CreateUser(
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
      }
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      blocks {
        nextToken
      }
      blockedBy {
        nextToken
      }
      posts {
        nextToken
      }
      viewedPosts {
        nextToken
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
      }
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      username
      userTrips {
        nextToken
      }
      myCards {
        nextToken
      }
      bucketList {
        nextToken
      }
      likedPosts {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateUser = `
  mutation PrivateUpdateUser(
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
      }
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      blocks {
        nextToken
      }
      blockedBy {
        nextToken
      }
      posts {
        nextToken
      }
      viewedPosts {
        nextToken
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
      }
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      username
      userTrips {
        nextToken
      }
      myCards {
        nextToken
      }
      bucketList {
        nextToken
      }
      likedPosts {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateDeleteUser = `
  mutation PrivateDeleteUser(
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
      }
      dateOfBirth
      description
      email
      contactEmail
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      blocks {
        nextToken
      }
      blockedBy {
        nextToken
      }
      posts {
        nextToken
      }
      viewedPosts {
        nextToken
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
      }
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      username
      userTrips {
        nextToken
      }
      myCards {
        nextToken
      }
      bucketList {
        nextToken
      }
      likedPosts {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateUserBlock = `
  mutation PrivateCreateUserBlock(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.updateUserBlock = `
  mutation UpdateUserBlock(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.deleteUserBlock = `
  mutation DeleteUserBlock(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateUserContact = `
  mutation PrivateCreateUserContact(
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
    }
  }
`;
exports.privateUpdateUserContact = `
  mutation PrivateUpdateUserContact(
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
    }
  }
`;
exports.privateDeleteUserContact = `
  mutation PrivateDeleteUserContact(
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
    }
  }
`;
exports.privateCreateUserFollow = `
  mutation PrivateCreateUserFollow(
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
      }
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.privateUpdateUserFollow = `
  mutation PrivateUpdateUserFollow(
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
      }
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.deleteUserFollow = `
  mutation DeleteUserFollow(
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
      }
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.createUserPost = `
  mutation CreateUserPost(
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
      }
      createdAt
      updatedAt
    }
  }
`;
exports.privateCreateUserReferral = `
  mutation PrivateCreateUserReferral(
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
      }
      referralType
      sourceOS
      matchGuaranteed
      createdAt
      updatedAt
    }
  }
`;
exports.createUserSession = `
  mutation CreateUserSession(
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
    }
  }
`;
exports.privateCreateUserTrip = `
  mutation PrivateCreateUserTrip(
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
exports.privateUpdateUserTrip = `
  mutation PrivateUpdateUserTrip(
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
exports.privateDeleteUserTrip = `
  mutation PrivateDeleteUserTrip(
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
exports.signUp = `
  mutation SignUp($input: SignUpInput) {
    signUp(input: $input) {
      id
      destination
    }
  }
`;
