import notEmpty from '../../utils/notEmpty'
import {
  LambdaHomeTabsFeedGetPostsQuery,
  LambdaHomeTabsFeedGetPostsQueryVariables,
  PostWithinStory,
  PRIVACY,
} from 'shared-types/API'
import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaHomeTabsFeedGetPosts } from 'shared-types/graphql/lambda'
import { HAS_LEFT_THE_TRIP } from '../homeTabsAccountTrips/utils/constants'

const getPostsByUsers = async (followsIds: string[], viewedPostsIds: string[], gtTimestampForData: string) => {
  const postsPromises = followsIds.filter(notEmpty).map(async (followingId) => {
    const postsPromisesByUser: PostWithinStory[] = []

    await getAllPaginatedData(
      async (nextToken) => {
        const res = await ApiClient.get().apiFetch<
          LambdaHomeTabsFeedGetPostsQueryVariables,
          LambdaHomeTabsFeedGetPostsQuery
        >({
          query: lambdaHomeTabsFeedGetPosts,
          variables: {
            id: followingId,
            postsNextToken: nextToken,
            postsLimit: 50,
            createdDateGTTimestamp: gtTimestampForData,
          },
        })

        return {
          nextToken: res.data.getUser?.posts?.nextToken,
          data: res.data,
        }
      },
      (data) => {
        data?.getUser?.posts?.items.forEach((item) => {
          if (item)
            postsPromisesByUser.push({
              __typename: 'PostWithinStory',
              id: item.id,
              createdAt: item.createdAt,
              userId: followingId,
              tripId: item.tripId,
              membersLength: item.trip?.members?.items?.length || 0,
              description: item.description || '',
              cloudinaryUrl: item.cloudinaryUrl || '',
              avatar: data?.getUser?.avatar || null,
              // check if post creator still belongs to a trip
              username:
                (item?.trip?.members?.items?.map((el) => el?.userId) || []).indexOf(followingId) > -1
                  ? data?.getUser?.username || ''
                  : data?.getUser?.username + HAS_LEFT_THE_TRIP,
              authorPublic: data?.getUser?.privacy === PRIVACY.PUBLIC,
              viewed: viewedPostsIds?.indexOf(item.id) > -1,
              destinationIcon: item.destination?.icon || null,
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
              videoDuration: item.videoDuration,
            })
        })
      },
    )

    return postsPromisesByUser
  })

  return await Promise.all(postsPromises)
}

export default getPostsByUsers
