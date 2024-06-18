import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaGetPostNotificationPostQuery,
  LambdaGetPostNotificationPostQueryVariables,
  NotificationPostQueryVariables,
  NotificationPostResponse,
  PRIVACY,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_NOTIFICATION_POST } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaGetPostNotificationPost } from 'shared-types/graphql/lambda'
import { HAS_LEFT_THE_TRIP } from './utils/constants'

const homeTabsAccountTrips: AppSyncResolverHandler<NotificationPostQueryVariables, NotificationPostResponse> = async (
  event,
) => {
  ApiClient.get().useIamAuth()

  if (!event.arguments.input?.id) {
    throw new Error('Wrong parameters')
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_NOTIFICATION_POST)
  }

  const post = await ApiClient.get().apiFetch<
    LambdaGetPostNotificationPostQueryVariables,
    LambdaGetPostNotificationPostQuery
  >({
    query: lambdaGetPostNotificationPost,
    variables: {
      id: event.arguments.input.id,
    },
  })

  const item = post?.data?.privateGetPost
  if (!item || item.userId !== event.identity.sub) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_NOTIFICATION_POST)
  }

  if (item?.deletedAt) {
    return {
      __typename: 'NotificationPostResponse',
      post: null,
    }
  }

  return {
    __typename: 'NotificationPostResponse',
    post: {
      __typename: 'NotificationPost',
      id: item.id,
      createdAt: item.createdAt,
      userId: item.userId,
      tripId: item.tripId,
      membersLength: item.trip?.members?.items?.length || 0,
      description: item.description || '',
      cloudinaryUrl: item.cloudinaryUrl || '',
      avatar: item.user?.avatar || null,
      // check if post creator still belongs to a trip
      username:
        (item?.trip?.members?.items?.map((el) => el?.userId) || []).indexOf(item.userId) > -1
          ? item.user?.username || ''
          : item.user?.username + HAS_LEFT_THE_TRIP,
      authorPublic: item.user?.privacy === PRIVACY.PUBLIC,
      destinationId: item.destination?.id || null,
      destinationIcon: item.destination?.icon || '',
      destinationCoverImage: item.destination?.coverImage || null,
      destinationName: item.destination?.name || null,
      destinationState: item.destination?.state || null,
      destinationCountry: item.destination?.country || null,
      attractionId: item.attractionId || null,
      attractionName: item.attraction?.name || null,
      attractionImage: item.attraction?.images?.[0] || null,
      likesCount: item.likesCount ?? 0,
      commentsCount: item.commentsCount ?? 0,
      mediaType: item.mediaType,
    },
  }
}

export default homeTabsAccountTrips
