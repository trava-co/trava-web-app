import { AppSyncResolverHandler } from 'aws-lambda'
import { HomeTabsAccountTripsQueryVariables, HomeTabsAccountTripsResponse } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_ACCOUNT_TRIPS } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getViewedPostsIds from '../homeTabsFeed/getViewedPosts'
import getPostsByUser from './getPostsByUser'
import dayjs from 'dayjs'
import lodashGroupBy from 'lodash.groupby'

const homeTabsAccountTrips: AppSyncResolverHandler<
  HomeTabsAccountTripsQueryVariables,
  HomeTabsAccountTripsResponse
> = async (event) => {
  ApiClient.get().useIamAuth()

  if (!event.arguments.input?.id) {
    throw new Error('Wrong parameters')
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_ACCOUNT_TRIPS)
  }

  // TODO: Add authorization checks (if account is private, if I follow this account, if I am this account, if account is public)

  const gtTimestampForData = dayjs().subtract(360, 'day').toISOString() // data (UserPosts) will be retrieved for the last 360 days

  // 1. get viewed posts data
  const viewedPostsIds = await getViewedPostsIds(event.identity.sub, gtTimestampForData)

  // 2. get posts by user
  const postsByUser = await getPostsByUser(event.arguments.input.id, viewedPostsIds, gtTimestampForData)

  // 3. group posts into stories by trip
  const postsByTrip = lodashGroupBy(postsByUser, (post) => `${post.userId}#${post.tripId}`)

  // 4. sort stories by newest post within story
  const sortedByNewestPostWithinStories = Object.entries(postsByTrip)?.sort((a, b) =>
    dayjs(b[1][0].createdAt).isAfter(dayjs(a[1][0].createdAt)) ? 1 : -1,
  )

  return {
    __typename: 'HomeTabsAccountTripsResponse',
    stories: sortedByNewestPostWithinStories.map((el) => ({
      __typename: 'StoryAccountTrips',
      storyId: el[0],
      story: el[1],
    })),
  }
}

export default homeTabsAccountTrips
