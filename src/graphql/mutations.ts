/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const federatedSignUp = /* GraphQL */ `
  mutation FederatedSignUp($input: FederatedSignUpInput) {
    federatedSignUp(input: $input) {
      id
    }
  }
`;
export const signOut = /* GraphQL */ `
  mutation SignOut($input: SignOutInput!) {
    signOut(input: $input) {
      id
    }
  }
`;
export const settingsSendReport = /* GraphQL */ `
  mutation SettingsSendReport($input: SettingsSendReportInput!) {
    settingsSendReport(input: $input) {
      messageId
    }
  }
`;
export const createTrip = /* GraphQL */ `
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
export const updateTrip = /* GraphQL */ `
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
export const createUserTrip = /* GraphQL */ `
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
export const updateUserTrip = /* GraphQL */ `
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
export const deleteUserTrip = /* GraphQL */ `
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
export const createTripDestination = /* GraphQL */ `
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
export const updateTripDestination = /* GraphQL */ `
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
export const deleteTripDestination = /* GraphQL */ `
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
export const createUserFollow = /* GraphQL */ `
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
export const updateUserFollow = /* GraphQL */ `
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
export const createUserReferral = /* GraphQL */ `
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
export const putAttractionSwipe = /* GraphQL */ `
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
export const adminCreateAttraction = /* GraphQL */ `
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
      viatorProducts {
        nextToken
      }
    }
  }
`;
export const adminUpdateAttraction = /* GraphQL */ `
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
      viatorProducts {
        nextToken
      }
    }
  }
`;
export const createAttractionFromPlaceId = /* GraphQL */ `
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
export const deleteAttraction = /* GraphQL */ `
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
      viatorProducts {
        nextToken
      }
    }
  }
`;
export const deleteUserByAdmin = /* GraphQL */ `
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
export const deleteUserBySelf = /* GraphQL */ `
  mutation DeleteUserBySelf {
    deleteUserBySelf
  }
`;
export const adminCreateViatorProduct = /* GraphQL */ `
  mutation AdminCreateViatorProduct($input: AdminCreateViatorProductInput!) {
    adminCreateViatorProduct(input: $input) {
      id
      attractionId
      viatorLink
      name
      priceText
      rating {
        score
        count
      }
      coverImageUrl
      displayOrder
      duration
      pricing
      currency
      createdAt
      updatedAt
    }
  }
`;
export const createTimelineEntryFlight = /* GraphQL */ `
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
export const createTimelineEntryRentalPickup = /* GraphQL */ `
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
export const createTimelineEntryRentalDropoff = /* GraphQL */ `
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
export const createTimelineEntryLodgingArrival = /* GraphQL */ `
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
export const createTimelineEntryLodgingDeparture = /* GraphQL */ `
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
export const updateTimelineEntryFlight = /* GraphQL */ `
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
export const updateTimelineEntryRentalPickup = /* GraphQL */ `
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
export const updateTimelineEntryRentalDropoff = /* GraphQL */ `
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
export const updateTimelineEntryLodgingArrival = /* GraphQL */ `
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
export const updateTimelineEntryLodgingDeparture = /* GraphQL */ `
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
export const deleteTimelineEntry = /* GraphQL */ `
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
export const createDestination = /* GraphQL */ `
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
export const addRemoveFromBucketList = /* GraphQL */ `
  mutation AddRemoveFromBucketList($input: addRemoveFromBucketListInput!) {
    addRemoveFromBucketList(input: $input)
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost($input: CustomCreatePostInput!) {
    createPost(input: $input)
  }
`;
export const deletePost = /* GraphQL */ `
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
export const likeDislikePost = /* GraphQL */ `
  mutation LikeDislikePost($input: likeDislikePostInput!) {
    likeDislikePost(input: $input)
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CustomCreateComment!) {
    createComment(input: $input)
  }
