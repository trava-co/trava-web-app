import { AppSyncResolverHandler } from 'aws-lambda'
import {
  HomeTabsFeedPeopleOnThisTripQueryVariables,
  HomeTabsFeedPeopleOnThisTripResponse,
  LambdaGetUserPrivacyQuery,
  LambdaGetUserPrivacyQueryVariables,
  LambdaHomeTabsFeedPostDetailsGetMembersQuery,
  LambdaHomeTabsFeedPostDetailsGetMembersQueryVariables,
  LambdaHomeTabsFeedPostDetailsGetUserFollowQuery,
  LambdaHomeTabsFeedPostDetailsGetUserFollowQueryVariables,
  PRIVACY,
  UserFollow,
  UserTrip,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED_DETAILS } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  lambdaGetUserPrivacy,
  lambdaHomeTabsFeedPostDetailsGetMembers,
  lambdaHomeTabsFeedPostDetailsGetUserFollow,
} from 'shared-types/graphql/lambda'
import getFollowsIds from '../homeTabsFeed/getFollowsIds'
import notEmpty from '../../utils/notEmpty'

const homeTabsFeedPeopleOnThisTrip: AppSyncResolverHandler<
  HomeTabsFeedPeopleOnThisTripQueryVariables,
  HomeTabsFeedPeopleOnThisTripResponse
> = async (event) => {
  ApiClient.get().useIamAuth()

  if (!event.arguments.input) {
    throw new Error('invalid arguments')
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED_DETAILS)
  }

  const myUserId = event.identity.sub

  // check if userId is mine
  if (myUserId !== event.arguments.input.userId) {
    // check if user is public
    const user = await ApiClient.get().apiFetch<LambdaGetUserPrivacyQueryVariables, LambdaGetUserPrivacyQuery>({
      query: lambdaGetUserPrivacy,
      variables: {
        userId: event.arguments.input.userId,
      },
    })

    if (user?.data?.getUser?.privacy === PRIVACY.PRIVATE) {
      // check if I follow this userId
      const followsIds = await getFollowsIds(event.identity.sub)
      if (followsIds.indexOf(event.arguments.input.userId) === -1) {
        throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED_DETAILS)
      }
    }
  }

  // 1. Get members of the trip to which the post is connected
  const getMembers = await ApiClient.get().apiFetch<
    LambdaHomeTabsFeedPostDetailsGetMembersQueryVariables,
    LambdaHomeTabsFeedPostDetailsGetMembersQuery
  >({
    query: lambdaHomeTabsFeedPostDetailsGetMembers,
    variables: {
      tripId: event.arguments.input.tripId,
    },
  })

  const getMembersIds = getMembers?.data?.privateGetTrip?.members?.items?.filter(notEmpty).map((el) => el.userId)

  // 2. Get UserFollows for each member (computed userFollowByMe doesn't work with iam auth)
  if (!getMembersIds) {
    throw new Error('No members')
  }
  const userFollowPromises = getMembersIds.map((memberId) => {
    return ApiClient.get().apiFetch<
      LambdaHomeTabsFeedPostDetailsGetUserFollowQueryVariables,
      LambdaHomeTabsFeedPostDetailsGetUserFollowQuery
    >({
      query: lambdaHomeTabsFeedPostDetailsGetUserFollow,
      variables: {
        userId: myUserId,
        followedUserId: memberId,
      },
    })
  })

  const getUserFollows = await Promise.all(userFollowPromises)

  return {
    __typename: 'HomeTabsFeedPeopleOnThisTripResponse',
    members: getMembers?.data?.privateGetTrip?.members?.items as [UserTrip],
    userFollows: getUserFollows.map((el) => el?.data?.getUserFollow) as [UserFollow],
  }
}

export default homeTabsFeedPeopleOnThisTrip
