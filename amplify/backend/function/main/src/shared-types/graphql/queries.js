"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.googlePlacesByIsValidByDataLastUpdatedAt = exports.googlePlacesByIsValidByDataLastCheckedAt = exports.getGooglePlace = exports.listFeatureFlags = exports.getFeatureFlag = exports.privateGetDistance = exports.searchDestinations = exports.listDestinationsByLabel = exports.listDestinationsByIsTravaCreated = exports.listDestinations = exports.getDestination = exports.getComment = exports.privateListAttractionSwipesByUpdatedAt = exports.listAttractionSwipesByTripByDestination = exports.privateGetAttractionSwipe = exports.searchAttractions = exports.privateListAttractionsByCreatedAt = exports.listAttractionsByIsTravaCreatedByDestination = exports.listAttractionsByType = exports.listAttractionsByDestination = exports.listAttractions = exports.getAttraction = exports.getAttractionsForScheduler = exports.getGoogleAPIKey = exports.getExploreVotingList = exports.addToItineraryMapSearch = exports.addToItinerarySearch = exports.openSearchListNearbyAttractions = exports.exploreTopUsers = exports.openSearchDestinations = exports.exploreMapSearchAttractions = exports.exploreSearchAttractions = exports.getUserContacts = exports.notificationPost = exports.homeTabsSuggestedFeed = exports.homeTabsAccountTrips = exports.homeTabsFeedPostComments = exports.homeTabsFeedPeopleOnThisTrip = exports.homeTabsFeed = exports.flightStatsGetScheduleDetails = exports.googleGetPlaceDetails = exports.googleGetPlaces = exports.getAttractionsToTagToPost = exports.checkForExistingCards = exports.mapBoxGetToken = exports.mapBoxGetPlaces = exports.mapBoxGetDistances = exports.generateAttractionDetails = exports.getAttractionPhotos = exports.generateTripPlan = void 0;
exports.signInErrorCheckIfUsernameExists = exports.signUpCheckGetUserByUsername = exports.listUserTripByTrip = exports.privateListUserSessionsByCreatedAt = exports.listUserReferrals = exports.getUserReferral = exports.listUserFollows = exports.getUserFollow = exports.privateGetUserContactsByUserByContactName = exports.privateListUserContacts = exports.listUserBlocks = exports.getUserBlock = exports.userAttractionsByAttraction = exports.privateListUserAttractions = exports.searchUsers = exports.getUserByUsername = exports.listUsers = exports.getUser = exports.listUpdatesByType = exports.listTripDestinationUsersByTripByDestination = exports.privateListTripDestinationUsers = exports.privateGetTrip = exports.privateGetTimelineEntry = exports.privateListPostsByTripByUser = exports.privateListPosts = exports.privateGetPost = exports.listPhotographersByName = exports.listPhotographers = exports.getPhotographer = exports.listNotificationsByReceiverUser = exports.listNotifications = exports.getNotification = exports.getMinimumVersion = void 0;
exports.generateTripPlan = `
  query GenerateTripPlan(
    $attractions: [TripPlanAttraction]!
    $group: TripPlanGroup!
    $config: GenerateTripPlanConfigInput
  ) {
    generateTripPlan(
      attractions: $attractions
      group: $group
      config: $config
    ) {
      plan {
        day
        order
        attractionId
        locId
      }
    }
  }
`;
exports.getAttractionPhotos = `
  query GetAttractionPhotos($input: GetAttractionPhotosInput!) {
    getAttractionPhotos(input: $input)
  }
`;
exports.generateAttractionDetails = `
  query GenerateAttractionDetails($attractionId: String!) {
    generateAttractionDetails(attractionId: $attractionId)
  }
`;
exports.mapBoxGetDistances = `
  query MapBoxGetDistances($input: MapBoxAttractionLocationsInput!) {
    mapBoxGetDistances(input: $input) {
      locations {
        attractionId_1
        attractionId_2
        distance
      }
    }
  }
`;
exports.mapBoxGetPlaces = `
  query MapBoxGetPlaces($input: MapboxGetPlacesInput) {
    mapBoxGetPlaces(input: $input) {
      location {
        street
        number
        city
        state
        postCode
        country
      }
      placeName
    }
  }
`;
exports.mapBoxGetToken = `
  query MapBoxGetToken {
    mapBoxGetToken {
      token
    }
  }
`;
exports.checkForExistingCards = `
  query CheckForExistingCards($input: CheckForExistingCardsInput!) {
    checkForExistingCards(input: $input) {
      attractions {
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
exports.getAttractionsToTagToPost = `
  query GetAttractionsToTagToPost($input: GetAttractionsToTagToPostInput!) {
    getAttractionsToTagToPost(input: $input) {
      attractions {
        id
        name
        destinationName
        attractionCategories
        bucketListCount
        type
        isTravaCreated
      }
    }
  }
