import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateTripDestinationInput,
  CreateTripMutationVariables,
  LambdaCustomCreateTripDestinationMutation,
  LambdaCustomCreateTripDestinationMutationVariables,
  Trip,
} from 'shared-types/API'
import { lambdaCustomCreateTripDestination } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'

async function create(tripDestination: CreateTripDestinationInput) {
  const res = await ApiClient.get().apiFetch<
    LambdaCustomCreateTripDestinationMutationVariables,
    LambdaCustomCreateTripDestinationMutation
  >({
    query: lambdaCustomCreateTripDestination,
    variables: {
      input: tripDestination,
    },
  })

  // TODO unified error handler\
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.createTripDestination
}

const createTripDestinations = async (event: AppSyncResolverEvent<CreateTripMutationVariables>, trip: Trip) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (event.identity && 'sub' in event.identity) {
    // https://stackoverflow.com/a/58429784 // filter array of destination objects with unique destinationId
    const uniqueDestinationIdsWithDates = [
      ...new Map(event.arguments.input.destinationIdsWithDates.map((item) => [item['id'], item])).values(),
    ]

    const tripDestinationPromises = uniqueDestinationIdsWithDates.map((destinationIdWithDates) =>
      create({
        tripId: trip.id,
        destinationId: destinationIdWithDates.id,
        startDate: destinationIdWithDates?.startDate || undefined,
        endDate: destinationIdWithDates?.endDate || undefined,
      }),
    )

    await Promise.all(tripDestinationPromises)
  }

  return null
}

export default createTripDestinations
