export const customGenerateTripPlan = /* GraphQL */ `
  query CustomGenerateTripPlan(
    $attractions: [TripPlanAttraction]!
    $group: TripPlanGroup!
    $config: GenerateTripPlanConfigInput
  ) {
    generateTripPlan(attractions: $attractions, group: $group, config: $config) {
      plan {
        attractionId
        locId
        day
        order
      }
    }
  }
`