`;
exports.googleGetPlaces = `
  query GoogleGetPlaces($input: GoogleGetPlacesInput) {
    googleGetPlaces(input: $input) {
      mainText
      secondaryText
      placeId
      types
    }
  }
`;
exports.googleGetPlaceDetails = `
  query GoogleGetPlaceDetails($input: GoogleGetPlaceDetailsInput) {
    googleGetPlaceDetails(input: $input) {
      location {
        city
        state
        country
        continent
        googlePlaceId
        formattedAddress
        googlePlacePageLink
        websiteLink
        phone
        businessStatus
        timezone
      }
      placeName
    }
  }
`;
exports.flightStatsGetScheduleDetails = `
  query FlightStatsGetScheduleDetails(
    $input: FlightStatsGetScheduleDetailsInput
  ) {
    flightStatsGetScheduleDetails(input: $input) {
      scheduledFlights {
        carrierFsCode
        flightNumber
        departureAirportFsCode
        arrivalAirportFsCode
        departureTime
        arrivalTime
        stops
        departureTerminal
        arrivalTerminal
        flightEquipmentIataCode
        isCodeshare
        isWetlease
        serviceType
        referenceCode
        trafficRestrictions
        serviceClasses
      }
      request {
        departing
        url
      }
    }
  }
`;
exports.homeTabsFeed = `
  query HomeTabsFeed {
    homeTabsFeed {
      stories {
        storyId
      }
    }
  }
