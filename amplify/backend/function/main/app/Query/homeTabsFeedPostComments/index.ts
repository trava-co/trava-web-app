import { AppSyncResolverHandler } from 'aws-lambda'
import {
  HomeTabsFeedPostCommentsQueryVariables,
  HomeTabsFeedPostCommentsResponse,
  LambdaGetUserPrivacyQuery,
  LambdaGetUserPrivacyQueryVariables,
  LambdaHomeTabsFeedPostCommentsGetPostQuery,
  LambdaHomeTabsFeedPostCommentsGetPostQueryVariables,
  PRIVACY,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_POST_COMMENTS } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaGetUserPrivacy, lambdaHomeTabsFeedPostCommentsGetPost } from 'shared-types/graphql/lambda'
import getFollowsIds from '../homeTabsFeed/getFollowsIds'
import notEmpty from '../../utils/notEmpty'
import getBlockedUsersIds from '../../utils/getBlockedUsersIds'

const homeTabsFeedPostComments: AppSyncResolverHandler<
  HomeTabsFeedPostCommentsQueryVariables,
  HomeTabsFeedPostCommentsResponse
> = async (event) => {
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_POST_COMMENTS)
  }

  // Get post
  const getPost = await ApiClient.get().apiFetch<
    LambdaHomeTabsFeedPostCommentsGetPostQueryVariables,
    LambdaHomeTabsFeedPostCommentsGetPostQuery
  >({
    query: lambdaHomeTabsFeedPostCommentsGetPost,
    variables: {
      id: event.arguments.input.postId,
    },
  })

  const post = getPost?.data?.privateGetPost

  if (!post) {
    throw new Error('no post')
  }

  // check if I am post creator
  if (event.identity.sub !== post.userId) {
    // check if user is public
    const user = await ApiClient.get().apiFetch<LambdaGetUserPrivacyQueryVariables, LambdaGetUserPrivacyQuery>({
      query: lambdaGetUserPrivacy,
      variables: {
        userId: post.userId,
      },
    })

    if (user?.data?.getUser?.privacy === PRIVACY.PRIVATE) {
      // check if I follow post creator
      const followsIds = await getFollowsIds(event.identity.sub)
      if (followsIds.indexOf(post.userId) === -1) {
        throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_POST_COMMENTS)
      }
    }
  }

  // get blocked users
  const { blockedByIds, blocksIds } = await getBlockedUsersIds(event.identity.sub)

  return {
    __typename: 'HomeTabsFeedPostCommentsResponse',
    id: post.id,
    userId: post.userId,
    tripId: post.tripId,
    username: post.user?.username || '',
    membersLength: post.trip?.members?.items?.length || 0,
    avatar: post.user?.avatar,
    description: post.description,
    comments: post.comments?.items
      ?.filter(notEmpty)
      .filter((comment) => !blockedByIds.includes(comment.userId) && !blocksIds.includes(comment.userId))
      .map((comment) => ({
        __typename: 'HomeTabsFeedPostCommentsResponseComment',
        id: comment.id,
        userId: comment.userId,
        username: comment.user?.username || '',
        avatar: comment.user?.avatar,
        text: comment.text,
        updatedAt: comment.updatedAt,
      })),
  }
}

export default homeTabsFeedPostComments
