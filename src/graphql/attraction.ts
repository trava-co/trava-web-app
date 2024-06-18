import { fragmentAttractionLocationCustomGetAttraction } from './fragments.ts'

export const customGetExploreVotingList = /* GraphQL */ `
  query CustomGetExploreVotingList($input: GetExploreVotingListInput!) {
    getExploreVotingList(input: $input) {
      attractions {
        attractionCategories
        attractionCuisine
        cost
        descriptionShort
        id
        image {
          bucket
          region
          key
        }
        inMyBucketList
        inSeason
        name
        rating {
          score
          count
        }
        recommendationBadges
        swipes {
          result
          createdAt
          authorAvatar {
            key
            bucket
            region
          }
          authorId
        }
        type
      }
      nextPageExists
      votedOnAttractionIds
    }
  }
`

export const customGetAttraction = /* GraphQL */ `
  query CustomGetAttraction($id: ID!, $userId: ID!, $referrerId: ID!) {
    getUser(id: $userId) {
      id
      name
      follows(limit: 5000) {
        items {
          followedUserId
          approved
        }
      }
      bucketList(attractionId: { eq: $id }) {
        items {
          attractionId
        }
      }
    }
    getReferrer: getUser(id: $referrerId) {
      id
      username
      avatar {
        key
        bucket
        region
      }
    }
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
        privacy
        facebookId
        googleId
        appleId
        description
        location
        createdAt
        updatedAt
      }
      viatorProducts {
        items {
          id
          viatorLink
          attractionId
          displayOrder
          name
          duration
          pricing
          currency
          priceText
          coverImageUrl
          rating {
            score
            count
          }
          createdAt
          updatedAt
        }
      }
      deletedAt
      bucketListCount
      privacy
      recommendationBadges
      generation {
        step
        status
      }
    }
  }
  ${fragmentAttractionLocationCustomGetAttraction}
`

export const customGetMapAttraction = /* GraphQL */ `
  query CustomGetMapAttraction($id: ID!) {
    getAttraction(id: $id) {
      id
      duration
      type
      images {
        bucket
        region
        key
      }
      locations {
        id
        startLoc {
          id
          googlePlace {
            data {
              coords {
                lat
                long
              }
            }
          }
        }
        endLoc {
          id
          googlePlace {
            data {
              coords {
                lat
                long
              }
            }
          }
        }
      }
      name
      bucketListCount
    }
  }
`

export const customExploreSearchAttractions = /* GraphQL */ `
  query CustomExploreSearchAttractions($input: ExploreSearchAttractionsInput) {
    exploreSearchAttractions(input: $input) {
      attractions {
        id
        name
        distance
        isTravaCreated
        attractionCategories
        attractionCuisine
        author {
          username
        }
        bucketListCount
        recommendationBadges
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                rating {
                  score
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
        images {
          bucket
          region
          key
        }
      }
      nextPageExists
    }
  }
`

export const customExploreMapSearchAttractions = /* GraphQL */ `
  query CustomExploreMapSearchAttractions($input: ExploreMapSearchAttractionsInput) {
    exploreMapSearchAttractions(input: $input) {
      attractions {
        id
        name
        distance
        isTravaCreated
        attractionCategories
        attractionCuisine
        author {
          username
        }
        bucketListCount
        duration
        type
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
        images {
          bucket
          region
          key
        }
      }
    }
  }
`

export const customAddToItinerarySearch = /* GraphQL */ `
  query CustomAddToItinerarySearch($input: AddToItinerarySearchInput) {
    addToItinerarySearch(input: $input) {
      attractions {
        id
        name
        isTravaCreated
        attractionCategories
        attractionCuisine
        bucketListCount
        recommendationBadges
        duration
        type
        distance
        inSeason
        inMyBucketList
        onItinerary
        yesVotes
        noVotes
        author {
          id
          username
        }
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                rating {
                  score
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
        images {
          bucket
          region
          key
        }
      }
      nextPageExists
    }
  }
`

