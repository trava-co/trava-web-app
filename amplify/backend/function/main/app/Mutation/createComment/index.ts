import {
  CreateCommentMutationVariables,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  LambdaGetUserPrivacyQuery,
  LambdaGetUserPrivacyQueryVariables,
  LambdaHomeTabsFeedPostCommentsCreateCommentGetPostQuery,
  LambdaHomeTabsFeedPostCommentsCreateCommentGetPostQueryVariables,
  NOTIFICATION_TYPE,
  PRIVACY,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import getTableName from '../../utils/getTableName'
import dbClient from '../../utils/dbClient'
import { CUSTOM_NOT_AUTHORIZED_CREATE_COMMENT } from 'shared-types/lambdaErrors'
import * as uuid from 'uuid'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  lambdaCreateNotification,
  lambdaGetUserPrivacy,
  lambdaHomeTabsFeedPostCommentsCreateCommentGetPost,
} from 'shared-types/graphql/lambda'
import getFollowsIds from '../../Query/homeTabsFeed/getFollowsIds'

const createComment: AppSyncResolverHandler<CreateCommentMutationVariables, any> = async (event) => {
  console.log('createComment')

  ApiClient.get().useIamAuth()

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_COMMENT)
  }

  const commentTableName = getTableName(process.env.API_TRAVA_COMMENTTABLE_NAME)
  const postTableName = getTableName(process.env.API_TRAVA_POSTTABLE_NAME)

  // Check if I can leave a comment
  // 1. Get post
  const getPost = await ApiClient.get().apiFetch<
    LambdaHomeTabsFeedPostCommentsCreateCommentGetPostQueryVariables,
    LambdaHomeTabsFeedPostCommentsCreateCommentGetPostQuery
  >({
    query: lambdaHomeTabsFeedPostCommentsCreateCommentGetPost,
    variables: {
      id: event.arguments.input.postId,
    },
  })

  const post = getPost?.data?.privateGetPost

  if (!post) {
    throw new Error('no post')
  }

  // 2. check if I am post creator
  if (event.identity.sub !== post.userId) {
    // check if user is public
    const user = await ApiClient.get().apiFetch<LambdaGetUserPrivacyQueryVariables, LambdaGetUserPrivacyQuery>({
      query: lambdaGetUserPrivacy,
      variables: {
        userId: post.userId,
      },
    })

    if (user?.data?.getUser?.privacy === PRIVACY.PRIVATE) {
      // check if I follow this userId
      const followsIds = await getFollowsIds(event.identity.sub)
      if (followsIds.indexOf(post.userId) === -1) {
        throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_COMMENT)
      }
    }
  }

  const now = new Date()

  const newCommentId = uuid.v4()

  await dbClient
    .transactWrite({
      TransactItems: [
        // 1. create Comment
        {
          Put: {
            TableName: commentTableName,
            Item: {
              id: newCommentId,
              userId: event.identity.sub,
              postId: event.arguments.input.postId,
              text: event.arguments.input.text,
              updatedAt: now.toISOString(),
              createdAt: now.toISOString(),
              __typename: 'Comment',
            },
          },
        },
        // 2. increment commentsCount field in Post
        {
          Update: {
            ExpressionAttributeNames: { '#commentsCount': 'commentsCount' },
            ExpressionAttributeValues: {
              ':value': 1,
            },
            Key: {
              id: event.arguments.input.postId,
            },
            TableName: postTableName,
            UpdateExpression: 'ADD #commentsCount :value',
          },
        },
      ],
    })
    .promise()

  // create notification
  if (event.identity.sub !== post.userId) {
    await ApiClient.get().apiFetch<LambdaCreateNotificationMutationVariables, LambdaCreateNotificationMutation>({
      query: lambdaCreateNotification,
      variables: {
        input: {
          showInApp: 1,
          receiverUserId: post.userId,
          senderUserId: event.identity.sub,
          type: NOTIFICATION_TYPE.COMMENT_POST,
          commentId: newCommentId,
          postId: event.arguments.input.postId,
          tripId: post.tripId,
        },
      },
    })
  }

  return true
}

export default createComment
