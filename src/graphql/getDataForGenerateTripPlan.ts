// get data to generate trip plan
export const getDataForGenerateTripPlan = /* GraphQL */ `
  query GetDataForGenerateTripPlan($userId: ID!, $tripId: ID!, $destinationId: ID!) {
    getUser(id: $userId) {
      userTrips(tripId: { eq: $tripId }) {
        items {
          trip {
            attractionSwipes(destinationId: { eq: $destinationId }, limit: 1000) {
              items {
                attractionId
                swipe
                userId
                attraction {
                  name
                  type
                }
              }
            }
            members(limit: 1000) {
              items {
                status
                userId
              }
            }
            tripDestinations(destinationId: { eq: $destinationId }) {
              items {
                destination {
                  name
                  coords {
                    lat
                    long
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`