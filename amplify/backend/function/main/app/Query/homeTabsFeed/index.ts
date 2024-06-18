import { AppSyncResolverHandler } from 'aws-lambda'
import { HomeTabsFeedResponse } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import lodashGroupBy from 'lodash.groupby'
import dayjs from 'dayjs'
import getFollowsIds from './getFollowsIds'
import getViewedPostsIds from './getViewedPosts'
import getPostsByUsers from './getPostsByUsers'
import getBlockedUsersIds from '../../utils/getBlockedUsersIds'

const homeTabsFeed: AppSyncResolverHandler<undefined, HomeTabsFeedResponse> = async (event) => {
  ApiClient.get().useIamAuth()

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED)
  }

  const gtTimestampForData = dayjs().subtract(180, 'day').toISOString() // data (Posts, UserPosts) will be retrieved for the last 180 days

  // 1. get following users
  const followsIds = await getFollowsIds(event.identity.sub)

  // 2. get blocked users
  const { blockedByIds, blocksIds } = await getBlockedUsersIds(event.identity.sub)

  // 3. get viewed posts data from past 180 days
  const viewedPostsIds = await getViewedPostsIds(event.identity.sub, gtTimestampForData)

  // 4. for each following user get his posts created within past 180 days
  const postsByUsers = await getPostsByUsers(followsIds, viewedPostsIds, gtTimestampForData)

  // 5. group posts into stories by user by trip
  const postsByUserGroupedByTrip = lodashGroupBy(postsByUsers.flat(), (post) => `${post.userId}#${post.tripId}`)

  // 6. filter stories (don't show stories with all viewed posts and posts by blocked users), sort stories by newest post within story
  const filteredByViewedEntireStorySortedByNewestPostWithinStories = Object.entries(postsByUserGroupedByTrip)
    ?.filter((story) =>
      story[1].some((post) => !blockedByIds.includes(post.userId) && !blocksIds.includes(post.userId)),
    )
    ?.filter((story) => story[1].some((post) => !post.viewed))
    ?.sort((a, b) => (dayjs(b[1][0].createdAt).isAfter(dayjs(a[1][0].createdAt)) ? 1 : -1))

  return {
    __typename: 'HomeTabsFeedResponse',
    stories: filteredByViewedEntireStorySortedByNewestPostWithinStories.map((el) => ({
      __typename: 'Story',
      storyId: el[0],
      story: el[1],
    })),
  }
}

export default homeTabsFeed
