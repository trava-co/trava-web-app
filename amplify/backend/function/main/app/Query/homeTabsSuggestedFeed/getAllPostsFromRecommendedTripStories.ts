import {
  LambdaPrivateListPostsByTripQuery,
  LambdaPrivateListPostsByTripQueryVariables,
  PostWithinStory,
  PRIVACY,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaPrivateListPostsByTrip } from 'shared-types/graphql/lambda'
import { HAS_LEFT_THE_TRIP } from '../homeTabsAccountTrips/utils/constants'
import { TypeTripStoryInfoDictionary } from './getTripStoryInfoFromRecommendedPosts'
import getAllPaginatedData from '../../utils/getAllPaginatedData'

const getAllPostsFromRecommendedTripStories = async (
  tripStoryInfoDictionary: TypeTripStoryInfoDictionary,
  viewedPostsIds: string[],
  gtTimestampForData: string,
) => {
  const postsPromises = Object.values(tripStoryInfoDictionary)?.map(async (tripStory) => {
    const postsPromisesByRecommendation: PostWithinStory[] = []

    await getAllPaginatedData(
      async (nextToken) => {
        const res = await ApiClient.get().apiFetch<
          LambdaPrivateListPostsByTripQueryVariables,
          LambdaPrivateListPostsByTripQuery
        >({
          query: lambdaPrivateListPostsByTrip,
          variables: {
            tripId: tripStory.tripId,
            userId: { eq: tripStory.userId },
            postsNextToken: nextToken,
            postsLimit: 50,
            createdDateGTTimestamp: gtTimestampForData,
          },
        })
        return {
          nextToken: res.data.privateListPostsByTripByUser?.nextToken,
          data: res.data,
        }
      },
      (data) => {
        data?.privateListPostsByTripByUser?.items?.forEach((post) => {
          if (post) {
            postsPromisesByRecommendation.push({
              __typename: 'PostWithinStory',
              id: post.id,
              createdAt: post.createdAt,
              userId: post.userId,
              tripId: post.tripId,
              membersLength: post.trip?.members?.items?.length || 0,
              description: post.description || '',
              cloudinaryUrl: post.cloudinaryUrl || '',
              avatar: post.user?.avatar || null,
              // check if post creator still belongs to a trip
              username:
                (post?.trip?.members?.items?.map((el) => el?.userId) || []).indexOf(post.userId) > -1
                  ? post.user?.username || ''
                  : post.user?.username + HAS_LEFT_THE_TRIP,
              authorPublic: post.user?.privacy === PRIVACY.PUBLIC,
              viewed: viewedPostsIds?.indexOf(post.id) > -1,
              destinationIcon: post.destination?.icon || null,
              destinationCoverImage: post.destination?.coverImage || null,
              destinationName: post.destination?.name || null,
              destinationState: post.destination?.state || null,
              destinationCountry: post.destination?.country || null,
              attractionId: post.attractionId || null,
              attractionName: post.attraction?.name || null,
              attractionImage: post.attraction?.images?.[0] || null,
              likesCount: post.likesCount ?? 0,
              commentsCount: post.commentsCount ?? 0,
              mediaType: post.mediaType,
              videoDuration: post.videoDuration,
            })
          }
        })
      },
    )

    const sortedPostPromisesByRecommendationNewestFirst = postsPromisesByRecommendation.sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1,
    )

    return sortedPostPromisesByRecommendationNewestFirst
  })

  const posts = await Promise.all(postsPromises ?? [])

  return posts
}

export default getAllPostsFromRecommendedTripStories
