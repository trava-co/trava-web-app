import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import tearex from 'tearex'
import { getSSMVariable } from './getSSMVariable'
import { TeaRexLabel } from 'shared-types/API'

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  const TEAREX_URL = await getSSMVariable('TEAREX_URL')
  const TEAREX_API_KEY = await getSSMVariable('TEAREX_API_KEY')
  const ENV = process.env.ENV

  if (!ENV) {
    throw new Error('No ENV set')
  }

  if (!TEAREX_URL || !TEAREX_API_KEY) {
    throw new Error('Secrets not found')
  }

  tearex.init({
    url: TEAREX_URL,
    apiKey: TEAREX_API_KEY,
    stage: process.env.ENV,
  })

  for (const record of event.Records) {
    if (!record.eventSourceARN) {
      throw new Error('Source table unknown')
    }

    const sourceTable = getTableNameFromEventSourceARN(record.eventSourceARN)

    if (record.eventName === 'INSERT') {
      if (!record.dynamodb?.NewImage) return
      const newUnmarshalledRecord = unmarshall(record.dynamodb?.NewImage)

      await tearex.createEntity({
        id: newUnmarshalledRecord.id,
        label: sourceTable,
      })
    }

    if (record.eventName === 'MODIFY') {
      if (!record.dynamodb?.NewImage || !record.dynamodb?.OldImage) return
      const newUnmarshalledRecord = unmarshall(record.dynamodb?.NewImage)

      const oldUnmarshalledRecord = unmarshall(record.dynamodb?.OldImage)

      if (!oldUnmarshalledRecord.deletedAt && !!newUnmarshalledRecord.deletedAt) {
        // deletedAt has been set
        await tearex.deleteEntity({
          id: newUnmarshalledRecord.id,
          label: sourceTable,
        })
      } else if (!!oldUnmarshalledRecord.deletedAt && !newUnmarshalledRecord.deletedAt) {
        // deletedAt has been unset
        await tearex.createEntity({
          id: newUnmarshalledRecord.id,
          label: sourceTable,
        })
      }
    }

    if (record.eventName === 'REMOVE') {
      if (!record.dynamodb?.OldImage) return

      const oldUnmarshalledRecord = unmarshall(record.dynamodb?.OldImage)
      await tearex.deleteEntity({
        id: oldUnmarshalledRecord.id,
        label: sourceTable,
      })
    }
  }
}

function getTableNameFromEventSourceARN(eventSourceArn: string): TeaRexLabel {
  return eventSourceArn.split('/')[1].split('-')[0] as TeaRexLabel
}
