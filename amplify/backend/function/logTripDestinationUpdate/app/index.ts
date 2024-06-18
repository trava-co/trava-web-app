import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import ApiClient from './utils/apiClient'
import { CreateTripMutation, CreateTripPlanLogMutationVariables } from 'shared-types/API'
import { createTripPlanLog } from 'shared-types/graphql/mutations'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import isequal from 'lodash.isequal'

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName === 'MODIFY' || record.eventName === 'INSERT') {
      if (!record.dynamodb?.NewImage || !record.dynamodb?.OldImage) return

      const oldImageUnmarshalled = unmarshall(record.dynamodb?.OldImage)
      const newImageUnmarshalled = unmarshall(record.dynamodb?.NewImage)

      if (isequal(oldImageUnmarshalled.tripPlan, newImageUnmarshalled.tripPlan)) return

      await ApiClient.get().apiFetch<CreateTripPlanLogMutationVariables, CreateTripMutation>({
        query: createTripPlanLog,
        variables: {
          input: {
            tripPlan: newImageUnmarshalled.tripPlan,
          },
        },
      })
    }
  }
}
