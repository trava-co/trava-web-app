/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const generateTripPlan = /* GraphQL */ `query GenerateTripPlan(
  $attractions: [TripPlanAttraction]!
  $group: TripPlanGroup!
  $config: GenerateTripPlanConfigInput
) {
  generateTripPlan(attractions: $attractions, group: $group, config: $config) {
    plan {
      day
      order
      attractionId
      locId
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GenerateTripPlanQueryVariables,
  APITypes.GenerateTripPlanQuery
>;
export const getAttractionPhotos = /* GraphQL */ `query GetAttractionPhotos($input: GetAttractionPhotosInput!) {
  getAttractionPhotos(input: $input)
}
` as GeneratedQuery<
  APITypes.GetAttractionPhotosQueryVariables,
  APITypes.GetAttractionPhotosQuery
>;
export const generateAttractionDetails = /* GraphQL */ `query GenerateAttractionDetails($attractionId: String!) {
  generateAttractionDetails(attractionId: $attractionId)
}
` as GeneratedQuery<
  APITypes.GenerateAttractionDetailsQueryVariables,
  APITypes.GenerateAttractionDetailsQuery
>;
export const mapBoxGetDistances = /* GraphQL */ `query MapBoxGetDistances($input: MapBoxAttractionLocationsInput!) {
  mapBoxGetDistances(input: $input) {
    locations {
      attractionId_1
      attractionId_2
      distance
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MapBoxGetDistancesQueryVariables,
  APITypes.MapBoxGetDistancesQuery
>;
export const mapBoxGetPlaces = /* GraphQL */ `query MapBoxGetPlaces($input: MapboxGetPlacesInput) {
  mapBoxGetPlaces(input: $input) {
    location {
      street
      number
      city
      state
      postCode
      country
      __typename
    }
    placeName
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MapBoxGetPlacesQueryVariables,
  APITypes.MapBoxGetPlacesQuery
>;
export const mapBoxGetToken = /* GraphQL */ `query MapBoxGetToken {
  mapBoxGetToken {
    token
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MapBoxGetTokenQueryVariables,
  APITypes.MapBoxGetTokenQuery
>;
export const checkForExistingCards = /* GraphQL */ `query CheckForExistingCards($input: CheckForExistingCardsInput!) {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CheckForExistingCardsQueryVariables,
  APITypes.CheckForExistingCardsQuery
>;
export const getAttractionsToTagToPost = /* GraphQL */ `query GetAttractionsToTagToPost($input: GetAttractionsToTagToPostInput!) {
  getAttractionsToTagToPost(input: $input) {
    attractions {
      id
      name
      destinationName
      attractionCategories
      bucketListCount
      type
      isTravaCreated
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAttractionsToTagToPostQueryVariables,
  APITypes.GetAttractionsToTagToPostQuery
>;
export const googleGetPlaces = /* GraphQL */ `query GoogleGetPlaces($input: GoogleGetPlacesInput) {
  googleGetPlaces(input: $input) {
    mainText
    secondaryText
    placeId
    types
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GoogleGetPlacesQueryVariables,
  APITypes.GoogleGetPlacesQuery
>;
export const googleGetPlaceDetails = /* GraphQL */ `query GoogleGetPlaceDetails($input: GoogleGetPlaceDetailsInput) {
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
      __typename
    }
    placeName
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GoogleGetPlaceDetailsQueryVariables,
  APITypes.GoogleGetPlaceDetailsQuery
>;
export const flightStatsGetScheduleDetails = /* GraphQL */ `query FlightStatsGetScheduleDetails(
  $input: FlightStatsGetScheduleDetailsInput
) {
  flightStatsGetScheduleDetails(input: $input) {
    appendix {
      __typename
    }
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
      __typename
    }
    request {
      departing
      url
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FlightStatsGetScheduleDetailsQueryVariables,
  APITypes.FlightStatsGetScheduleDetailsQuery
>;
export const homeTabsFeed = /* GraphQL */ `query HomeTabsFeed {
  homeTabsFeed {
    stories {
      storyId
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeTabsFeedQueryVariables,
  APITypes.HomeTabsFeedQuery
>;
export const homeTabsFeedPeopleOnThisTrip = /* GraphQL */ `query HomeTabsFeedPeopleOnThisTrip($input: HomeTabsFeedPeopleOnThisTripInput) {
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
      __typename
    }
    userFollows {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeTabsFeedPeopleOnThisTripQueryVariables,
  APITypes.HomeTabsFeedPeopleOnThisTripQuery
>;
export const homeTabsFeedPostComments = /* GraphQL */ `query HomeTabsFeedPostComments($input: HomeTabsFeedPostCommentsInput) {
  homeTabsFeedPostComments(input: $input) {
    id
    userId
    tripId
    avatar {
      bucket
      region
      key
      googlePhotoReference
      __typename
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeTabsFeedPostCommentsQueryVariables,
  APITypes.HomeTabsFeedPostCommentsQuery
>;
export const homeTabsAccountTrips = /* GraphQL */ `query HomeTabsAccountTrips($input: HomeTabsAccountTripsInput) {
  homeTabsAccountTrips(input: $input) {
    stories {
      storyId
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeTabsAccountTripsQueryVariables,
  APITypes.HomeTabsAccountTripsQuery
>;
export const homeTabsSuggestedFeed = /* GraphQL */ `query HomeTabsSuggestedFeed($input: HomeTabsSuggestedFeedInput) {
  homeTabsSuggestedFeed(input: $input) {
    stories {
      storyId
      __typename
    }
    sharedPostError {
      type
      authorId
      authorUsername
      __typename
    }
    referringUserInfo {
      id
      username
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeTabsSuggestedFeedQueryVariables,
  APITypes.HomeTabsSuggestedFeedQuery
>;
export const notificationPost = /* GraphQL */ `query NotificationPost($input: NotificationPostInput) {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationPostQueryVariables,
  APITypes.NotificationPostQuery
>;
export const getUserContacts = /* GraphQL */ `query GetUserContacts {
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
      __typename
    }
    contactsNotOnTrava {
      emailAddresses
      phoneNumbers
      name
      id
      __typename
    }
    userContactsOnTravaIds
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserContactsQueryVariables,
  APITypes.GetUserContactsQuery
>;
export const exploreSearchAttractions = /* GraphQL */ `query ExploreSearchAttractions($input: ExploreSearchAttractionsInput) {
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
      __typename
    }
    nextPageExists
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ExploreSearchAttractionsQueryVariables,
  APITypes.ExploreSearchAttractionsQuery
>;
export const exploreMapSearchAttractions = /* GraphQL */ `query ExploreMapSearchAttractions($input: ExploreMapSearchAttractionsInput) {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ExploreMapSearchAttractionsQueryVariables,
  APITypes.ExploreMapSearchAttractionsQuery
>;
export const openSearchDestinations = /* GraphQL */ `query OpenSearchDestinations($input: OpenSearchDestinationsInput) {
  openSearchDestinations(input: $input) {
    featured {
      id
      name
      icon
      state
      country
      numberOfExperiences
      __typename
    }
    other {
      id
      name
      icon
      state
      country
      numberOfExperiences
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.OpenSearchDestinationsQueryVariables,
  APITypes.OpenSearchDestinationsQuery
>;
export const exploreTopUsers = /* GraphQL */ `query ExploreTopUsers {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ExploreTopUsersQueryVariables,
  APITypes.ExploreTopUsersQuery
>;
export const openSearchListNearbyAttractions = /* GraphQL */ `query OpenSearchListNearbyAttractions(
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.OpenSearchListNearbyAttractionsQueryVariables,
  APITypes.OpenSearchListNearbyAttractionsQuery
>;
export const addToItinerarySearch = /* GraphQL */ `query AddToItinerarySearch($input: AddToItinerarySearchInput) {
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
      __typename
    }
    nextPageExists
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AddToItinerarySearchQueryVariables,
  APITypes.AddToItinerarySearchQuery
>;
export const addToItineraryMapSearch = /* GraphQL */ `query AddToItineraryMapSearch($input: AddToItineraryMapSearchInput) {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AddToItineraryMapSearchQueryVariables,
  APITypes.AddToItineraryMapSearchQuery
>;
export const getExploreVotingList = /* GraphQL */ `query GetExploreVotingList($input: GetExploreVotingListInput!) {
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
      __typename
    }
    nextPageExists
    votedOnAttractionIds
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetExploreVotingListQueryVariables,
  APITypes.GetExploreVotingListQuery
>;
export const getGoogleAPIKey = /* GraphQL */ `query GetGoogleAPIKey($input: GetGoogleAPIKeyInput!) {
  getGoogleAPIKey(input: $input) {
    key
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGoogleAPIKeyQueryVariables,
  APITypes.GetGoogleAPIKeyQuery
>;
export const getAttractionsForScheduler = /* GraphQL */ `query GetAttractionsForScheduler($input: GetAttractionsForScheduler) {
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
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAttractionsForSchedulerQueryVariables,
  APITypes.GetAttractionsForSchedulerQuery
>;
export const getAttraction = /* GraphQL */ `query GetAttraction($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetAttractionQueryVariables,
  APITypes.GetAttractionQuery
>;
export const listAttractions = /* GraphQL */ `query ListAttractions(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttractionsQueryVariables,
  APITypes.ListAttractionsQuery
>;
export const listAttractionsByDestination = /* GraphQL */ `query ListAttractionsByDestination(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttractionsByDestinationQueryVariables,
  APITypes.ListAttractionsByDestinationQuery
>;
export const listAttractionsByType = /* GraphQL */ `query ListAttractionsByType(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttractionsByTypeQueryVariables,
  APITypes.ListAttractionsByTypeQuery
>;
export const listAttractionsByIsTravaCreatedByDestination = /* GraphQL */ `query ListAttractionsByIsTravaCreatedByDestination(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttractionsByIsTravaCreatedByDestinationQueryVariables,
  APITypes.ListAttractionsByIsTravaCreatedByDestinationQuery
>;
export const privateListAttractionsByCreatedAt = /* GraphQL */ `query PrivateListAttractionsByCreatedAt(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListAttractionsByCreatedAtQueryVariables,
  APITypes.PrivateListAttractionsByCreatedAtQuery
>;
export const searchAttractions = /* GraphQL */ `query SearchAttractions(
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
      __typename
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
            __typename
          }
        }
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchAttractionsQueryVariables,
  APITypes.SearchAttractionsQuery
>;
export const privateGetAttractionSwipe = /* GraphQL */ `query PrivateGetAttractionSwipe(
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
` as GeneratedQuery<
  APITypes.PrivateGetAttractionSwipeQueryVariables,
  APITypes.PrivateGetAttractionSwipeQuery
>;
export const listAttractionSwipesByTripByDestination = /* GraphQL */ `query ListAttractionSwipesByTripByDestination(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttractionSwipesByTripByDestinationQueryVariables,
  APITypes.ListAttractionSwipesByTripByDestinationQuery
>;
export const privateListAttractionSwipesByUpdatedAt = /* GraphQL */ `query PrivateListAttractionSwipesByUpdatedAt(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListAttractionSwipesByUpdatedAtQueryVariables,
  APITypes.PrivateListAttractionSwipesByUpdatedAtQuery
>;
export const getComment = /* GraphQL */ `query GetComment($id: ID!) {
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
      __typename
    }
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCommentQueryVariables,
  APITypes.GetCommentQuery
>;
export const getDestination = /* GraphQL */ `query GetDestination($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetDestinationQueryVariables,
  APITypes.GetDestinationQuery
>;
export const listDestinations = /* GraphQL */ `query ListDestinations(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDestinationsQueryVariables,
  APITypes.ListDestinationsQuery
>;
export const listDestinationsByIsTravaCreated = /* GraphQL */ `query ListDestinationsByIsTravaCreated(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDestinationsByIsTravaCreatedQueryVariables,
  APITypes.ListDestinationsByIsTravaCreatedQuery
>;
export const listDestinationsByLabel = /* GraphQL */ `query ListDestinationsByLabel(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDestinationsByLabelQueryVariables,
  APITypes.ListDestinationsByLabelQuery
>;
export const searchDestinations = /* GraphQL */ `query SearchDestinations(
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
      __typename
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
            __typename
          }
        }
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchDestinationsQueryVariables,
  APITypes.SearchDestinationsQuery
>;
export const privateGetDistance = /* GraphQL */ `query PrivateGetDistance($key: String!) {
  privateGetDistance(key: $key) {
    key
    value
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGetDistanceQueryVariables,
  APITypes.PrivateGetDistanceQuery
>;
export const getFeatureFlag = /* GraphQL */ `query GetFeatureFlag($id: ID!) {
  getFeatureFlag(id: $id) {
    id
    isEnabled
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFeatureFlagQueryVariables,
  APITypes.GetFeatureFlagQuery
>;
export const listFeatureFlags = /* GraphQL */ `query ListFeatureFlags(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFeatureFlagsQueryVariables,
  APITypes.ListFeatureFlagsQuery
>;
export const getGooglePlace = /* GraphQL */ `query GetGooglePlace($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetGooglePlaceQueryVariables,
  APITypes.GetGooglePlaceQuery
>;
export const googlePlacesByIsValidByDataLastCheckedAt = /* GraphQL */ `query GooglePlacesByIsValidByDataLastCheckedAt(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GooglePlacesByIsValidByDataLastCheckedAtQueryVariables,
  APITypes.GooglePlacesByIsValidByDataLastCheckedAtQuery
>;
export const googlePlacesByIsValidByDataLastUpdatedAt = /* GraphQL */ `query GooglePlacesByIsValidByDataLastUpdatedAt(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GooglePlacesByIsValidByDataLastUpdatedAtQueryVariables,
  APITypes.GooglePlacesByIsValidByDataLastUpdatedAtQuery
>;
export const getMinimumVersion = /* GraphQL */ `query GetMinimumVersion($id: ID!) {
  getMinimumVersion(id: $id) {
    id
    minimumVersion
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMinimumVersionQueryVariables,
  APITypes.GetMinimumVersionQuery
>;
export const getNotification = /* GraphQL */ `query GetNotification($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetNotificationQueryVariables,
  APITypes.GetNotificationQuery
>;
export const listNotifications = /* GraphQL */ `query ListNotifications(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsQueryVariables,
  APITypes.ListNotificationsQuery
>;
export const listNotificationsByReceiverUser = /* GraphQL */ `query ListNotificationsByReceiverUser(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsByReceiverUserQueryVariables,
  APITypes.ListNotificationsByReceiverUserQuery
>;
export const getPhotographer = /* GraphQL */ `query GetPhotographer($id: ID!) {
  getPhotographer(id: $id) {
    id
    name
    url
    pendingMigration
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPhotographerQueryVariables,
  APITypes.GetPhotographerQuery
>;
export const listPhotographers = /* GraphQL */ `query ListPhotographers(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPhotographersQueryVariables,
  APITypes.ListPhotographersQuery
>;
export const listPhotographersByName = /* GraphQL */ `query ListPhotographersByName(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPhotographersByNameQueryVariables,
  APITypes.ListPhotographersByNameQuery
>;
export const privateGetPost = /* GraphQL */ `query PrivateGetPost($id: ID!) {
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
` as GeneratedQuery<
  APITypes.PrivateGetPostQueryVariables,
  APITypes.PrivateGetPostQuery
>;
export const privateListPosts = /* GraphQL */ `query PrivateListPosts(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListPostsQueryVariables,
  APITypes.PrivateListPostsQuery
>;
export const privateListPostsByTripByUser = /* GraphQL */ `query PrivateListPostsByTripByUser(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListPostsByTripByUserQueryVariables,
  APITypes.PrivateListPostsByTripByUserQuery
>;
export const privateGetTimelineEntry = /* GraphQL */ `query PrivateGetTimelineEntry($id: ID!) {
  privateGetTimelineEntry(id: $id) {
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
` as GeneratedQuery<
  APITypes.PrivateGetTimelineEntryQueryVariables,
  APITypes.PrivateGetTimelineEntryQuery
>;
export const privateGetTrip = /* GraphQL */ `query PrivateGetTrip($id: ID!) {
  privateGetTrip(id: $id) {
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
` as GeneratedQuery<
  APITypes.PrivateGetTripQueryVariables,
  APITypes.PrivateGetTripQuery
>;
export const privateListTripDestinationUsers = /* GraphQL */ `query PrivateListTripDestinationUsers(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListTripDestinationUsersQueryVariables,
  APITypes.PrivateListTripDestinationUsersQuery
>;
export const listTripDestinationUsersByTripByDestination = /* GraphQL */ `query ListTripDestinationUsersByTripByDestination(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTripDestinationUsersByTripByDestinationQueryVariables,
  APITypes.ListTripDestinationUsersByTripByDestinationQuery
>;
export const listUpdatesByType = /* GraphQL */ `query ListUpdatesByType(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUpdatesByTypeQueryVariables,
  APITypes.ListUpdatesByTypeQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getUserByUsername = /* GraphQL */ `query GetUserByUsername(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserByUsernameQueryVariables,
  APITypes.GetUserByUsernameQuery
>;
export const searchUsers = /* GraphQL */ `query SearchUsers(
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
      __typename
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
            __typename
          }
        }
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchUsersQueryVariables,
  APITypes.SearchUsersQuery
>;
export const privateListUserAttractions = /* GraphQL */ `query PrivateListUserAttractions(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListUserAttractionsQueryVariables,
  APITypes.PrivateListUserAttractionsQuery
>;
export const userAttractionsByAttraction = /* GraphQL */ `query UserAttractionsByAttraction(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserAttractionsByAttractionQueryVariables,
  APITypes.UserAttractionsByAttractionQuery
>;
export const getUserBlock = /* GraphQL */ `query GetUserBlock($userId: ID!, $blockedUserId: ID!) {
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
` as GeneratedQuery<
  APITypes.GetUserBlockQueryVariables,
  APITypes.GetUserBlockQuery
>;
export const listUserBlocks = /* GraphQL */ `query ListUserBlocks(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserBlocksQueryVariables,
  APITypes.ListUserBlocksQuery
>;
export const privateListUserContacts = /* GraphQL */ `query PrivateListUserContacts(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListUserContactsQueryVariables,
  APITypes.PrivateListUserContactsQuery
>;
export const privateGetUserContactsByUserByContactName = /* GraphQL */ `query PrivateGetUserContactsByUserByContactName(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGetUserContactsByUserByContactNameQueryVariables,
  APITypes.PrivateGetUserContactsByUserByContactNameQuery
>;
export const getUserFollow = /* GraphQL */ `query GetUserFollow($userId: ID!, $followedUserId: ID!) {
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
` as GeneratedQuery<
  APITypes.GetUserFollowQueryVariables,
  APITypes.GetUserFollowQuery
>;
export const listUserFollows = /* GraphQL */ `query ListUserFollows(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserFollowsQueryVariables,
  APITypes.ListUserFollowsQuery
>;
export const getUserReferral = /* GraphQL */ `query GetUserReferral($userId: ID!, $referredUserId: ID!) {
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
` as GeneratedQuery<
  APITypes.GetUserReferralQueryVariables,
  APITypes.GetUserReferralQuery
>;
export const listUserReferrals = /* GraphQL */ `query ListUserReferrals(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserReferralsQueryVariables,
  APITypes.ListUserReferralsQuery
>;
export const privateListUserSessionsByCreatedAt = /* GraphQL */ `query PrivateListUserSessionsByCreatedAt(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateListUserSessionsByCreatedAtQueryVariables,
  APITypes.PrivateListUserSessionsByCreatedAtQuery
>;
export const listUserTripByTrip = /* GraphQL */ `query ListUserTripByTrip(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserTripByTripQueryVariables,
  APITypes.ListUserTripByTripQuery
>;
export const signUpCheckGetUserByUsername = /* GraphQL */ `query SignUpCheckGetUserByUsername($username: String) {
  signUpCheckGetUserByUsername(username: $username)
}
` as GeneratedQuery<
  APITypes.SignUpCheckGetUserByUsernameQueryVariables,
  APITypes.SignUpCheckGetUserByUsernameQuery
>;
export const signInErrorCheckIfUsernameExists = /* GraphQL */ `query SignInErrorCheckIfUsernameExists($username: String) {
  signInErrorCheckIfUsernameExists(username: $username) {
    provider
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SignInErrorCheckIfUsernameExistsQueryVariables,
  APITypes.SignInErrorCheckIfUsernameExistsQuery
>;
