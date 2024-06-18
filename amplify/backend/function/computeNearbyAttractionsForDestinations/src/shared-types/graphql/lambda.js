"use strict";
/**
 * IMPORTANT NOTES:
 * In future if we separate mobile app repo from backend
 * then this file can be used directly in the backend repo
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaGetReferringUserInfo = exports.lambdaGetUserAndDeckAttractionsAndTripPlan = exports.lambdaGetUserAndDeckAttractions = exports.lambdaGetUser = exports.lambdaUpdateUser = exports.lambdaPrivateDeleteTripDestinationUser = exports.lambdaPrivateDeleteTimelineEntryMember = exports.lambdaPrivateUpdateAttraction = exports.lambdaPrivateCreateUserTrip = exports.lambdaPrivateCreateUserReferral = exports.lambdaPrivateCreateUserFollow = exports.lambdaPrivateCreateTripDestinationUser = exports.lambdaPrivateCreateTimelineEntryMember = exports.lambdaCustomPrivateCreatePost = exports.lambdaGetUserPrivacy = exports.lambdaGetTripId = exports.lambdaHomeTabsFeedPostCommentsCreateCommentGetPost = exports.lambdaHomeTabsFeedPostCommentsGetPost = exports.lambdaHomeTabsFeedPostDetailsGetUserFollow = exports.lambdaHomeTabsFeedPostDetailsGetMembers = exports.lambdaHomeTabsAccountTripsGetPosts = exports.lambdaHomeTabsFeedGetPosts = exports.lambdaHomeTabsFeedGetViewedPosts = exports.lambdaPrivateListPosts = exports.lambdaHomeTabsFeedGetFollowingUsers = exports.lambdaGetAttractionDetailsForSearchAttraction = exports.lambdaGetDetailsForAttractionGeneration = exports.lambdaGetAttractionFailureCount = exports.lambdaGetAttraction = exports.lambdaGetTripTimelineByTrip = exports.lambdaCustomPrivateUpdateTimelineEntry = exports.lambdaPrivateGetTimelineEntry = exports.lambdaCustomPrivateCreateAttraction = exports.lambdaCustomCreateTripDestination = exports.lambdaGetTripDestination = exports.lambdaGetTripDestinationAttractionSwipes = exports.lambdaGetUserAttractionSwipes = exports.lambdaPrivateListAttractionsByCreatedAt = exports.lambdaPrivateListAttractionSwipesByUpdatedAt = exports.lambdaPrivateListUserAttractions = exports.lambdaCreateNotification = exports.lambdaCustomPrivateUpdateTrip = exports.lambdaCustomPrivateCreateTrip = exports.lambdaCreateUserTrip = exports.lambdaGetDestination = exports.lambdaPrivateCreateTripDestination = exports.lambdaListDestinations = exports.lambdaGetTripDestinations = exports.lambdaGetUserTrips = exports.lambdaPrivateListUserSessionsByCreatedAt = void 0;
exports.lambdaListAttractionSwipesByTripByDestination = exports.lambdaGooglePlacesByIsValidByDataLastCheckedAt = exports.lambdaPrivateUpdateGooglePlace = exports.lambdaPrivateCreateGooglePlace = exports.lambdaGetGooglePlace = exports.lambdaPrivateGetUserContactsByUserByContactName = exports.lambdaCustomSearchUsers = exports.lambdaListUsers = exports.lambdaPrivateDeleteUserContact = exports.lambdaPrivateUpdateUserContact = exports.lambdaPrivateCreateUserContact = exports.lambdaPrivateListUserContacts = exports.lambdaListAttractions = exports.lambdaPrivateUpdatePost = exports.lambdaListBlocksByUser = exports.lambdaListBlockedByByUser = exports.lambdaDeleteUserFollow = exports.lambdaGetUserFollow = exports.lambdaPrivateCreateUserBlock = exports.lambdaGetUserAuthProviderByUsername = exports.lambdaGetUserByUsername = exports.lambdaPrivateListPostsBySharedStory = exports.lambdaPrivateListPostsByTrip = exports.lambdaPrivateGetPost = exports.lambdaPrivateGetUserFollow = exports.lambdaPrivateGetStoryAndAuthorInfoFromPost = exports.lambdaPrivateGetStoryInfoFromPost = exports.lambdaPrivateDeleteAttractionSwipe = exports.lambdaPrivateGetAttractionSwipe = exports.lambdaPrivateListTripDestinationUsers = exports.lambdaGetPostNotificationPost = exports.lambdaGetPostLikeDislikePost = exports.lambdaGetCommentNotifications = exports.lambdaGetAttractionNotifications = exports.lambdaGetTripNotifications = exports.lambdaGetUserNotifications = exports.lambdaChatCreateTripMessageNotificationsGetReceiversIds = exports.lambdaUpdateNotification = exports.lambdaListNotificationsByReceiverUser = exports.lambdaGetUserFollowedBy = exports.lambdaPrivateUpdateUser = exports.lambdaPrivateUpdateUserTrip = exports.lambdaPrivateUpdateUserFollow = exports.lambdaPrivateDeleteUserTrip = void 0;
const fragments_1 = require("./fragments");
exports.lambdaPrivateListUserSessionsByCreatedAt = `
  query LambdaPrivateListUserSessionsByCreatedAt(
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
exports.lambdaGetUserTrips = `
  query LambdaGetUserTrips($userId: ID!, $tripId: ID!) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            members {
              items {
                userId
                tripId
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetTripDestinations = `
  query LambdaGetTripDestinations($userId: ID!, $tripId: ID!) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            tripDestinations {
              items {
                destinationId
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaListDestinations = `
  query LambdaListDestinations(
    $label: String!
    $filter: ModelDestinationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listDestinationsByLabel(
      label: $label
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        googlePlaceId
        coords {
          long
          lat
        }
        deletedAt
      }
      nextToken
    }
  }
`;
exports.lambdaPrivateCreateTripDestination = `
  mutation LambdaPrivateCreateTripDestination(
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
        state
        country
        continent
        coords {
          lat
          long
        }
        deletedAt
        isTravaCreated
        googlePlaceId
        featured
        altName
        label
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
exports.lambdaGetDestination = `
  query LambdaGetDestination($id: ID!) {
    getDestination(id: $id) {
      id
      author {
        id
        appleId
        dateOfBirth
        description
        email
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
      }
      timezone
      attractions {
        nextToken
      }
      nearbyThingsToDoCount
      nearbyPlacesToEatCount
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
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaCreateUserTrip = `
  mutation LambdaCreateUserTrip($input: CreateUserTripInput!) {
    createUserTrip(input: $input) {
      userId
      tripId
    }
  }
`;
exports.lambdaCustomPrivateCreateTrip = `
  mutation LambdaCustomPrivateCreateTrip($input: CreateTripInput!, $condition: ModelTripConditionInput) {
    privateCreateTrip(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaCustomPrivateUpdateTrip = `
  mutation LambdaCustomPrivateUpdateTrip($input: UpdateTripInput!, $condition: ModelTripConditionInput) {
    privateUpdateTrip(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaCreateNotification = `
  mutation LambdaCreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      receiverUserId
      senderUserId
    }
  }
`;
exports.lambdaPrivateListUserAttractions = `
  query LambdaPrivateListUserAttractions(
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
exports.lambdaPrivateListAttractionSwipesByUpdatedAt = `
  query LambdaPrivateListAttractionSwipesByUpdatedAt(
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
        destination {
          id
          name
        }
        swipe
        label
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.lambdaPrivateListAttractionsByCreatedAt = `
  query LambdaPrivateListAttractionsByCreatedAt(
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
        bestVisited
        costCurrency
        cost
        costNote
        costType
        descriptionLong
        descriptionShort
        destinationId
        destination {
          id
          name
        }
        duration
        reservation
        name
        reservationNote
        type
        isTravaCreated
        deletedAt
        privacy
        bucketListCount
        authorType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.lambdaGetUserAttractionSwipes = `
  query LambdaGetUserAttractionSwipes(
    $userId: ID!
    $tripId: ID!
    $attractionSwipesByUserNextToken: String
    $attractionSwipesByUserLimit: Int
  ) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            attractionSwipesByUser(
              userId: { eq: $userId }
              nextToken: $attractionSwipesByUserNextToken
              limit: $attractionSwipesByUserLimit
            ) {
              items {
                attractionId
              }
              nextToken
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetTripDestinationAttractionSwipes = `
  query LambdaGetTripDestinationAttractionSwipes(
    $destinationId: ID!
    $userId: ID!
    $tripId: ID!
    $attractionSwipesNextToken: String
    $attractionSwipesLimit: Int
  ) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            attractionSwipes(
              nextToken: $attractionSwipesNextToken
              limit: $attractionSwipesLimit
              destinationId: { eq: $destinationId }
            ) {
              items {
                attractionId
                userId
              }
              nextToken
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetTripDestination = `
  query LambdaGetTripDestination($destinationId: ID!, $userId: ID!, $tripId: ID!) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            tripDestinations(destinationId: { eq: $destinationId }) {
              items {
                destinationId
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaCustomCreateTripDestination = `
  mutation LambdaCustomCreateTripDestination($input: CreateTripDestinationInput!) {
    createTripDestination(input: $input) {
      tripId
      destinationId
    }
  }
`;
exports.lambdaCustomPrivateCreateAttraction = `
  mutation LambdaCustomPrivateCreateAttraction(
    $input: CreateAttractionInput!
    $condition: ModelAttractionConditionInput
  ) {
    privateCreateAttraction(input: $input, condition: $condition) {
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
      images {
        bucket
        region
        key
      }
      reservation
      locations {
        id
        displayOrder
        startLoc {
          id
          googlePlace {
            data {
              coords {
                long
                lat
              }
            }
          }
          googlePlaceId
        }
        endLoc {
          id
          googlePlace {
            data {
              coords {
                long
                lat
              }
            }
          }
          googlePlaceId
        }
      }
      name
      reservationNote
      type
      isTravaCreated
      authorType
      createdAt
      updatedAt
      destination {
        id
        name
        icon
        timezone
        createdAt
        updatedAt
      }
      author {
        id
        username
        name
        privacy
        facebookId
        googleId
        appleId
        description
        location
        createdAt
        updatedAt
      }
      privacy
      bucketListCount
      label
    }
  }
`;
exports.lambdaPrivateGetTimelineEntry = `
  query LambdaPrivateGetTimelineEntry($id: ID!) {
    privateGetTimelineEntry(id: $id) {
      id
      tripId
      members {
        items {
          userId
        }
      }
    }
  }
`;
exports.lambdaCustomPrivateUpdateTimelineEntry = `
  mutation LambdaCustomPrivateUpdateTimelineEntry(
    $input: UpdateTimelineEntryInput!
    $condition: ModelTimelineEntryConditionInput
  ) {
    privateUpdateTimelineEntry(input: $input, condition: $condition) {
      id
      tripId
      timelineEntryType
      notes
      date
      time
      #      flightDetails {
      #        flight_date
      #        flight_status
      #      }
      rentalPickupLocation
      rentalDropoffLocation
      lodgingArrivalNameAndAddress
      lodgingDepartureNameAndAddress
      createdAt
      updatedAt
      members {
        nextToken
        items {
          userId
          timelineEntryId
          createdAt
          updatedAt
        }
      }
    }
  }
`;
exports.lambdaGetTripTimelineByTrip = `
  query LambdaGetTripTimelineByTrip($userId: ID!, $tripId: ID!) {
    getUser(id: $userId) {
      id
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            timelineEntries {
              items {
                id
                date
                flightDetails {
                  scheduledFlights {
                    carrierFsCode
                    flightNumber
                    departureAirportFsCode
                    arrivalAirportFsCode
                  }
                }
                members {
                  items {
                    userId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetAttraction = `
  query LambdaGetAttraction($id: ID!) {
    getAttraction(id: $id) {
      id
      bucketListCount
      privacy
      authorId
      authorType
    }
  }
`;
exports.lambdaGetAttractionFailureCount = `
  query LambdaGetAttractionFailureCount($id: ID!) {
    getAttraction(id: $id) {
      id
      generation {
        failureCount
      }
    }
  }
`;
exports.lambdaGetDetailsForAttractionGeneration = `
  query LambdaGetDetailsForAttractionGeneration($id: ID!) {
    getAttraction(id: $id) {
      name
      id
      destinationId
      type
      authorType
      generation {
        step
        status
        failureCount
        lastUpdatedAt
      }
      locations {
        id
        displayOrder
        startLoc {
          id
          googlePlace {
            id
            data {
              coords {
                long
                lat
              }
              city
              state
              country
              continent
              phone
              name
              formattedAddress
              editorialSummary
              hours {
                weekdayText
                periods {
                  open {
                    day
                    time
                  }
                  close {
                    day
                    time
                  }
                }
              }
              reservable
              mealServices {
                servesBreakfast
                servesBrunch
                servesLunch
                servesDinner
                dineIn
                takeout
                delivery
                servesBeer
                servesWine
                servesVegetarianFood
              }
              reviews {
                text
              }
              price
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetAttractionDetailsForSearchAttraction = `
  query LambdaGetAttractionDetailsForSearchAttraction($id: ID!) {
    getAttraction(id: $id) {
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
      images {
        bucket
        region
        key
      }
      isTravaCreated
      rank
      reservation
      locations {
        id
        displayOrder
        deleted
        startLoc {
          ...AttractionLocationCustomGetAttraction
        }
        endLoc {
          ...AttractionLocationCustomGetAttraction
        }
      }
      name
      reservationNote
      type
      createdAt
      updatedAt
      destination {
        id
        name
        icon
        timezone
        createdAt
        updatedAt
        featured
      }
      author {
        id
        username
        name
        avatar {
          key
          bucket
          region
        }
      }
      seasons {
        startMonth
        startDay
        endMonth
        endDay
      }
      deletedAt
      bucketListCount
      privacy
      recommendationBadges
    }
  }
  ${fragments_1.fragmentAttractionLocationCustomGetAttraction}
`;
exports.lambdaHomeTabsFeedGetFollowingUsers = `
  query LambdaHomeTabsFeedGetFollowingUsers($id: ID!, $followsNextToken: String, $followsLimit: Int) {
    getUser(id: $id) {
      follows(nextToken: $followsNextToken, limit: $followsLimit) {
        items {
          followedUserId
          approved
        }
        nextToken
      }
    }
  }
`;
exports.lambdaPrivateListPosts = `
  query LambdaPrivateListPosts($filter: ModelPostFilterInput, $limit: Int, $nextToken: String) {
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
exports.lambdaHomeTabsFeedGetViewedPosts = `
  query LambdaHomeTabsFeedGetViewedPosts(
    $id: ID!
    $viewedNextToken: String
    $viewedLimit: Int
    $createdDateGTTimestamp: String
  ) {
    getUser(id: $id) {
      viewedPosts(nextToken: $viewedNextToken, limit: $viewedLimit, createdAt: { gt: $createdDateGTTimestamp }) {
        items {
          postId
        }
        nextToken
      }
    }
  }
`;
exports.lambdaHomeTabsFeedGetPosts = `
  query LambdaHomeTabsFeedGetPosts(
    $id: ID!
    $postsNextToken: String
    $postsLimit: Int
    $createdDateGTTimestamp: String
  ) {
    getUser(id: $id) {
      id
      username
      avatar {
        bucket
        region
        key
      }
      privacy
      posts(
        sortDirection: DESC
        nextToken: $postsNextToken
        limit: $postsLimit
        createdAt: { gt: $createdDateGTTimestamp }
        filter: { deletedAt: { notContains: "" } }
      ) {
        items {
          id
          createdAt
          userId
          tripId
          description
          cloudinaryUrl
          trip {
            members {
              items {
                userId
              }
            }
          }
          destination {
            icon
            state
            country
            name
            coverImage {
              bucket
              region
              key
            }
          }
          attractionId
          attraction {
            name
            images {
              bucket
              region
              key
            }
          }
          likesCount
          commentsCount
          mediaType
          videoDuration
        }
        nextToken
      }
    }
  }
`;
exports.lambdaHomeTabsAccountTripsGetPosts = `
  query LambdaHomeTabsAccountTripsGetPosts(
    $id: ID!
    $postsNextToken: String
    $postsLimit: Int
    $createdDateGTTimestamp: String
  ) {
    getUser(id: $id) {
      id
      username
      avatar {
        bucket
        region
        key
      }
      privacy
      posts(
        sortDirection: DESC
        nextToken: $postsNextToken
        limit: $postsLimit
        createdAt: { gt: $createdDateGTTimestamp }
        filter: { deletedAt: { notContains: "" } }
      ) {
        items {
          id
          createdAt
          userId
          tripId
          description
          cloudinaryUrl
          trip {
            tripDestinations {
              items {
                destination {
                  name
                }
                startDate
                endDate
              }
            }
            members {
              items {
                userId
              }
            }
          }
          destination {
            id
            icon
            state
            country
            name
            googlePlaceId
            coverImage {
              bucket
              region
              key
            }
          }
          attractionId
          attraction {
            name
            images {
              bucket
              region
              key
            }
          }
          likesCount
          commentsCount
          mediaType
          videoDuration
        }
        nextToken
      }
    }
  }
`;
exports.lambdaHomeTabsFeedPostDetailsGetMembers = `
  query LambdaHomeTabsFeedPostDetailsGetMembers($tripId: ID!) {
    privateGetTrip(id: $tripId) {
      members {
        items {
          userId
          user {
            id
            username
            name
            avatar {
              key
              region
              bucket
            }
          }
        }
      }
    }
  }
`;
exports.lambdaHomeTabsFeedPostDetailsGetUserFollow = `
  query LambdaHomeTabsFeedPostDetailsGetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaHomeTabsFeedPostCommentsGetPost = `
  query LambdaHomeTabsFeedPostCommentsGetPost($id: ID!) {
    privateGetPost(id: $id) {
      id
      userId
      user {
        username
        avatar {
          bucket
          region
          key
        }
      }
      tripId
      trip {
        members {
          items {
            userId
          }
        }
      }
      description
      deletedAt
      comments(limit: 5000, sortDirection: DESC) {
        items {
          id
          text
          userId
          user {
            username
            avatar {
              bucket
              region
              key
            }
          }
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.lambdaHomeTabsFeedPostCommentsCreateCommentGetPost = `
  query LambdaHomeTabsFeedPostCommentsCreateCommentGetPost($id: ID!) {
    privateGetPost(id: $id) {
      userId
      tripId
    }
  }
`;
exports.lambdaGetTripId = `
  query LambdaGetTripId($tripId: ID!) {
    privateGetTrip(id: $tripId) {
      id
    }
  }
`;
exports.lambdaGetUserPrivacy = `
  query LambdaGetUserPrivacy($userId: ID!) {
    getUser(id: $userId) {
      id
      privacy
    }
  }
`;
exports.lambdaCustomPrivateCreatePost = `
  mutation LambdaCustomPrivateCreatePost($input: CreatePostInput!, $condition: ModelPostConditionInput) {
    privateCreatePost(input: $input, condition: $condition) {
      id
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      tripId
      trip {
        id
        name
        completed
        createdAt
        updatedAt
      }
      destinationId
      destination {
        id
        name
        icon
        timezone
        deletedAt
        isTravaCreated
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
        createdAt
        updatedAt
      }
      description
      commentsCount
      comments {
        nextToken
      }
      mediaType
      videoDuration

      cloudinaryUrl
      width
      height
      format
      createdAt
      updatedAt
      likesCount
    }
  }
`;
exports.lambdaPrivateCreateTimelineEntryMember = `
  mutation LambdaPrivateCreateTimelineEntryMember(
    $input: CreateTimelineEntryMemberInput!
    $condition: ModelTimelineEntryMemberConditionInput
  ) {
    privateCreateTimelineEntryMember(input: $input, condition: $condition) {
      timelineEntryId
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateCreateTripDestinationUser = `
  mutation LambdaPrivateCreateTripDestinationUser(
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
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
exports.lambdaPrivateCreateUserFollow = `
  mutation LambdaPrivateCreateUserFollow($input: CreateUserFollowInput!, $condition: ModelUserFollowConditionInput) {
    privateCreateUserFollow(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      followedUserId
      followedUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
exports.lambdaPrivateCreateUserReferral = `
  mutation LambdaPrivateCreateUserReferral(
    $input: CreateUserReferralInput!
    $condition: ModelUserReferralConditionInput
  ) {
    privateCreateUserReferral(input: $input, condition: $condition) {
      userId
      user {
        id
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      referredUserId
      referredUser {
        id
        name
        privacy
        pushNotifications
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
exports.lambdaPrivateCreateUserTrip = `
  mutation LambdaPrivateCreateUserTrip($input: CreateUserTripInput!, $condition: ModelUserTripConditionInput) {
    privateCreateUserTrip(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      tripId
      trip {
        id
        name
        completed
        createdAt
        updatedAt
      }
      status
      invitedByUserId
      invitedByUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateUpdateAttraction = `
  mutation LambdaPrivateUpdateAttraction($input: UpdateAttractionInput!, $condition: ModelAttractionConditionInput) {
    privateUpdateAttraction(input: $input, condition: $condition) {
      id
      attractionCategories
      attractionCuisine
      attractionTargetGroups
      author {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      authorId
      bestVisited
      costCurrency
      cost
      costNote
      costType
      descriptionLong
      descriptionShort
      destination {
        id
        name
        icon
        timezone
        deletedAt
        isTravaCreated
        createdAt
        updatedAt
      }
      destinationId
      duration
      generation {
        step
        status
        failureCount
        lastUpdatedAt
        lastFailureReason
      }
      images {
        bucket
        region
        key
      }
      reservation
      locations {
        id
        displayOrder
        startLoc {
          id
          googlePlace {
            data {
              coords {
                long
                lat
              }
              photos {
                photo_reference
                height
                width
                html_attributions
              }
            }
          }
          googlePlaceId
        }
        endLoc {
          id
          googlePlace {
            data {
              coords {
                long
                lat
              }
            }
          }
          googlePlaceId
        }
      }
      name
      reservationNote
      type
      isTravaCreated
      authorType
      deletedAt
      privacy
      bucketListCount
      createdAt
      updatedAt
      label
    }
  }
`;
exports.lambdaPrivateDeleteTimelineEntryMember = `
  mutation LambdaPrivateDeleteTimelineEntryMember(
    $input: DeleteTimelineEntryMemberInput!
    $condition: ModelTimelineEntryMemberConditionInput
  ) {
    privateDeleteTimelineEntryMember(input: $input, condition: $condition) {
      timelineEntryId
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateDeleteTripDestinationUser = `
  mutation LambdaPrivateDeleteTripDestinationUser(
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
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
exports.lambdaUpdateUser = `
  mutation LambdaUpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      appleId
      avatar {
        bucket
        region
        key
      }
      description
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
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
      privacy
      pushNotifications
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
exports.lambdaGetUser = `
  query LambdaGetUser($id: ID!) {
    getUser(id: $id) {
      id
      appleId
      avatar {
        bucket
        region
        key
      }
      description
      facebookId
      fcmToken
      followedBy {
        nextToken
      }
      follows {
        nextToken
      }
      googleId
      location
      name
      privacy
      pushNotifications
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
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaGetUserAndDeckAttractions = `
  query LambdaGetUserAndDeckAttractions($userId: ID!, $tripId: ID!, $destinationId: ID!, $type: ATTRACTION_TYPE) {
    getUser(id: $userId) {
      myCards(limit: 1000, filter: { deletedAt: { notContains: "" }, type: { eq: $type } }) {
        items {
          id
        }
      }
      bucketList(limit: 1000) {
        items {
          attractionId
          attraction {
            deletedAt
          }
        }
      }
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            tripDestinations(destinationId: { eq: $destinationId }) {
              items {
                destination {
                  name
                  coords {
                    lat
                    long
                  }
                }
                endDate
                startDate
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetUserAndDeckAttractionsAndTripPlan = `
  query LambdaGetUserAndDeckAttractionsAndTripPlan(
    $userId: ID!
    $tripId: ID!
    $destinationId: ID!
    $type: ATTRACTION_TYPE
  ) {
    getUser(id: $userId) {
      myCards(limit: 1000, filter: { deletedAt: { notContains: "" }, type: { eq: $type } }) {
        items {
          id
        }
      }
      bucketList(limit: 1000) {
        items {
          attractionId
          attraction {
            deletedAt
          }
        }
      }
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            tripDestinations(destinationId: { eq: $destinationId }) {
              items {
                destination {
                  name
                  coords {
                    lat
                    long
                  }
                }
                endDate
                startDate
                tripPlan {
                  dayOfYear
                  tripPlanDayItems {
                    attractionId
                    attraction {
                      locations {
                        id
                        displayOrder
                        startLoc {
                          id
                          googlePlace {
                            data {
                              coords {
                                long
                                lat
                              }
                            }
                          }
                        }
                        endLoc {
                          id
                          googlePlace {
                            data {
                              coords {
                                long
                                lat
                              }
                            }
                          }
                        }
                      }
                      duration
                      bucketListCount
                      name
                      images {
                        key
                        region
                        bucket
                      }
                      deletedAt
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
exports.lambdaGetReferringUserInfo = `
  query LambdaGetReferringUserInfo($id: ID!) {
    getUser(id: $id) {
      id
      avatar {
        bucket
        region
        key
      }
      username
    }
  }
`;
exports.lambdaPrivateDeleteUserTrip = `
  mutation LambdaPrivateDeleteUserTrip($input: DeleteUserTripInput!, $condition: ModelUserTripConditionInput) {
    privateDeleteUserTrip(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      tripId
      trip {
        id
        name
        completed
        createdAt
        updatedAt
      }
      status
      invitedByUserId
      invitedByUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateUpdateUserFollow = `
  mutation LambdaPrivateUpdateUserFollow($input: UpdateUserFollowInput!, $condition: ModelUserFollowConditionInput) {
    privateUpdateUserFollow(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      followedUserId
      followedUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
exports.lambdaPrivateUpdateUserTrip = `
  mutation LambdaPrivateUpdateUserTrip($input: UpdateUserTripInput!, $condition: ModelUserTripConditionInput) {
    privateUpdateUserTrip(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      tripId
      trip {
        id
        name
        completed
        createdAt
        updatedAt
      }
      status
      invitedByUserId
      invitedByUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      lastMessageReadDate
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateUpdateUser = `
  mutation LambdaPrivateUpdateUser($input: UpdateUserInput!, $condition: ModelUserConditionInput) {
    privateUpdateUser(input: $input, condition: $condition) {
      id
      appleId
      avatar {
        bucket
        region
        key
      }
      description
      facebookId
      fcmToken
      googleId
      location
      name
      privacy
      pushNotifications
      username
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaGetUserFollowedBy = `
  query LambdaGetUserFollowedBy($userId: ID!, $followedByNextToken: String) {
    getUser(id: $userId) {
      followedBy(nextToken: $followedByNextToken) {
        nextToken
        items {
          userId
          followedUserId
          approved
          createdAt
          updatedAt
        }
      }
    }
  }
`;
exports.lambdaListNotificationsByReceiverUser = `
  query LambdaListNotificationsByReceiverUser(
    $receiverUserId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationsByReceiverUser(
      receiverUserId: $receiverUserId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
      }
      nextToken
    }
  }
`;
exports.lambdaUpdateNotification = `
  mutation LambdaUpdateNotification($input: UpdateNotificationInput!, $condition: ModelNotificationConditionInput) {
    updateNotification(input: $input, condition: $condition) {
      id
      receiverUserId
      senderUserId
      type
      tripId
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaChatCreateTripMessageNotificationsGetReceiversIds = `
  query LambdaChatCreateTripMessageNotificationsGetReceiversIds($tripId: ID!) {
    privateGetTrip(id: $tripId) {
      members {
        items {
          userId
          status
        }
      }
    }
  }
`;
exports.lambdaGetUserNotifications = `
  query LambdaGetUserNotifications($userId: ID!) {
    getUser(id: $userId) {
      id
      username
      name
    }
  }
`;
exports.lambdaGetTripNotifications = `
  query LambdaGetTripNotifications($tripId: ID!) {
    privateGetTrip(id: $tripId) {
      name
    }
  }
`;
exports.lambdaGetAttractionNotifications = `
  query LambdaGetAttractionNotifications($id: ID!) {
    getAttraction(id: $id) {
      name
    }
  }
`;
exports.lambdaGetCommentNotifications = `
  query LambdaGetCommentNotifications($id: ID!) {
    getComment(id: $id) {
      text
    }
  }
`;
exports.lambdaGetPostLikeDislikePost = `
  query LambdaGetPostLikeDislikePost($id: ID!) {
    privateGetPost(id: $id) {
      userId
    }
  }
`;
exports.lambdaGetPostNotificationPost = `
  query LambdaGetPostNotificationPost($id: ID!) {
    privateGetPost(id: $id) {
      id
      createdAt
      userId
      user {
        username
        avatar {
          bucket
          region
          key
        }
        privacy
      }
      tripId
      description
      cloudinaryUrl
      trip {
        tripDestinations {
          items {
            destination {
              name
            }
            startDate
            endDate
          }
        }
        members {
          items {
            userId
          }
        }
      }
      destination {
        id
        icon
        state
        country
        name
        coverImage {
          bucket
          region
          key
        }
      }
      attractionId
      attraction {
        name
        images {
          bucket
          region
          key
        }
      }
      likesCount
      commentsCount
      deletedAt
      mediaType
    }
  }
`;
exports.lambdaPrivateListTripDestinationUsers = `
  query LambdaPrivateListTripDestinationUsers(
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
exports.lambdaPrivateGetAttractionSwipe = `
  query LambdaPrivateGetAttractionSwipe($userId: ID!, $tripId: ID!, $attractionId: ID!) {
    privateGetAttractionSwipe(userId: $userId, tripId: $tripId, attractionId: $attractionId) {
      userId
      tripId
      destinationId
      attractionId
      swipe
    }
  }
`;
exports.lambdaPrivateDeleteAttractionSwipe = `
  mutation LambdaPrivateDeleteAttractionSwipe(
    $input: DeleteAttractionSwipeInput!
    $condition: ModelAttractionSwipeConditionInput
  ) {
    privateDeleteAttractionSwipe(input: $input, condition: $condition) {
      userId
      tripId
      destinationId
      attractionId
    }
  }
`;
exports.lambdaPrivateGetStoryInfoFromPost = `
  query lambdaPrivateGetStoryInfoFromPost($id: ID!) {
    privateGetPost(id: $id) {
      id
      createdAt
      deletedAt
      userId
      tripId
      user {
        privacy
      }
    }
  }
`;
exports.lambdaPrivateGetStoryAndAuthorInfoFromPost = `
  query LambdaPrivateGetStoryAndAuthorInfoFromPost($id: ID!) {
    privateGetPost(id: $id) {
      id
      createdAt
      deletedAt
      userId
      tripId
      user {
        privacy
        username
        avatar {
          bucket
          region
          key
        }
      }
    }
  }
`;
exports.lambdaPrivateGetUserFollow = `
  query LambdaPrivateGetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateGetPost = `
  query LambdaPrivateGetPost($id: ID!) {
    privateGetPost(id: $id) {
      id
      createdAt
      userId
      user {
        avatar {
          bucket
          region
          key
        }
        username
        privacy
      }
      tripId
      description
      cloudinaryUrl
      trip {
        members {
          items {
            userId
          }
        }
      }
      destination {
        icon
        state
        country
        name
        coverImage {
          bucket
          region
          key
        }
      }
      attractionId
      attraction {
        name
        images {
          bucket
          region
          key
        }
      }
      likesCount
      commentsCount
      mediaType
      videoDuration
    }
  }
`;
exports.lambdaPrivateListPostsByTrip = `
  query LambdaPrivateListPostsByTrip(
    $tripId: ID!
    $userId: ModelIDKeyConditionInput
    $postsNextToken: String
    $postsLimit: Int
    $createdDateGTTimestamp: String
  ) {
    privateListPostsByTripByUser(
      tripId: $tripId
      userId: $userId
      nextToken: $postsNextToken
      limit: $postsLimit
      filter: { createdAt: { gt: $createdDateGTTimestamp }, deletedAt: { notContains: "" } }
    ) {
      items {
        id
        createdAt
        userId
        user {
          avatar {
            bucket
            region
            key
          }
          username
          privacy
        }
        tripId
        description
        cloudinaryUrl
        trip {
          members {
            items {
              userId
            }
          }
        }
        destination {
          icon
          state
          country
          name
          coverImage {
            bucket
            region
            key
          }
        }
        attractionId
        attraction {
          name
          images {
            bucket
            region
            key
          }
        }
        likesCount
        commentsCount
        mediaType
        videoDuration
      }
      nextToken
    }
  }
`;
exports.lambdaPrivateListPostsBySharedStory = `
  query LambdaPrivateListPostsBySharedStory(
    $tripId: ID!
    $userId: ModelIDKeyConditionInput
    $postsNextToken: String
    $postsLimit: Int
  ) {
    privateListPostsByTripByUser(
      tripId: $tripId
      userId: $userId
      nextToken: $postsNextToken
      limit: $postsLimit
      filter: { deletedAt: { notContains: "" } }
    ) {
      items {
        id
        createdAt
        userId
        user {
          avatar {
            bucket
            region
            key
          }
          username
          privacy
        }
        tripId
        description
        cloudinaryUrl
        trip {
          members {
            items {
              userId
            }
          }
        }
        destination {
          icon
          state
          country
          name
          coverImage {
            bucket
            region
            key
          }
        }
        attractionId
        attraction {
          name
          images {
            bucket
            region
            key
          }
        }
        likesCount
        commentsCount
        mediaType
        videoDuration
      }
      nextToken
    }
  }
`;
exports.lambdaGetUserByUsername = `
  query LambdaGetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      items {
        id
      }
    }
  }
`;
exports.lambdaGetUserAuthProviderByUsername = `
  query LambdaGetUserAuthProviderByUsername($username: String!) {
    getUserByUsername(username: $username) {
      items {
        id
        facebookId
        googleId
        appleId
      }
    }
  }
`;
exports.lambdaPrivateCreateUserBlock = `
  mutation LambdaPrivateCreateUserBlock($input: CreateUserBlockInput!, $condition: ModelUserBlockConditionInput) {
    privateCreateUserBlock(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      blockedUserId
      blockedUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaGetUserFollow = `
  query LambdaGetUserFollow($userId: ID!, $followedUserId: ID!) {
    getUserFollow(userId: $userId, followedUserId: $followedUserId) {
      userId
      followedUserId
      approved
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaDeleteUserFollow = `
  mutation LambdaDeleteUserFollow($input: DeleteUserFollowInput!, $condition: ModelUserFollowConditionInput) {
    deleteUserFollow(input: $input, condition: $condition) {
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
        username
        createdAt
        updatedAt
      }
      followedUserId
      followedUser {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
exports.lambdaListBlockedByByUser = `
  query LambdaListBlockedByByUser($userId: ID!, $limit: Int, $nextToken: String) {
    getUser(id: $userId) {
      blockedBy(limit: $limit, nextToken: $nextToken) {
        items {
          userId
          blockedUserId
        }
        nextToken
      }
    }
  }
`;
exports.lambdaListBlocksByUser = `
  query LambdaListBlocksByUser($userId: ID!, $limit: Int, $nextToken: String) {
    getUser(id: $userId) {
      blocks(limit: $limit, nextToken: $nextToken) {
        items {
          userId
          blockedUserId
        }
        nextToken
      }
    }
  }
`;
exports.lambdaPrivateUpdatePost = `
  mutation LambdaPrivateUpdatePost($input: UpdatePostInput!, $condition: ModelPostConditionInput) {
    privateUpdatePost(input: $input, condition: $condition) {
      id
      userId
      user {
        id
        appleId
        description
        facebookId
        fcmToken
        googleId
        location
        name
        privacy
        pushNotifications
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
        name
        icon
        timezone
        state
        country
        continent
        deletedAt
        isTravaCreated
        googlePlaceId
        featured
        altName
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
exports.lambdaListAttractions = `
  query LambdaListAttractions($filter: ModelAttractionFilterInput, $limit: Int, $nextToken: String) {
    listAttractions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        authorType
        deletedAt
        label
        locations {
          id
          displayOrder
          startLoc {
            id
            googlePlace {
              id
              isValid
              data {
                coords {
                  long
                  lat
                }
              }
            }
            googlePlaceId
          }
          endLoc {
            id
            googlePlace {
              id
              isValid
              data {
                coords {
                  long
                  lat
                }
              }
            }
            googlePlaceId
          }
        }
        privacy
        bucketListCount
        rank
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.lambdaPrivateListUserContacts = `
  query LambdaPrivateListUserContacts(
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
exports.lambdaPrivateCreateUserContact = `
  mutation LambdaPrivateCreateUserContact($input: CreateUserContactInput!, $condition: ModelUserContactConditionInput) {
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
exports.lambdaPrivateUpdateUserContact = `
  mutation LambdaPrivateUpdateUserContact($input: UpdateUserContactInput!, $condition: ModelUserContactConditionInput) {
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
exports.lambdaPrivateDeleteUserContact = `
  mutation LambdaPrivateDeleteUserContact($input: DeleteUserContactInput!, $condition: ModelUserContactConditionInput) {
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
exports.lambdaListUsers = `
  query LambdaListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        name
        email
        phone
        avatar {
          key
          region
          bucket
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.lambdaCustomSearchUsers = `
  query LambdaCustomSearchUsers(
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
        username
        name
        avatar {
          key
          region
          bucket
        }
        createdAt
        email
        phone
        updatedAt
      }
      nextToken
    }
  }
`;
exports.lambdaPrivateGetUserContactsByUserByContactName = `
  query LambdaPrivateGetUserContactsByUserByContactName(
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
      }
      nextToken
    }
  }
`;
exports.lambdaGetGooglePlace = `
  query LambdaGetGooglePlace($id: ID!) {
    getGooglePlace(id: $id) {
      id
      data {
        coords {
          lat
          long
        }
        name
        city
        state
        country
        continent
        hours {
          periods {
            close {
              day
              time
            }
            open {
              day
              time
            }
          }
        }
        mealServices {
          servesBreakfast
          servesBrunch
          servesLunch
          servesDinner
          dineIn
          takeout
          delivery
        }
        photos {
          height
          width
          html_attributions
          photo_reference
        }
      }
      isValid
      consecutiveFailedRequests
      dataLastCheckedAt
      dataLastUpdatedAt
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateCreateGooglePlace = `
  mutation LambdaPrivateCreateGooglePlace($input: CreateGooglePlaceInput!, $condition: ModelGooglePlaceConditionInput) {
    privateCreateGooglePlace(input: $input, condition: $condition) {
      id
      data {
        coords {
          lat
          long
        }
        city
        state
        country
        continent
        name
        hours {
          periods {
            close {
              day
              time
            }
            open {
              day
              time
            }
          }
        }
        mealServices {
          servesBreakfast
          servesBrunch
          servesLunch
          servesDinner
          dineIn
          takeout
          delivery
        }
        photos {
          height
          width
          html_attributions
          photo_reference
        }
      }
      isValid
      consecutiveFailedRequests
      dataLastCheckedAt
      dataLastUpdatedAt
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaPrivateUpdateGooglePlace = `
  mutation LambdaPrivateUpdateGooglePlace($input: UpdateGooglePlaceInput!, $condition: ModelGooglePlaceConditionInput) {
    privateUpdateGooglePlace(input: $input, condition: $condition) {
      id
      data {
        coords {
          lat
          long
        }
      }
      isValid
      consecutiveFailedRequests
      dataLastCheckedAt
      dataLastUpdatedAt
      createdAt
      updatedAt
    }
  }
`;
exports.lambdaGooglePlacesByIsValidByDataLastCheckedAt = `
  query LambdaGooglePlacesByIsValidByDataLastCheckedAt(
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
        consecutiveFailedRequests
      }
      nextToken
    }
  }
`;
exports.lambdaListAttractionSwipesByTripByDestination = `
  query LambdaListAttractionSwipesByTripByDestination(
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
        createdAt
        updatedAt
        user {
          id
          avatar {
            bucket
            region
            key
          }
        }
      }
      nextToken
    }
  }
`;