`;
exports.homeTabsFeedPeopleOnThisTrip = `
  query HomeTabsFeedPeopleOnThisTrip(
    $input: HomeTabsFeedPeopleOnThisTripInput
  ) {
    homeTabsFeedPeopleOnThisTrip(input: $input) {
      members {
        userId
        tripId
        status
        invitedByUserId
        inviteLink
        lastMessageReadDate
        createdAt
        updatedAt
      }
      userFollows {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
    }
  }
`;
exports.homeTabsFeedPostComments = `
  query HomeTabsFeedPostComments($input: HomeTabsFeedPostCommentsInput) {
    homeTabsFeedPostComments(input: $input) {
      id
      userId
      tripId
      avatar {
        bucket
        region
        key
        googlePhotoReference
      }
      username
      membersLength
      description
      comments {
        id
        userId
        username
        text
        updatedAt
      }
    }
  }
`;
exports.homeTabsAccountTrips = `
  query HomeTabsAccountTrips($input: HomeTabsAccountTripsInput) {
    homeTabsAccountTrips(input: $input) {
      stories {
        storyId
      }
    }
  }
`;
exports.homeTabsSuggestedFeed = `
  query HomeTabsSuggestedFeed($input: HomeTabsSuggestedFeedInput) {
    homeTabsSuggestedFeed(input: $input) {
      stories {
        storyId
      }
      sharedPostError {
        type
        authorId
        authorUsername
      }
      referringUserInfo {
        id
        username
      }
    }
  }
`;
exports.notificationPost = `
  query NotificationPost($input: NotificationPostInput) {
    notificationPost(input: $input) {
      post {
        id
        createdAt
        userId
        tripId
        membersLength
        description
        cloudinaryUrl
        username
        authorPublic
        destinationId
        destinationIcon
        destinationName
        destinationState
        destinationCountry
        attractionId
        attractionName
        likesCount
        commentsCount
        mediaType
        deletedAt
      }
    }
  }
`;
exports.getUserContacts = `
  query GetUserContacts {
    getUserContacts {
      contactsOnTrava {
        id
        username
        email
        phone
        name
        createdAt
        updatedAt
        bucketListsCollected
      }
      contactsNotOnTrava {
        emailAddresses
        phoneNumbers
        name
        id
      }
      userContactsOnTravaIds
    }
  }
`;
exports.exploreSearchAttractions = `
  query ExploreSearchAttractions($input: ExploreSearchAttractionsInput) {
    exploreSearchAttractions(input: $input) {
      attractions {
        id
        name
        distance
        isTravaCreated
        attractionCategories
        attractionCuisine
        bucketListCount
        duration
        type
        recommendationBadges
      }
      nextPageExists
    }
  }
`;
exports.exploreMapSearchAttractions = `
  query ExploreMapSearchAttractions($input: ExploreMapSearchAttractionsInput) {
    exploreMapSearchAttractions(input: $input) {
      attractions {
        id
        name
        distance
        isTravaCreated
        attractionCategories
        attractionCuisine
        bucketListCount
        duration
        type
        recommendationBadges
      }
    }
  }
`;
exports.openSearchDestinations = `
  query OpenSearchDestinations($input: OpenSearchDestinationsInput) {
    openSearchDestinations(input: $input) {
      featured {
        id
        name
        icon
        state
        country
        numberOfExperiences
      }
      other {
        id
        name
        icon
        state
        country
        numberOfExperiences
      }
    }
  }
`;
exports.exploreTopUsers = `
  query ExploreTopUsers {
    exploreTopUsers {
      users {
        id
        username
        email
        phone
        name
        createdAt
        updatedAt
        bucketListsCollected
      }
    }
  }
`;
exports.openSearchListNearbyAttractions = `
  query OpenSearchListNearbyAttractions(
    $input: OpenSearchListNearbyAttractionsInput
  ) {
    openSearchListNearbyAttractions(input: $input) {
      attractions {
        id
        name
        type
        bestVisited
        duration
        attractionCategories
        attractionCuisine
        isTravaCreated
        authorType
        deletedAt
      }
    }
  }
`;
exports.addToItinerarySearch = `
  query AddToItinerarySearch($input: AddToItinerarySearchInput) {
    addToItinerarySearch(input: $input) {
      attractions {
        id
        name
        isTravaCreated
        attractionCategories
        attractionCuisine
        bucketListCount
        duration
        type
        distance
        inSeason
        inMyBucketList
        onItinerary
        yesVotes
        noVotes
        recommendationBadges
      }
      nextPageExists
    }
  }
`;
exports.addToItineraryMapSearch = `
  query AddToItineraryMapSearch($input: AddToItineraryMapSearchInput) {
    addToItineraryMapSearch(input: $input) {
      attractions {
        id
        name
        isTravaCreated
        attractionCategories
        attractionCuisine
        bucketListCount
        duration
        type
        distance
        inSeason
        inMyBucketList
        onItinerary
        yesVotes
        noVotes
        recommendationBadges
      }
    }
  }
`;
exports.getExploreVotingList = `
  query GetExploreVotingList($input: GetExploreVotingListInput!) {
    getExploreVotingList(input: $input) {
      attractions {
        attractionCategories
        attractionCuisine
        cost
        descriptionShort
        id
        inMyBucketList
        inSeason
        name
        recommendationBadges
        type
      }
      nextPageExists
      votedOnAttractionIds
    }
  }
`;
exports.getGoogleAPIKey = `
  query GetGoogleAPIKey($input: GetGoogleAPIKeyInput!) {
    getGoogleAPIKey(input: $input) {
      key
    }
  }
`;
exports.getAttractionsForScheduler = `
  query GetAttractionsForScheduler($input: GetAttractionsForScheduler) {
    getAttractionsForScheduler(input: $input) {
      attractions {
        id
        name
        type
        bestVisited
        duration
        attractionCategories
        attractionCuisine
        isTravaCreated
        authorType
        deletedAt
      }
    }
  }
`;
exports.getAttraction = `
  query GetAttraction($id: ID!) {
    getAttraction(id: $id) {
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
exports.listAttractions = `
  query ListAttractions(
    $filter: ModelAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttractions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
exports.listAttractionsByDestination = `
  query ListAttractionsByDestination(
    $destinationId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttractionsByDestination(
      destinationId: $destinationId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.listAttractionsByType = `
  query ListAttractionsByType(
    $type: ATTRACTION_TYPE!
    $bucketListCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttractionsByType(
      type: $type
      bucketListCount: $bucketListCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.listAttractionsByIsTravaCreatedByDestination = `
  query ListAttractionsByIsTravaCreatedByDestination(
    $isTravaCreated: Int!
    $destinationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttractionsByIsTravaCreatedByDestination(
      isTravaCreated: $isTravaCreated
      destinationId: $destinationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.privateListAttractionsByCreatedAt = `
  query PrivateListAttractionsByCreatedAt(
    $label: AttractionLabel!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateListAttractionsByCreatedAt(
      label: $label
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.searchAttractions = `
  query SearchAttractions(
    $filter: SearchableAttractionFilterInput
    $sort: [SearchableAttractionSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableAttractionAggregationInput]
  ) {
    searchAttractions(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
exports.privateGetAttractionSwipe = `
  query PrivateGetAttractionSwipe(
    $userId: ID!
    $tripId: ID!
    $attractionId: ID!
  ) {
    privateGetAttractionSwipe(
      userId: $userId
      tripId: $tripId
      attractionId: $attractionId
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
exports.listAttractionSwipesByTripByDestination = `
  query ListAttractionSwipesByTripByDestination(
    $tripId: ID!
    $destinationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionSwipeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttractionSwipesByTripByDestination(
      tripId: $tripId
      destinationId: $destinationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        tripId
        destinationId
        attractionId
        swipe
        label
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.privateListAttractionSwipesByUpdatedAt = `
  query PrivateListAttractionSwipesByUpdatedAt(
    $label: AttractionSwipeLabel!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttractionSwipeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateListAttractionSwipesByUpdatedAt(
      label: $label
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        tripId
        destinationId
        attractionId
        swipe
        label
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getComment = `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      postId
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
      createdAt
      updatedAt
    }
  }
`;
exports.getDestination = `
  query GetDestination($id: ID!) {
    getDestination(id: $id) {
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
exports.listDestinations = `
  query ListDestinations(
    $filter: ModelDestinationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDestinations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
exports.listDestinationsByIsTravaCreated = `
  query ListDestinationsByIsTravaCreated(
    $isTravaCreated: Int!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDestinationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDestinationsByIsTravaCreated(
      isTravaCreated: $isTravaCreated
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.listDestinationsByLabel = `
  query ListDestinationsByLabel(
    $label: String!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDestinationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDestinationsByLabel(
      label: $label
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.searchDestinations = `
  query SearchDestinations(
    $filter: SearchableDestinationFilterInput
    $sort: [SearchableDestinationSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableDestinationAggregationInput]
  ) {
    searchDestinations(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
exports.privateGetDistance = `
  query PrivateGetDistance($key: String!) {
    privateGetDistance(key: $key) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
exports.getFeatureFlag = `
  query GetFeatureFlag($id: ID!) {
    getFeatureFlag(id: $id) {
      id
      isEnabled
      createdAt
      updatedAt
    }
  }
`;
exports.listFeatureFlags = `
  query ListFeatureFlags(
    $filter: ModelFeatureFlagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeatureFlags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isEnabled
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getGooglePlace = `
  query GetGooglePlace($id: ID!) {
    getGooglePlace(id: $id) {
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
exports.googlePlacesByIsValidByDataLastCheckedAt = `
  query GooglePlacesByIsValidByDataLastCheckedAt(
    $isValid: Int!
    $dataLastCheckedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGooglePlaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    googlePlacesByIsValidByDataLastCheckedAt(
      isValid: $isValid
      dataLastCheckedAt: $dataLastCheckedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        isValid
        consecutiveFailedRequests
        dataLastCheckedAt
        dataLastUpdatedAt
        generatedSummary
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.googlePlacesByIsValidByDataLastUpdatedAt = `
  query GooglePlacesByIsValidByDataLastUpdatedAt(
    $isValid: Int!
    $dataLastUpdatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGooglePlaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    googlePlacesByIsValidByDataLastUpdatedAt(
      isValid: $isValid
      dataLastUpdatedAt: $dataLastUpdatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        isValid
        consecutiveFailedRequests
        dataLastCheckedAt
        dataLastUpdatedAt
        generatedSummary
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getMinimumVersion = `
  query GetMinimumVersion($id: ID!) {
    getMinimumVersion(id: $id) {
      id
      minimumVersion
      createdAt
      updatedAt
    }
  }
`;
exports.getNotification = `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
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
exports.listNotifications = `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        receiverUserId
        senderUserId
        type
        text
        tripId
        postId
        attractionId
        commentId
        showInApp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listNotificationsByReceiverUser = `
  query ListNotificationsByReceiverUser(
    $receiverUserId: ID!
    $showInApp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationsByReceiverUser(
      receiverUserId: $receiverUserId
      showInApp: $showInApp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        receiverUserId
        senderUserId
        type
        text
        tripId
        postId
        attractionId
        commentId
        showInApp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getPhotographer = `
  query GetPhotographer($id: ID!) {
    getPhotographer(id: $id) {
      id
      name
      url
      pendingMigration
    }
  }
`;
exports.listPhotographers = `
  query ListPhotographers(
    $filter: ModelPhotographerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotographers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        url
        pendingMigration
      }
      nextToken
    }
  }
`;
exports.listPhotographersByName = `
  query ListPhotographersByName(
    $name: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPhotographerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotographersByName(
      name: $name
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        url
        pendingMigration
      }
      nextToken
    }
  }
`;
exports.privateGetPost = `
  query PrivateGetPost($id: ID!) {
    privateGetPost(id: $id) {
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
exports.privateListPosts = `
  query PrivateListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateListPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
exports.privateListPostsByTripByUser = `
  query PrivateListPostsByTripByUser(
    $tripId: ID!
    $userId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateListPostsByTripByUser(
      tripId: $tripId
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.privateGetTimelineEntry = `
  query PrivateGetTimelineEntry($id: ID!) {
    privateGetTimelineEntry(id: $id) {
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
exports.privateGetTrip = `
  query PrivateGetTrip($id: ID!) {
    privateGetTrip(id: $id) {
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
exports.privateListTripDestinationUsers = `
  query PrivateListTripDestinationUsers(
    $tripId: ID
    $destinationIdUserId: ModelTripDestinationUserPrimaryCompositeKeyConditionInput
    $filter: ModelTripDestinationUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    privateListTripDestinationUsers(
      tripId: $tripId
      destinationIdUserId: $destinationIdUserId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        tripId
        destinationId
        userId
        isReady
        tripPlanViewedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listTripDestinationUsersByTripByDestination = `
  query ListTripDestinationUsersByTripByDestination(
    $tripId: ID!
    $destinationId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTripDestinationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTripDestinationUsersByTripByDestination(
      tripId: $tripId
      destinationId: $destinationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        tripId
        destinationId
        userId
        isReady
        tripPlanViewedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listUpdatesByType = `
  query ListUpdatesByType(
    $type: UpdateType!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUpdateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUpdatesByType(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        parityLastProcessed
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
exports.getUser = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
exports.listUsers = `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
exports.getUserByUsername = `
  query GetUserByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.searchUsers = `
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: [SearchableUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUserAggregationInput]
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
exports.privateListUserAttractions = `
  query PrivateListUserAttractions(
    $userId: ID
    $attractionId: ModelIDKeyConditionInput
    $filter: ModelUserAttractionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    privateListUserAttractions(
      userId: $userId
      attractionId: $attractionId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        attractionId
        authorId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.userAttractionsByAttraction = `
  query UserAttractionsByAttraction(
    $attractionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserAttractionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userAttractionsByAttraction(
      attractionId: $attractionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        attractionId
        authorId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getUserBlock = `
  query GetUserBlock($userId: ID!, $blockedUserId: ID!) {
    getUserBlock(userId: $userId, blockedUserId: $blockedUserId) {
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
exports.listUserBlocks = `
  query ListUserBlocks(
    $userId: ID
    $blockedUserId: ModelIDKeyConditionInput
    $filter: ModelUserBlockFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserBlocks(
      userId: $userId
      blockedUserId: $blockedUserId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        blockedUserId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.privateListUserContacts = `
  query PrivateListUserContacts(
    $userId: ID
    $recordId: ModelStringKeyConditionInput
    $filter: ModelUserContactFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    privateListUserContacts(
      userId: $userId
      recordId: $recordId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        recordId
        travaUserIds
        name
        email
        phone
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.privateGetUserContactsByUserByContactName = `
  query PrivateGetUserContactsByUserByContactName(
    $userId: ID!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGetUserContactsByUserByContactName(
      userId: $userId
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        recordId
        travaUserIds
        name
        email
        phone
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getUserFollow = `
  query GetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
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
exports.listUserFollows = `
  query ListUserFollows(
    $userId: ID
    $followedUserId: ModelIDKeyConditionInput
    $filter: ModelUserFollowFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserFollows(
      userId: $userId
      followedUserId: $followedUserId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getUserReferral = `
  query GetUserReferral($userId: ID!, $referredUserId: ID!) {
    getUserReferral(userId: $userId, referredUserId: $referredUserId) {
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
exports.listUserReferrals = `
  query ListUserReferrals(
    $userId: ID
    $referredUserId: ModelIDKeyConditionInput
    $filter: ModelUserReferralFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserReferrals(
      userId: $userId
      referredUserId: $referredUserId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        referredUserId
        referralType
        sourceOS
        matchGuaranteed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.privateListUserSessionsByCreatedAt = `
  query PrivateListUserSessionsByCreatedAt(
    $label: UserSessionLabel!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateListUserSessionsByCreatedAt(
      label: $label
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        deviceType
        appVersion
        label
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listUserTripByTrip = `
  query ListUserTripByTrip(
    $tripId: ID!
    $userId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserTripFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTripByTrip(
      tripId: $tripId
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        tripId
        status
        invitedByUserId
        inviteLink
        lastMessageReadDate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.signUpCheckGetUserByUsername = `
  query SignUpCheckGetUserByUsername($username: String) {
    signUpCheckGetUserByUsername(username: $username)
  }
`;
exports.signInErrorCheckIfUsernameExists = `
  query SignInErrorCheckIfUsernameExists($username: String) {
    signInErrorCheckIfUsernameExists(username: $username) {
      provider
    }
  }
`;
