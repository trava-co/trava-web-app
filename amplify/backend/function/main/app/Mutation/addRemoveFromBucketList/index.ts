import {
  AddRemoveFromBucketListMutationVariables,
  ATTRACTION_PRIVACY,
  BUCKET_LIST_ACTION_INPUT,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  LambdaGetAttractionQuery,
  LambdaGetAttractionQueryVariables,
  NOTIFICATION_TYPE,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import getTableName from '../../utils/getTableName'
import dbClient from '../../utils/dbClient'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaCreateNotification, lambdaGetAttraction } from 'shared-types/graphql/lambda'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_BUCKET_LIST } from 'shared-types/lambdaErrors'
import { checkForGroup } from '../../utils/checkForGroup'

const addRemoveFromBucketList: AppSyncResolverHandler<AddRemoveFromBucketListMutationVariables, any> = async (
  event,
) => {
  console.log('addRemoveFromBucketList')

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_BUCKET_LIST)
  }

  const currentAttraction = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaGetAttractionQueryVariables, LambdaGetAttractionQuery>({
      query: lambdaGetAttraction,
      variables: {
        id: event.arguments.input.attractionId,
      },
    })

  if (event.identity.sub !== event.arguments.input.userId && !checkForGroup(event, 'admin'))
    throw new Error('Wrong user')
  if (!currentAttraction) throw new Error('Attraction not found')
  if (currentAttraction.data?.getAttraction?.privacy !== ATTRACTION_PRIVACY.PUBLIC)
    throw new Error('Cannot add private attraction to a bucket list')

  const userAttractionTableName = getTableName(process.env.API_TRAVA_USERATTRACTIONTABLE_NAME)
  const attractionTableName = getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME)

  const authorId = currentAttraction.data?.getAttraction?.authorId ?? null

  const userAttractionItem = {
    userId: event.arguments.input.userId,
    attractionId: event.arguments.input.attractionId,
  }
  const now = new Date()

  const transactPartCreateDeleteUserAttraction = {
    [BUCKET_LIST_ACTION_INPUT.ADD]: {
      Put: {
        TableName: userAttractionTableName,
        ConditionExpression: 'attribute_not_exists(#pk)',
        ExpressionAttributeNames: { '#pk': 'userId' },
        Item: {
          ...userAttractionItem,
          authorId,
          updatedAt: now.toISOString(),
          createdAt: now.toISOString(),
          __typename: 'UserAttraction',
        },
      },
    },
    [BUCKET_LIST_ACTION_INPUT.REMOVE]: {
      Delete: {
        TableName: userAttractionTableName,
        ConditionExpression: 'attribute_exists(#pk)',
        ExpressionAttributeNames: { '#pk': 'userId' },
        Key: userAttractionItem,
      },
    },
  }

  await dbClient
    .transactWrite({
      TransactItems: [
        // 1. create or delete UserAttraction
        {
          ...transactPartCreateDeleteUserAttraction[event.arguments.input.action],
        },
        // 2. increment / decrement bucketListCount field in Attraction
        {
          Update: {
            ExpressionAttributeNames: { '#bucketListCount': 'bucketListCount' },
            ExpressionAttributeValues: {
              ':value': event.arguments.input.action === BUCKET_LIST_ACTION_INPUT.ADD ? 1 : -1,
            },
            Key: {
              id: event.arguments.input.attractionId,
            },
            TableName: attractionTableName,
            UpdateExpression: 'ADD #bucketListCount :value',
          },
        },
      ],
    })
    .promise()

  // create notification
  if (
    event.arguments.input.action === BUCKET_LIST_ACTION_INPUT.ADD &&
    currentAttraction?.data?.getAttraction?.authorId &&
    currentAttraction?.data?.getAttraction?.authorId !== event.identity.sub
  ) {
    await ApiClient.get().apiFetch<LambdaCreateNotificationMutationVariables, LambdaCreateNotificationMutation>({
      query: lambdaCreateNotification,
      variables: {
        input: {
          showInApp: 1,
          receiverUserId: currentAttraction.data.getAttraction.authorId,
          senderUserId: event.identity.sub,
          type: NOTIFICATION_TYPE.BUCKET_LIST_ATTRACTION,
          attractionId: event.arguments.input.attractionId,
        },
      },
    })
  }

  return true
}

export default addRemoveFromBucketList
