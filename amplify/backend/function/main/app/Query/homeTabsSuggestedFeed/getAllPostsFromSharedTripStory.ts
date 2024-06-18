import {
  LambdaPrivateGetStoryAndAuthorInfoFromPostQuery,
  LambdaPrivateGetStoryAndAuthorInfoFromPostQueryVariables,
  LambdaPrivateGetUserFollowQuery,
  LambdaPrivateListPostsBySharedStoryQuery,
  LambdaPrivateListPostsBySharedStoryQueryVariables,
  LambdaPrivateGetUserFollowQueryVariables,
  PRIVACY,
  Story,
  PostWithinStory,
  SHARED_POST_ERROR_TYPE,
  S3Object,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  lambdaPrivateGetStoryAndAuthorInfoFromPost,
  lambdaPrivateGetUserFollow,
  lambdaPrivateListPostsBySharedStory,
} from 'shared-types/graphql/lambda'
import getAllPaginatedData from '../../utils/getAllPaginatedData'
import { HAS_LEFT_THE_TRIP } from '../homeTabsAccountTrips/utils/constants'

export class SharedPostError extends Error {
  public readonly type: SHARED_POST_ERROR_TYPE
  public readonly authorId?: string
  public readonly authorUsername?: string
  public readonly authorAvatar?: S3Object

  constructor(type: SHARED_POST_ERROR_TYPE, authorId?: string, authorUsername?: string, authorAvatar?: S3Object) {
    super()
    this.type = type
    this.authorId = authorId
    this.authorUsername = authorUsername
    this.authorAvatar = authorAvatar
  }
}

const getAllPostsFromSharedTripStory = async (postId: string, requestingUserId: string) => {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateGetStoryAndAuthorInfoFromPostQueryVariables,
    LambdaPrivateGetStoryAndAuthorInfoFromPostQuery
  >({
    query: lambdaPrivateGetStoryAndAuthorInfoFromPost,
    variables: {
      id: postId,
    },
  })

  const sharedPost = res.data.privateGetPost

  if (!sharedPost) {
    throw new SharedPostError(SHARED_POST_ERROR_TYPE.POST_NOT_FOUND)
  }

  if (sharedPost?.deletedAt) {
    throw new SharedPostError(SHARED_POST_ERROR_TYPE.POST_DELETED)
  }

  if (sharedPost.user?.privacy === PRIVACY.PRIVATE && sharedPost.userId !== requestingUserId) {
    // if the post is not public, and it's not requesting user's post, check if the requesting user is following the post's user
    const userFollowResponse = await ApiClient.get().apiFetch<
      LambdaPrivateGetUserFollowQueryVariables,
      LambdaPrivateGetUserFollowQuery
    >({
      query: lambdaPrivateGetUserFollow,
      variables: {
        userId: requestingUserId,
        followedUserId: sharedPost?.userId,
      },
    })

    const userFollowByMe = userFollowResponse.data.getUserFollow
    if (!userFollowByMe?.followedUserId || !userFollowByMe.approved) {
      throw new SharedPostError(
        SHARED_POST_ERROR_TYPE.PRIVATE_POST,
        sharedPost.userId,
        sharedPost?.user?.username ?? undefined,
        sharedPost?.user?.avatar ?? undefined,
      )
    }
  }

  const postsPromisesByRecommendation: PostWithinStory[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListPostsBySharedStoryQueryVariables,
        LambdaPrivateListPostsBySharedStoryQuery
      >({
        query: lambdaPrivateListPostsBySharedStory,
        variables: {
          tripId: sharedPost.tripId,
          userId: { eq: sharedPost.userId },
          postsNextToken: nextToken,
          postsLimit: 50,
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
            viewed: post.createdAt < sharedPost.createdAt,
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

  const story = {
    __typename: 'Story' as Story['__typename'],
    storyId: `${sharedPost.userId}#${sharedPost.tripId}`,
    story: sortedPostPromisesByRecommendationNewestFirst,
  }

  return story
}

export default getAllPostsFromSharedTripStory