export const customAddToItineraryMapSearch = /* GraphQL */ `
  query CustomAddToItineraryMapSearch($input: AddToItineraryMapSearchInput) {
    addToItineraryMapSearch(input: $input) {
      attractions {
        id
        name
        distance
        isTravaCreated
        attractionCategories
        attractionCuisine
        yesVotes
        noVotes
        author {
          username
        }
        bucketListCount
        duration
        type
        inSeason
        inMyBucketList
        onItinerary
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
        images {
          bucket
          region
          key
        }
      }
    }
  }
`

export const customDeleteAttraction = /* GraphQL */ `
  mutation CustomDeleteAttraction($input: CustomDeleteAttractionInput!) {
    deleteAttraction(input: $input) {
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
      images {
        bucket
        region
        key
      }
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
  }
`

export const customGetAttractionTripLogs = /* GraphQL */ `
  query CustomGetAttractionTripLogs($id: ID!) {
    getAttraction(id: $id) {
      name
      type
    }
  }
`

export const customOpenSearchListNearbyAttractions = /* GraphQL */ `
  query CustomOpenSearchListNearbyAttractions($input: OpenSearchListNearbyAttractionsInput) {
    openSearchListNearbyAttractions(input: $input) {
      attractions {
        id
        name
        type
        bestVisited # for preferredTime
        duration
        attractionCategories
        attractionCuisine
        locations {
          id
          deleted
          startLoc {
            id
            googlePlace {
              data {
                coords {
                  long
                  lat
                }
                hours {
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
                businessStatus
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
                hours {
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
              }
            }
            googlePlaceId
          }
        }
        seasons {
          startDay
          startMonth
          endDay
          endMonth
        }
        isTravaCreated
        authorType
        deletedAt
      }
    }
  }
`

export const customGetAttractionsForScheduler = /* GraphQL */ `
  query CustomGetAttractionsForScheduler($input: GetAttractionsForScheduler) {
    getAttractionsForScheduler(input: $input) {
      attractions {
        id
        name
        type
        bestVisited # for preferredTime
        duration
        attractionCategories
        attractionCuisine
        locations {
          id
          deleted
          startLoc {
            id
            googlePlace {
              data {
                coords {
                  long
                  lat
                }
                hours {
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
                businessStatus
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
                hours {
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
              }
            }
            googlePlaceId
          }
        }
        seasons {
          startDay
          startMonth
          endDay
          endMonth
        }
        isTravaCreated
        authorType
        deletedAt
      }
    }
  }
`

export const customGetUserAttractionIdsForAddToVotingDeck = /* GraphQL */ `
  query CustomGetUserAttractionIdsForAddToVotingDeck(
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
              }
            }
          }
        }
      }
    }
  }
`

export const customCheckForExistingCards = /* GraphQL */ `
  query CustomCheckForExistingCards($input: CheckForExistingCardsInput!) {
    checkForExistingCards(input: $input) {
      attractions {
        id
        name
        destinationName
        attractionCategories
        attractionCuisine
        bucketListCount
        isTravaCreated
        type
        deletedAt
        outOfSeason
        author {
          id
          name
          username
          avatar {
            key
            bucket
            region
          }
        }
        images {
          bucket
          region
          key
        }
      }
    }
  }
`

export const customOnUpdateAttraction = /* GraphQL */ `
  subscription CustomOnUpdateAttraction($id: ID!) {
    onUpdateAttraction(id: $id) {
      id
    }
  }
`

export const customCreateAttractionFromPlaceId = /* GraphQL */ `
  mutation CustomCreateAttractionFromPlaceId($input: CreateAttractionFromPlaceIdInput!) {
    createAttractionFromPlaceId(input: $input) {
      existingAttractions {
        id
        name
        destinationName
        attractionCategories
        attractionCuisine
        bucketListCount
        isTravaCreated
        type
        deletedAt
        outOfSeason
        duration
        recommendationBadges
        images {
          bucket
          region
          key
        }
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
      }
      createdAttraction {
        id
        name
        destinationName
        attractionCategories
        attractionCuisine
        bucketListCount
        isTravaCreated
        type
        deletedAt
        outOfSeason
        duration
        recommendationBadges
        images {
          bucket
          region
          key
        }
        locations {
          id
          deleted
          startLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
          endLoc {
            id
            googlePlaceId
            googlePlace {
              data {
                coords {
                  lat
                  long
                }
                city
                businessStatus
              }
            }
          }
        }
      }
    }
  }
`
