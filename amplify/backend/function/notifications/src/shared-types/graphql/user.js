"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customGetUserContacts = exports.userProfileScreen = exports.customUpdateUser = exports.customHomeTabsFeedPostComments = exports.customHomeTabsFeedPeopleOnThisTrip = exports.customHomeTabsFeedBucketListLikedPosts = exports.customHomeTabsAccountTrips = exports.customHomeTabsSuggestedFeed = exports.customHomeTabsFeed = exports.homeTabsMyAccount = exports.customGetUserFcmToken = exports.customGetUsernameById = exports.getAttractionSwipesByUserIdAndTripId = exports.getTripByUserIdAndTripId = exports.listPublicUser = exports.customExploreTopUsers = exports.getFollowsFollowers = exports.customSearchUsers = exports.myBucketList = exports.myFollows = exports.customGetUser = void 0;
exports.customGetUser = `
  query CustomGetUser($id: ID!) {
    getUser(id: $id) {
      id
      fcmToken
      username
      name
      avatar {
        bucket
        region
        key
      }
      privacy
      email
      contactEmail
      phone
      facebookId
      googleId
      appleId
      location
      description
      pushNotifications
      referralLink
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      follows {
        items {
          userId
        }
      }
      followedBy {
        items {
          userId
        }
      }
      createdAt
      updatedAt
      userTrips {
        items {
          userId
          createdAt
          status
          updatedAt
          tripId
          trip {
            completed
            createdAt
            id
            tripDestinations {
              items {
                createdAt
                destinationId
                endDate
                startDate
                tripId
                updatedAt
              }
              nextToken
            }
            name
            updatedAt
          }
        }
        nextToken
      }
    }
  }
`;
exports.myFollows = `
  query MyFollows($id: ID!) {
    getUser(id: $id) {
      follows(limit: 5000) {
        items {
          followedUserId
          approved
        }
      }
    }
  }
`;
exports.myBucketList = `
  query MyBucketList($id: ID!) {
    getUser(id: $id) {
      bucketList(limit: 1000) {
        items {
          attractionId
        }
      }
    }
  }
`;
exports.customSearchUsers = `
  query CustomSearchUsers(
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
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getFollowsFollowers = `
  query GetFollowsFollowers($id: ID!) {
    getUser(id: $id) {
      updatedAt
      createdAt
      id
      username
      name
      avatar {
        bucket
        region
        key
      }
      followedBy(limit: 5000, filter: { approved: { eq: true } }) {
        items {
          userId
          user {
            avatar {
              bucket
              key
              region
            }
            id
            username
            name
          }
          approved
        }
      }
      follows(limit: 5000, filter: { approved: { eq: true } }) {
        items {
          followedUser {
            id
            name
            username
            updatedAt
            createdAt
            avatar {
              bucket
              key
              region
            }
          }
          approved
        }
      }
    }
  }
`;
exports.customExploreTopUsers = `
  query CustomExploreTopUsers {
    exploreTopUsers {
      users {
        id
        name
        username
        avatar {
          bucket
          key
          region
        }
        bucketListsCollected
      }
    }
  }
`;
exports.listPublicUser = `
  query ListPublicUser($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        name
        userFollowByMe {
          userId
          followedUserId
          approved
          createdAt
          updatedAt
        }
        avatar {
          key
          region
          bucket
        }
      }
      nextToken
    }
  }
