import {
  Destination,
  LambdaListDestinationsQuery,
  LambdaListDestinationsQueryVariables,
  ModelSortDirection,
} from 'shared-types/API'
import getAllPaginatedData from './getAllPaginatedData'
import ApiClient from '../utils/ApiClient/ApiClient'
import { lambdaListDestinations } from 'shared-types/graphql/lambda'

const DEFAULT_USER_ARGUMENT = 'defaultUserArgument'

export default async (userId = DEFAULT_USER_ARGUMENT) => {
  const destinations: Pick<Destination, 'id' | 'googlePlaceId' | 'deletedAt'>[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaListDestinationsQueryVariables, LambdaListDestinationsQuery>({
        query: lambdaListDestinations,
        variables: {
          label: 'Destination',
          filter: {
            or: [{ isTravaCreated: { eq: 1 } }, { authorId: { eq: userId } }], // destination is either Trava created or created by the current user
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