`;
export const updateUser = /* GraphQL */ `
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
export const syncContacts = /* GraphQL */ `
  mutation SyncContacts($input: SyncContactsInput!) {
    syncContacts(input: $input)
  }
`;
export const createTripMessageNotifications = /* GraphQL */ `
  mutation CreateTripMessageNotifications(
    $input: CreateTripMessageNotificationsInput!
  ) {
    createTripMessageNotifications(input: $input)
  }
`;
export const teaRexCreateEntity = /* GraphQL */ `
  mutation TeaRexCreateEntity($input: TeaRexCreateEntityInput!) {
    teaRexCreateEntity(input: $input)
  }
`;
export const teaRexDeleteEntity = /* GraphQL */ `
  mutation TeaRexDeleteEntity($input: TeaRexDeleteEntityInput!) {
    teaRexDeleteEntity(input: $input)
  }
`;
export const teaRexCreateEvent = /* GraphQL */ `
  mutation TeaRexCreateEvent($input: TeaRexCreateEventInput!) {
    teaRexCreateEvent(input: $input)
  }
`;
export const teaRexDeleteEvent = /* GraphQL */ `
  mutation TeaRexDeleteEvent($input: TeaRexDeleteEventInput!) {
    teaRexDeleteEvent(input: $input)
  }
`;
export const createUserBlock = /* GraphQL */ `
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
export const uploadToCloudinary = /* GraphQL */ `
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
export const tableMigration = /* GraphQL */ `
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
export const migrateSingleAttraction = /* GraphQL */ `
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
export const addMigrationFlag = /* GraphQL */ `
  mutation AddMigrationFlag($input: AddMigrationFlagInput!) {
    addMigrationFlag(input: $input) {
      success
      fail
    }
  }
`;
export const updateGoogleAPIKey = /* GraphQL */ `
  mutation UpdateGoogleAPIKey($input: UpdateGoogleAPIKeyInput!) {
    updateGoogleAPIKey(input: $input) {
      envsUpdated
      envsFailed
    }
  }
`;
export const privateCreateAttraction = /* GraphQL */ `
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
      viatorProducts {
        nextToken
      }
    }
  }
`;
export const privateUpdateAttraction = /* GraphQL */ `
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
      viatorProducts {
        nextToken
      }
    }
  }
`;
export const privateCreateAttractionSwipe = /* GraphQL */ `
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
export const privateUpdateAttractionSwipe = /* GraphQL */ `
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
export const privateDeleteAttractionSwipe = /* GraphQL */ `
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
export const privateCreateDestination = /* GraphQL */ `
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
export const updateDestination = /* GraphQL */ `
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
export const privateCreateDistance = /* GraphQL */ `
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
export const privateUpdateFeatureFlag = /* GraphQL */ `
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
export const privateCreateGooglePlace = /* GraphQL */ `
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
export const privateUpdateGooglePlace = /* GraphQL */ `
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
export const createMessage = /* GraphQL */ `
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
export const updateMessage = /* GraphQL */ `
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
export const deleteMessage = /* GraphQL */ `
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
export const privateUpdateMinimumVersion = /* GraphQL */ `
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
export const createNotification = /* GraphQL */ `
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
export const updateNotification = /* GraphQL */ `
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
export const deleteNotification = /* GraphQL */ `
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
export const createPhotographer = /* GraphQL */ `
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
export const updatePhotographer = /* GraphQL */ `
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
export const deletePhotographer = /* GraphQL */ `
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
export const privateCreatePost = /* GraphQL */ `
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
export const privateUpdatePost = /* GraphQL */ `
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
export const privateCreateTimelineEntry = /* GraphQL */ `
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
export const privateUpdateTimelineEntry = /* GraphQL */ `
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
export const privateDeleteTimelineEntry = /* GraphQL */ `
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
export const privateCreateTimelineEntryMember = /* GraphQL */ `
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
export const privateDeleteTimelineEntryMember = /* GraphQL */ `
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
export const privateCreateTrip = /* GraphQL */ `
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
export const privateUpdateTrip = /* GraphQL */ `
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
export const privateCreateTripDestination = /* GraphQL */ `
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
export const privateUpdateTripDestination = /* GraphQL */ `
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
export const privateDeleteTripDestination = /* GraphQL */ `
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
export const privateCreateTripDestinationUser = /* GraphQL */ `
  mutation PrivateCreateTripDestinationUser(
    $input: CreateTripDestinationUserInput!
    $condition: ModelTripDestinationUserConditionInput
  ) {
    privateCreateTripDestinationUser(input: $input, condition: $condition) {
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
export const updateTripDestinationUser = /* GraphQL */ `
  mutation UpdateTripDestinationUser(
    $input: UpdateTripDestinationUserInput!
    $condition: ModelTripDestinationUserConditionInput
  ) {
    updateTripDestinationUser(input: $input, condition: $condition) {
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
export const privateDeleteTripDestinationUser = /* GraphQL */ `
  mutation PrivateDeleteTripDestinationUser(
    $input: DeleteTripDestinationUserInput!
    $condition: ModelTripDestinationUserConditionInput
  ) {
    privateDeleteTripDestinationUser(input: $input, condition: $condition) {
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
export const createTripPlanLog = /* GraphQL */ `
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
export const privateCreateUpdate = /* GraphQL */ `
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
export const createUser = /* GraphQL */ `
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
export const privateUpdateUser = /* GraphQL */ `
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
export const privateDeleteUser = /* GraphQL */ `
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
export const privateCreateUserBlock = /* GraphQL */ `
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
export const updateUserBlock = /* GraphQL */ `
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
export const deleteUserBlock = /* GraphQL */ `
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
export const privateCreateUserContact = /* GraphQL */ `
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
export const privateUpdateUserContact = /* GraphQL */ `
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
export const privateDeleteUserContact = /* GraphQL */ `
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
export const privateCreateUserFollow = /* GraphQL */ `
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
export const privateUpdateUserFollow = /* GraphQL */ `
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
export const deleteUserFollow = /* GraphQL */ `
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
export const createUserPost = /* GraphQL */ `
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
export const privateCreateUserReferral = /* GraphQL */ `
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
export const createUserSession = /* GraphQL */ `
  mutation CreateUserSession(
    $input: CreateUserSessionInput!
    $condition: ModelUserSessionConditionInput
  ) {
    createUserSession(input: $input, condition: $condition) {
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
      deviceType
      appVersion
      label
      createdAt
      updatedAt
    }
  }
`;
export const privateCreateUserTrip = /* GraphQL */ `
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
export const privateUpdateUserTrip = /* GraphQL */ `
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
export const privateDeleteUserTrip = /* GraphQL */ `
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
export const privateCreateViatorProduct = /* GraphQL */ `
  mutation PrivateCreateViatorProduct(
    $input: CreateViatorProductInput!
    $condition: ModelViatorProductConditionInput
  ) {
    privateCreateViatorProduct(input: $input, condition: $condition) {
      id
      attractionId
      viatorLink
      name
      priceText
      rating {
        score
        count
      }
      coverImageUrl
      displayOrder
      duration
      pricing
      currency
      createdAt
      updatedAt
    }
  }
`;
export const signUp = /* GraphQL */ `
  mutation SignUp($input: SignUpInput) {
    signUp(input: $input) {
      id
      destination
    }
  }
`;
