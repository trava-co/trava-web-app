import {
  LambdaPrivateGetTimelineEntryQuery,
  LambdaPrivateGetTimelineEntryQueryVariables,
  TimelineEntry,
} from 'shared-types/API'
import ApiClient from './ApiClient/ApiClient'
import { lambdaPrivateGetTimelineEntry } from 'shared-types/graphql/lambda'

async function getTimelineEntry(id: TimelineEntry['id']) {
  const result = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateGetTimelineEntryQueryVariables, LambdaPrivateGetTimelineEntryQuery>({
      query: lambdaPrivateGetTimelineEntry,
      variables: {
        id,
      },
    })

  return result.data?.privateGetTimelineEntry
}

export default getTimelineEntry