`;
exports.getTripByUserIdAndTripId = `
  query GetTripByUserIdAndTripId($userId: ID!, $tripId: ID!) {
    getUser(id: $userId) {
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            name
            id
            link
            members(limit: 1000) {
              items {
                status
                createdAt
                user {
                  id
                  name
                  username
                  avatar {
                    bucket
                    key
                    region
                  }
                }
              }
              nextToken
            }
            tripDestinations(limit: 1000) {
              items {
                destination {
                  id
                  name
                  icon
                  coords {
                    lat
                    long
                  }
                }
                endDate
                startDate
                destinationId
                tripId
                endTime
                startTime
                tripPlan {
                  dayOfYear
                }
              }
            }
            # My swipes
            attractionSwipesByUser(userId: { eq: $userId }, limit: 1000) {
              items {
                swipe
                attractionId
                attraction {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
exports.getAttractionSwipesByUserIdAndTripId = `
  query GetAttractionSwipesByUserIdAndTripId($userId: ID!, $tripId: ID!, $destinationId: ID!) {
    getUser(id: $userId) {
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            name
            attractionSwipes(destinationId: { eq: $destinationId }, limit: 1000) {
              items {
                attractionId
                swipe
                tripId
                userId
                user {
                  name
                  avatar {
                    key
                    bucket
                    region
                  }
                }
                attraction {
                  deletedAt
                  attractionCategories
                  images {
                    bucket
                    key
                    region
                  }
                  name
                  type
                  authorId
                  author {
                    name
                    username
                    avatar {
                      bucket
                      key
                      region
                    }
                  }
                  isTravaCreated
                  destination {
                    name
                  }
                }
              }
            }
            members(limit: 1000) {
              items {
                status
                user {
                  id
                  name
                  username
                  avatar {
                    bucket
                    key
                    region
                  }
                }
              }
            }
            tripDestinations(destinationId: { eq: $destinationId }) {
              # for results after calendar is generated
              items {
                destination {
                  name
                  coords {
                    lat
                    long
                  }
                }
                startDate
                endDate
                tripPlan {
                  dayOfYear
                  tripPlanDayItems {
                    attractionId
                    attraction {
                      duration
                      name
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
// system messages
exports.customGetUsernameById = `
  query CustomGetUsernameById($id: ID!) {
    getUser(id: $id) {
      username
    }
  }
`;
exports.customGetUserFcmToken = `
  query CustomGetUserFcmToken($id: ID!) {
    getUser(id: $id) {
      fcmToken
    }
  }
`;
exports.homeTabsMyAccount = `
  query HomeTabsMyAccount($id: ID!) {
    getUser(id: $id) {
      id
      username
      name
      avatar {
        bucket
        region
        key
      }
      location
      description
      follows(limit: 1000, filter: { approved: { eq: true } }) {
        items {
          userId
        }
      }
      followedBy(limit: 1000, filter: { approved: { eq: true } }) {
        items {
          userId
        }
      }
      userTrips(limit: 1000) {
        items {
          status
        }
      }
      myCards(limit: 1000, filter: { deletedAt: { notContains: "" } }) {
        items {
          privacy
          id
          name
          attractionCategories
          images {
            bucket
            key
            region
          }
          destination {
            id
            icon
            name
            googlePlaceId
          }
          deletedAt
          bucketListCount
          authorId
          author {
            name
            username
            avatar {
              bucket
              key
              region
            }
          }
          isTravaCreated
          createdAt
        }
      }
      bucketList(limit: 1000) {
        items {
          attraction {
            privacy
            id
            name
            attractionCategories
            images {
              bucket
              key
              region
            }
            destination {
              id
              icon
              name
              googlePlaceId
            }
            deletedAt
            bucketListCount
            authorId
            author {
              name
              username
              avatar {
                bucket
                key
                region
              }
            }
            isTravaCreated
          }
          createdAt
        }
      }
    }
  }
`;
exports.customHomeTabsFeed = `
  query CustomHomeTabsFeed {
    homeTabsFeed {
      stories {
        storyId
        story {
          id
          createdAt
          userId
          tripId
          membersLength
          description
          avatar {
            bucket
            key
            region
          }
          username
          authorPublic
          viewed
          cloudinaryUrl
          destinationIcon
          destinationState
          destinationCountry
          destinationCoverImage {
            bucket
            key
            region
          }
          destinationName
          attractionId
          attractionName
          commentsCount
          attractionImage {
            bucket
            key
            region
          }
          likesCount
          mediaType
          videoDuration
        }
      }
    }
  }
`;
exports.customHomeTabsSuggestedFeed = `
  query CustomHomeTabsSuggestedFeed($input: HomeTabsSuggestedFeedInput) {
    homeTabsSuggestedFeed(input: $input) {
      stories {
        storyId
        story {
          id
          createdAt
          userId
          tripId
          membersLength
          description
          avatar {
            bucket
            key
            region
          }
          username
          authorPublic
          viewed
          cloudinaryUrl
          destinationIcon
          destinationState
          destinationCountry
          destinationCoverImage {
            bucket
            key
            region
          }
          destinationName
          attractionId
          attractionName
          commentsCount
          attractionImage {
            bucket
            key
            region
          }
          likesCount
          mediaType
          videoDuration
        }
      }
      sharedPostError {
        type
        authorId
        authorUsername
        authorAvatar {
          bucket
          key
          region
        }
      }
      referringUserInfo {
        id
        username
        avatar {
          bucket
          key
          region
        }
      }
    }
  }
`;
exports.customHomeTabsAccountTrips = `
  query CustomHomeTabsAccountTrips($input: HomeTabsAccountTripsInput) {
    homeTabsAccountTrips(input: $input) {
      stories {
        storyId
        story {
          id
          createdAt
          userId
          tripId
          membersLength
          description
          avatar {
            bucket
            key
            region
          }
          username
          authorPublic
          viewed
          cloudinaryUrl
          destinationIcon
          destinationId
          destinationCoverImage {
            bucket
            key
            region
          }
          destinationName
          destinationState
          destinationCountry
          destinationGooglePlaceId
          attractionId
          attractionName
          commentsCount
          attractionImage {
            bucket
            key
            region
          }
          likesCount
          dateRange
          destinations
          mediaType
          videoDuration
        }
      }
    }
  }
`;
exports.customHomeTabsFeedBucketListLikedPosts = `
  query CustomHomeTabsFeedBucketListLikedPosts($id: ID!, $createdDateGTTimestamp: String) {
    getUser(id: $id) {
      bucketList(limit: 1000) {
        items {
          attractionId
        }
      }
      likedPosts(limit: 10000, createdAt: { gt: $createdDateGTTimestamp }) {
        items {
          postId
        }
      }
    }
  }
`;
exports.customHomeTabsFeedPeopleOnThisTrip = `
  query CustomHomeTabsFeedPeopleOnThisTrip($input: HomeTabsFeedPeopleOnThisTripInput) {
    homeTabsFeedPeopleOnThisTrip(input: $input) {
      members {
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
exports.customHomeTabsFeedPostComments = `
  query CustomHomeTabsFeedPostComments($input: HomeTabsFeedPostCommentsInput) {
    homeTabsFeedPostComments(input: $input) {
      id
      userId
      tripId
      avatar {
        key
        region
        bucket
      }
      username
      membersLength
      description
      comments {
        id
        userId
        username
        avatar {
          key
          region
          bucket
        }
        text
        updatedAt
      }
    }
  }
`;
exports.customUpdateUser = `
  mutation CustomUpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;
exports.userProfileScreen = `
  query UserProfileScreen($id: ID!) {
    getUser(id: $id) {
      id
      username
      name
      avatar {
        bucket
        region
        key
      }
      privacy
      location
      description
      userFollowByMe {
        userId
        followedUserId
        approved
        createdAt
        updatedAt
      }
      follows(limit: 1000, filter: { approved: { eq: true } }) {
        items {
          userId
        }
      }
      followedBy(limit: 1000, filter: { approved: { eq: true } }) {
        items {
          userId
        }
      }
      userTrips(limit: 1000) {
        items {
          userId
          status
        }
      }
      myCards(limit: 1000, filter: { privacy: { eq: PUBLIC }, deletedAt: { notContains: "" } }) {
        items {
          privacy
          id
          name
          attractionCategories
          images {
            bucket
            key
            region
          }
          destination {
            id
            icon
            name
            googlePlaceId
          }
          deletedAt
          bucketListCount
          authorId
          author {
            name
            avatar {
              bucket
              key
              region
            }
          }
          isTravaCreated
          createdAt
        }
      }
      bucketList(limit: 1000) {
        items {
          attraction {
            privacy
            id
            name
            attractionCategories
            images {
              bucket
              key
              region
            }
            destination {
              id
              icon
              name
              googlePlaceId
            }
            deletedAt
            bucketListCount
            authorId
            author {
              name
              avatar {
                bucket
                key
                region
              }
            }
            isTravaCreated
          }
          createdAt
        }
      }
    }
  }
`;
exports.customGetUserContacts = `
  query CustomGetUserContacts {
    getUserContacts {
      contactsOnTrava {
        id
        username
        email
        phone
        name
        avatar {
          bucket
          key
          region
        }
        createdAt
        updatedAt
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
