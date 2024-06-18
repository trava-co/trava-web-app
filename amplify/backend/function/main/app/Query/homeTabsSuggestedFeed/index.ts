import { AppSyncResolverHandler } from 'aws-lambda'
import {
  HomeTabsSuggestedFeedQueryVariables,
  HomeTabsSuggestedFeedResponse,
  SHARED_POST_ERROR_TYPE,
} from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import lodashGroupBy from 'lodash.groupby'
import dayjs from 'dayjs'
import getViewedPostsIds from './getViewedPosts'
import tearex from 'tearex'
import getBlockedUsersIds from '../../utils/getBlockedUsersIds'
import getTripStoryInfoFromRecommendedPosts from './getTripStoryInfoFromRecommendedPosts'
import getAllPostsFromRecommendedTripStories from './getAllPostsFromRecommendedTripStories'
import getAllPostsFromSharedTripStory, { SharedPostError } from './getAllPostsFromSharedTripStory'
import getReferringUserInfo from './getReferringUserInfo'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const homeTabsSuggestedFeed: AppSyncResolverHandler<
  HomeTabsSuggestedFeedQueryVariables,
  HomeTabsSuggestedFeedResponse
> = async (event) => {
  ApiClient.get().useIamAuth()

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED)
  }

  const gtTimestampForData = dayjs().subtract(180, 'day').toISOString() // data (Posts, UserPosts) will be retrieved for the last 180 days

  const { sharedPostId, referringUserId } = event.arguments.input || {} // if sharedPostId is provided, we will return this story first, with the shared post displayed first

  // 1a. get blocked users
  const blockedUsersInfo = getBlockedUsersIds(event.identity.sub)

  let suggestedFeedResponse: HomeTabsSuggestedFeedResponse = {
    __typename: 'HomeTabsSuggestedFeedResponse',
    stories: null,
    sharedPostError: null,
    referringUserInfo: null,
  }

  // 1b. if sharedPostId is provided, get the trip story info for this post
  let sharedPostTripStoryInfo, sharedPostReferringUserInfo
  if (sharedPostId && referringUserId) {
    sharedPostTripStoryInfo = getAllPostsFromSharedTripStory(sharedPostId, event.identity.sub)
    sharedPostTripStoryInfo.catch((e) => {
      if (e instanceof SharedPostError) {
        suggestedFeedResponse.sharedPostError = {
          ...e,
          __typename: 'SharedPostError',
        }
      } else {
        throw e
      }
    })

    sharedPostReferringUserInfo = getReferringUserInfo(referringUserId)
    sharedPostReferringUserInfo.catch()
  }

  // 2a. tearex returns individual post recommendations that this user hasn't seen yet
  const recommendations = await tearex.recommend(
    {
      id: event.identity.sub,
      label: 'User',
    },
    'Post',
    { limit: 250 },
  )

  // 3. identify all trip stories associated with these recommended posts, as well as the average score of unwatched posts in each trip story
  // 4. get viewed posts data from past 180 days
  const [tripStoryInfo, viewedPostsIds] = await Promise.all([
    getTripStoryInfoFromRecommendedPosts(recommendations, gtTimestampForData),
    getViewedPostsIds(event.identity.sub, gtTimestampForData),
  ])

  // 5. for each tripStory, get all posts from past 180 days
  const postsByUsers = await getAllPostsFromRecommendedTripStories(tripStoryInfo, viewedPostsIds, gtTimestampForData)

  // 6. group posts into stories by user by trip
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const postsByUserGroupedByTrip = lodashGroupBy(postsByUsers.flat(), (post) => `${post.userId}#${post.tripId}`)

  // ensure blockedUsersInfo is resolved
  const { blockedByIds, blocksIds } = await blockedUsersInfo

  // 7. filter stories (don't show stories with all viewed posts and posts by blocked users), don't show posts created by the current user
  const filteredByViewedEntireStorySortedByHighestAverageScore = Object.entries(postsByUserGroupedByTrip)
    ?.filter((story) =>
      story[1].some((post) => !blockedByIds.includes(post.userId) && !blocksIds.includes(post.userId)),
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ?.filter((story) => story[1].some((post) => !post.viewed && post.userId !== event.identity.sub && !post.deletedAt))
    // sort by average score of unwatched segments in story (only unwatched segments will be scored by tearex)
    ?.sort((a, b) => (tripStoryInfo[a[0]].averageScore > tripStoryInfo[b[0]].averageScore ? -1 : 1))

  suggestedFeedResponse.stories = filteredByViewedEntireStorySortedByHighestAverageScore.map((el) => ({
    __typename: 'Story',
    storyId: el[0],
    story: el[1],
  }))

  // 8. if sharedPostId is provided, return this story first
  if (sharedPostId) {
    // 8a. get the referring user's info
    try {
      const referringUserInfo = await sharedPostReferringUserInfo
      const { id, avatar, username } = referringUserInfo || {}
      if (id && username) {
        suggestedFeedResponse.referringUserInfo = { id, avatar, username, __typename: 'ReferringUserInfo' }
      }
    } catch (e) {
      console.log('Error with sharedPostReferringUserInfo 1', e)
    }

    // 8b. get the story info for this post
    try {
      const storyInfo = await sharedPostTripStoryInfo

      const storyAuthorId = storyInfo?.story?.[0]?.userId
      const storyTripId = storyInfo?.story?.[0]?.tripId
      const storyAuthorUsername = storyInfo?.story?.[0]?.username
      const storyAuthorAvatar = storyInfo?.story?.[0]?.avatar

      // if story already in suggested feed, remove it from there
      suggestedFeedResponse.stories = suggestedFeedResponse.stories?.filter(
        (story) => story?.storyId !== `${storyAuthorId}#${storyTripId}`,
      )

      // if requesting user or author of shared post is blocked, throw error
      if (storyAuthorId) {
        if (blockedByIds.includes(storyAuthorId)) {
          throw new SharedPostError(SHARED_POST_ERROR_TYPE.BLOCKED_USER)
        } else if (blocksIds.includes(storyAuthorId)) {
          throw new SharedPostError(
            SHARED_POST_ERROR_TYPE.BLOCKED_AUTHOR,
            storyAuthorId,
            storyAuthorUsername ?? undefined,
            storyAuthorAvatar ?? undefined,
          )
        }
      }

      // ensure story contains at least one post
      if (storyInfo && storyInfo.story.length && storyAuthorId) {
        suggestedFeedResponse.stories?.unshift(storyInfo)
      }
    } catch (e) {
      console.log('Error with sharedPostTripStoryInfo 2', e)
      // if error is of type SHARED_POST_ERROR, assign to suggestedFeedResponse.error
      if (e instanceof SharedPostError) {
        suggestedFeedResponse.sharedPostError = { ...e, __typename: 'SharedPostError' }
      }
    }
  }

  return suggestedFeedResponse
}

export default homeTabsSuggestedFeed
