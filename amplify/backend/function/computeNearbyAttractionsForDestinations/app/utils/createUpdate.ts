import { PrivateCreateUpdateMutation, PrivateCreateUpdateMutationVariables, UpdateType, Parity } from 'shared-types/API'
import { privateCreateUpdate } from 'shared-types/graphql/mutations'
import ApiClient from './ApiClient'
import getLastUpdateParity from './getLastUpdateParity'

async function createUpdate(parity: Parity) {
  // strange bug where aws is retrying our scheduled lambda multiple times, despite no errors
  // to avoid creating more than one update per run, check if an update with the same parity has been made in the past 15 minutes. if it has, then return early.
  const lastUpdate = await getLastUpdateParity()
  const currentTime = Date.now()
  const fifteenMinutesAgo = currentTime - 15 * 60 * 1000 // 15 min is the timeout
  const lastUpdateCreationTime = lastUpdate?.createdAt ? new Date(lastUpdate.createdAt).getTime() : 0

  if (lastUpdate && lastUpdate.parityLastProcessed === parity && lastUpdateCreationTime > fifteenMinutesAgo) {
    console.log(`Update with parity ${parity} was made in the past 15 minutes. Skipping this update.`)
    return
  }

  const res = await ApiClient.get().apiFetch<PrivateCreateUpdateMutationVariables, PrivateCreateUpdateMutation>({
    query: privateCreateUpdate,
    variables: {
      input: {
        type: UpdateType.DESTINATION_NEARBY_ATTRACTION_COUNT,
        parityLastProcessed: parity,
      },
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateUpdate
}

export default createUpdate
