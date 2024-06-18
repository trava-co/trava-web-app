import {
  Destination,
  LambdaListDestinationsQuery,
  LambdaListDestinationsQueryVariables,
  ModelSortDirection,
} from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import { lambdaListDestinations } from 'shared-types/graphql/lambda'
import ApiClient from './ApiClient'

export default async () => {
  const destinations: Pick<Destination, 'id' | 'googlePlaceId' | 'deletedAt' | 'coords'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListDestinationsQueryVariables, LambdaListDestinationsQuery>({
        query: lambdaListDestinations,
        variables: {
          label: 'Destination',
          filter: {
            deletedAt: { notContains: '' },
          },
          nextToken,
          limit: 500,
          sortDirection: ModelSortDirection.ASC,
        },
      })

      return {
        nextToken: res.data.listDestinationsByLabel?.nextToken,
        data: res.data,
      }
    },
    (data) => {
      data?.listDestinationsByLabel?.items.forEach((item) => {
        if (item) destinations.push(item)
      })
    },
  )

  return destinations
}
