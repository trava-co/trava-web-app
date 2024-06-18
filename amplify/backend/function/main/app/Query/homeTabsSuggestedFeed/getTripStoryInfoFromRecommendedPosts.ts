import {
  lambdaPrivateGetStoryInfoFromPostQuery,
  lambdaPrivateGetStoryInfoFromPostQueryVariables,
  PRIVACY,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaPrivateGetStoryInfoFromPost } from 'shared-types/graphql/lambda'
import { Recommendation } from 'tearex/models/index'

type TypeTripStoryInfo = { userId: string; tripId: string; score: number; postCount: number; averageScore: number }
export type TypeTripStoryInfoDictionary = Record<string, TypeTripStoryInfo>

const getTripStoryInfoFromRecommendedPosts = async (recommendations: Recommendation[], gtTimestampForData: string) => {
  // construct a dictionary with key of string, value an object describing tripStory metadata
  const tripStoryInfoDictionary: TypeTripStoryInfoDictionary = {}

  const postsPromises = recommendations?.map(async (recommendation) => {
    const res = await ApiClient.get().apiFetch<
      lambdaPrivateGetStoryInfoFromPostQueryVariables,
      lambdaPrivateGetStoryInfoFromPostQuery
    >({
      query: lambdaPrivateGetStoryInfoFromPost,
      variables: {
        id: recommendation.entity.id?.toString(),
      },
    })

    const post = res.data.privateGetPost

    // suggested feed should only display public posts that haven't been deleted
    if (post?.user?.privacy === PRIVACY.PUBLIC && !post?.deletedAt) {
      const postCreatedAt = new Date(post.createdAt)
      const gtTimestampForDataDate = new Date(gtTimestampForData)

      if (postCreatedAt > gtTimestampForDataDate) {
        const storyId = `${post.userId}#${post.tripId}`

        // if the storyId is in the dictionary, operate on it and return
        if (tripStoryInfoDictionary[storyId]) {
          tripStoryInfoDictionary[storyId].score += recommendation.score
          tripStoryInfoDictionary[storyId].postCount += 1
          tripStoryInfoDictionary[storyId].averageScore =
            tripStoryInfoDictionary[storyId].score / tripStoryInfoDictionary[storyId].postCount
          return
        }

        // otherwise the storyId is not in the dictionary, so add it
        tripStoryInfoDictionary[storyId] = {
          userId: post.userId,
          tripId: post.tripId,
          score: recommendation.score,
          postCount: 1,
          averageScore: recommendation.score,
        }
      }
    }
  })

  await Promise.all(postsPromises ?? [])
  return tripStoryInfoDictionary
}

export default getTripStoryInfoFromRecommendedPosts
