import {
  ListUpdatesByTypeQuery,
  ListUpdatesByTypeQueryVariables,
  ModelSortDirection,
  UpdateType,
} from 'shared-types/API'
import { listUpdatesByType } from 'shared-types/graphql/queries'
import ApiClient from './ApiClient'

async function getLastUpdateParity() {
  const res = await ApiClient.get().apiFetch<ListUpdatesByTypeQueryVariables, ListUpdatesByTypeQuery>({
    query: listUpdatesByType,
    variables: {
      type: UpdateType.DESTINATION_NEARBY_ATTRACTION_COUNT,
      sortDirection: ModelSortDirection.DESC,
      limit: 1,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.listUpdatesByType?.items[0]
}

export default getLastUpdateParity
