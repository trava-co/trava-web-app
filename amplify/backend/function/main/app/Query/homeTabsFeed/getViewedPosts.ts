import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { LambdaHomeTabsFeedGetViewedPostsQuery, LambdaHomeTabsFeedGetViewedPostsQueryVariables } from 'shared-types/API'
import { lambdaHomeTabsFeedGetViewedPosts } from 'shared-types/graphql/lambda'

const getViewedPostsIds = async (userId: string, gtTimestampForData: string) => {
  const viewedPostsIds: string[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaHomeTabsFeedGetViewedPostsQueryVariables,
        LambdaHomeTabsFeedGetViewedPostsQuery
      >({
        query: lambdaHomeTabsFeedGetViewedPosts,
        variables: {
          id: userId,
          viewedNextToken: nextToken,
          viewedLimit: 100,
          createdDateGTTimestamp: gtTimestampForData,
        },
      })

      return {
        nextToken: res.data.getUser?.viewedPosts?.nextToken,
        data: res.data.getUser?.viewedPosts?.items,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (item?.postId) viewedPostsIds.push(item.postId)
      })
    },
  )

  return viewedPostsIds
}

export default getViewedPostsIds
