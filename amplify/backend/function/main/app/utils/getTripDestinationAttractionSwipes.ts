import {
  LambdaGetTripDestinationAttractionSwipesQuery,
  LambdaGetTripDestinationAttractionSwipesQueryVariables,
} from 'shared-types/API'
import { lambdaGetTripDestinationAttractionSwipes } from 'shared-types/graphql/lambda'
import ApiClient, { Response } from './ApiClient/ApiClient'

const MAX_ITERATIONS_AMOUNT = 20

async function getTripDestinationAttractionSwipes(variables: LambdaGetTripDestinationAttractionSwipesQueryVariables) {
  let response: Response<LambdaGetTripDestinationAttractionSwipesQuery> | undefined = undefined
  let lastNextToken: string | null | undefined = undefined
  for (let i = 0; i < MAX_ITERATIONS_AMOUNT && (lastNextToken !== null || i === 0); ++i) {
    const res: any = await ApiClient.get().apiFetch<
      LambdaGetTripDestinationAttractionSwipesQueryVariables,
      LambdaGetTripDestinationAttractionSwipesQuery
    >({
      query: lambdaGetTripDestinationAttractionSwipes,
      variables: {
        ...variables,
        attractionSwipesLimit: 1,
        attractionSwipesNextToken: lastNextToken,
      },
    })

    // TODO unified error handler
    if (res.errors?.length) {
      // TODO handle error message parsing:
      throw new Error(`Error calling method: ${res.errors.map((error: any) => error.message)}`)
    }

    if (!response) {
      response = { ...res }
    } else {
      const items = res.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipes?.items

      if (items) {
        response.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipes?.items?.push(...items)
      }
    }

    lastNextToken = res.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipes?.nextToken
  }

  return response?.data.getUser?.userTrips?.items?.[0]?.trip?.attractionSwipes?.items
}

export default getTripDestinationAttractionSwipes
