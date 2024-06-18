import {
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  LambdaGetPostLikeDislikePostQuery,
  LambdaGetPostLikeDislikePostQueryVariables,
  LIKE_DISLIKE_ACTION_INPUT,
  LikeDislikePostMutationVariables,
  NOTIFICATION_TYPE,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import getTableName from '../../utils/getTableName'
import dbClient from '../../utils/dbClient'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaCreateNotification, lambdaGetPostLikeDislikePost } from 'shared-types/graphql/lambda'
import { CUSTOM_NOT_AUTHORIZED_LIKE_DISLIKE_POST } from 'shared-types/lambdaErrors'

const likeDislikePost: AppSyncResolverHandler<LikeDislikePostMutationVariables, any> = async (event) => {
  console.log('likeDislikePost')

  ApiClient.get().useIamAuth()

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_LIKE_DISLIKE_POST)
  }

  if (event.identity.sub !== event.arguments.input.userId) throw new Error('Wrong user')

  const userPostLikeTableName = getTableName(process.env.API_TRAVA_USERPOSTLIKETABLE_NAME)
  const postTableName = getTableName(process.env.API_TRAVA_POSTTABLE_NAME)

  const getPost = await ApiClient.get().apiFetch<
    LambdaGetPostLikeDislikePostQueryVariables,
    LambdaGetPostLikeDislikePostQuery
  >({
    query: lambdaGetPostLikeDislikePost,
    variables: {
      id: event.arguments.input.postId,
    },
  })

  const post = getPost?.data?.privateGetPost

  if (!post) {
    throw new Error('no post')
  }

  const userPostLikeItem = {
    userId: event.arguments.input.userId,
    postId: event.arguments.input.postId,
  }
  const now = new Date()

  const transactPartCreateDeleteUserPostLike = {
    [LIKE_DISLIKE_ACTION_INPUT.ADD]: {
      Put: {
        TableName: userPostLikeTableName,
        ConditionExpression: 'attribute_not_exists(#pk)',
        ExpressionAttributeNames: { '#pk': 'userId' },
        Item: {
          ...userPostLikeItem,
          updatedAt: now.toISOString(),
          createdAt: now.toISOString(),
          __typename: 'UserPostLike',
        },
      },
    },
    [LIKE_DISLIKE_ACTION_INPUT.REMOVE]: {
      Delete: {
        TableName: userPostLikeTableName,
        ConditionExpression: 'attribute_exists(#pk)',
        ExpressionAttributeNames: { '#pk': 'userId' },
        Key: userPostLikeItem,
      },
    },
  }

  await dbClient
    .transactWrite({
      TransactItems: [
        // 1. create or delete UserPostLike
        {
          ...transactPartCreateDeleteUserPostLike[event.arguments.input.action],
        },
        // 2. increment / decrement likesCount field in Post
        {
          Update: {
            ExpressionAttributeNames: { '#likesCount': 'likesCount' },
            ExpressionAttributeValues: {
              ':value': event.arguments.input.action === LIKE_DISLIKE_ACTION_INPUT.ADD ? 1 : -1,
            },
            Key: {
              id: event.arguments.input.postId,
            },
            TableName: postTableName,
            UpdateExpression: 'ADD #likesCount :value',
          },
        },
      ],
    })
    .promise()

  // create notification
  if (event.arguments.input.action === LIKE_DISLIKE_ACTION_INPUT.ADD && post.userId !== event.identity.sub) {
    await ApiClient.get().apiFetch<LambdaCreateNotificationMutationVariables, LambdaCreateNotificationMutation>({
      query: lambdaCreateNotification,
      variables: {
        input: {
          showInApp: 1,
          receiverUserId: post.userId,
          senderUserId: event.identity.sub,
          type: NOTIFICATION_TYPE.LIKE_POST,
          postId: event.arguments.input.postId,
        },
      },
    })
  }

  return true
}

export default likeDislikePost
