/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const generateTripPlan = /* GraphQL */ `
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
export const getAttractionPhotos = /* GraphQL */ `
  query GetAttractionPhotos($input: GetAttractionPhotosInput!) {
    getAttractionPhotos(input: $input)
  }
`;
export const generateAttractionDetails = /* GraphQL */ `
  query GenerateAttractionDetails($attractionId: String!) {
    generateAttractionDetails(attractionId: $attractionId)
  }
`;
export const mapBoxGetDistances = /* GraphQL */ `
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
export const mapBoxGetPlaces = /* GraphQL */ `
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
export const mapBoxGetToken = /* GraphQL */ `
  query MapBoxGetToken {
    mapBoxGetToken {
      token
    }
  }
`;
export const checkForExistingCards = /* GraphQL */ `
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
export const getAttractionsToTagToPost = /* GraphQL */ `
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
export const googleGetPlaces = /* GraphQL */ `
  query GoogleGetPlaces($input: GoogleGetPlacesInput) {
    googleGetPlaces(input: $input) {
      mainText
      secondaryText
      placeId
      types
    }
  }
`;
export const googleGetPlaceDetails = /* GraphQL */ `
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
export const flightStatsGetScheduleDetails = /* GraphQL */ `
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
export const homeTabsFeed = /* GraphQL */ `
  query HomeTabsFeed {
    homeTabsFeed {
      stories {
        storyId
      }
    }
  }
`;
export const homeTabsFeedPeopleOnThisTrip = /* GraphQL */ `
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
export const homeTabsFeedPostComments = /* GraphQL */ `
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
export const homeTabsAccountTrips = /* GraphQL */ `
  query HomeTabsAccountTrips($input: HomeTabsAccountTripsInput) {
    homeTabsAccountTrips(input: $input) {
      stories {
        storyId
      }
    }
  }
`;
export const homeTabsSuggestedFeed = /* GraphQL */ `
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
export const notificationPost = /* GraphQL */ `
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
export const getUserContacts = /* GraphQL */ `
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
export const exploreSearchAttractions = /* GraphQL */ `
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
export const exploreMapSearchAttractions = /* GraphQL */ `
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
export const openSearchDestinations = /* GraphQL */ `
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
export const exploreTopUsers = /* GraphQL */ `
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
export const openSearchListNearbyAttractions = /* GraphQL */ `
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
export const addToItinerarySearch = /* GraphQL */ `
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
export const addToItineraryMapSearch = /* GraphQL */ `
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
export const getExploreVotingList = /* GraphQL */ `
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
export const getGoogleAPIKey = /* GraphQL */ `
  query GetGoogleAPIKey($input: GetGoogleAPIKeyInput!) {
    getGoogleAPIKey(input: $input) {
      key
    }
  }
`;
export const getAttractionsForScheduler = /* GraphQL */ `
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
export const getAttraction = /* GraphQL */ `
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
    }
  }
`;
export const listAttractions = /* GraphQL */ `
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
export const listAttractionsByDestination = /* GraphQL */ `
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
export const listAttractionsByType = /* GraphQL */ `
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
export const listAttractionsByIsTravaCreatedByDestination = /* GraphQL */ `
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
export const privateListAttractionsByCreatedAt = /* GraphQL */ `
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
export const searchAttractions = /* GraphQL */ `
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
export const privateGetAttractionSwipe = /* GraphQL */ `
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
export const listAttractionSwipesByTripByDestination = /* GraphQL */ `
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
export const privateListAttractionSwipesByUpdatedAt = /* GraphQL */ `
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
export const getComment = /* GraphQL */ `
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
export const getDestination = /* GraphQL */ `
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
export const listDestinations = /* GraphQL */ `
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
export const listDestinationsByIsTravaCreated = /* GraphQL */ `
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
export const listDestinationsByLabel = /* GraphQL */ `
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
export const searchDestinations = /* GraphQL */ `
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
export const privateGetDistance = /* GraphQL */ `
  query PrivateGetDistance($key: String!) {
    privateGetDistance(key: $key) {
      key
      value
      createdAt
      updatedAt
    }
  }
`;
export const getFeatureFlag = /* GraphQL */ `
  query GetFeatureFlag($id: ID!) {
    getFeatureFlag(id: $id) {
      id
      isEnabled
      createdAt
      updatedAt
    }
  }
`;
export const listFeatureFlags = /* GraphQL */ `
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
export const getGooglePlace = /* GraphQL */ `
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
export const googlePlacesByIsValidByDataLastCheckedAt = /* GraphQL */ `
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
export const googlePlacesByIsValidByDataLastUpdatedAt = /* GraphQL */ `
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
export const getMinimumVersion = /* GraphQL */ `
  query GetMinimumVersion($id: ID!) {
    getMinimumVersion(id: $id) {
      id
      minimumVersion
      createdAt
      updatedAt
    }
  }
`;
export const getNotification = /* GraphQL */ `
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
export const listNotifications = /* GraphQL */ `
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
export const listNotificationsByReceiverUser = /* GraphQL */ `
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
export const getPhotographer = /* GraphQL */ `
  query GetPhotographer($id: ID!) {
    getPhotographer(id: $id) {
      id
      name
      url
      pendingMigration
    }
  }
`;
export const listPhotographers = /* GraphQL */ `
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
export const listPhotographersByName = /* GraphQL */ `
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
export const privateGetPost = /* GraphQL */ `
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
export const privateListPosts = /* GraphQL */ `
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
export const privateListPostsByTripByUser = /* GraphQL */ `
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
export const privateGetTimelineEntry = /* GraphQL */ `
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
export const privateGetTrip = /* GraphQL */ `
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
export const privateListTripDestinationUsers = /* GraphQL */ `
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
export const listTripDestinationUsersByTripByDestination = /* GraphQL */ `
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
export const listUpdatesByType = /* GraphQL */ `
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
export const getUser = /* GraphQL */ `
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
export const listUsers = /* GraphQL */ `
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
export const getUserByUsername = /* GraphQL */ `
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
export const searchUsers = /* GraphQL */ `
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
export const privateListUserAttractions = /* GraphQL */ `
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
export const userAttractionsByAttraction = /* GraphQL */ `
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
export const getUserBlock = /* GraphQL */ `
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
export const listUserBlocks = /* GraphQL */ `
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
export const privateListUserContacts = /* GraphQL */ `
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
export const privateGetUserContactsByUserByContactName = /* GraphQL */ `
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
export const getUserFollow = /* GraphQL */ `
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
export const listUserFollows = /* GraphQL */ `
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
export const getUserReferral = /* GraphQL */ `
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
export const listUserReferrals = /* GraphQL */ `
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
export const privateListUserSessionsByCreatedAt = /* GraphQL */ `
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
export const listUserTripByTrip = /* GraphQL */ `
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
export const signUpCheckGetUserByUsername = /* GraphQL */ `
  query SignUpCheckGetUserByUsername($username: String) {
    signUpCheckGetUserByUsername(username: $username)
  }
`;
export const signInErrorCheckIfUsernameExists = /* GraphQL */ `
  query SignInErrorCheckIfUsernameExists($username: String) {
    signInErrorCheckIfUsernameExists(username: $username) {
      provider
    }
  }
`;
