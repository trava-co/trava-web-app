import notEmpty from '../../utils/notEmpty'
import {
  LambdaHomeTabsAccountTripsGetPostsQuery,
  LambdaHomeTabsAccountTripsGetPostsQueryVariables,
  PostWithinStoryAccountTrips,
  PRIVACY,
} from 'shared-types/API'
import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaHomeTabsAccountTripsGetPosts } from 'shared-types/graphql/lambda'
import getTripDateRange from './utils/get-trip-date-range'
import getDestinationsString from './utils/get-destinations-string'
import { HAS_LEFT_THE_TRIP } from './utils/constants'

const getPostsByUser = async (userId: string, viewedPostsIds: string[], gtTimestampForData: string) => {
  const postsByUser: PostWithinStoryAccountTrips[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaHomeTabsAccountTripsGetPostsQueryVariables,
        LambdaHomeTabsAccountTripsGetPostsQuery
      >({
        query: lambdaHomeTabsAccountTripsGetPosts,
        variables: {
          id: userId,
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
          postsByUser.push({
            __typename: 'PostWithinStoryAccountTrips',
            id: item.id,
            createdAt: item.createdAt,
            userId: userId,
            tripId: item.tripId,
            membersLength: item.trip?.members?.items?.length || 0,
            description: item.description || '',
            cloudinaryUrl: item.cloudinaryUrl || '',
            avatar: data?.getUser?.avatar || null,
            // check if post creator still belongs to a trip
            username:
              (item?.trip?.members?.items?.map((el) => el?.userId) || []).indexOf(userId) > -1
                ? data?.getUser?.username || ''
                : data?.getUser?.username + HAS_LEFT_THE_TRIP,
            authorPublic: data?.getUser?.privacy === PRIVACY.PUBLIC,
            viewed: viewedPostsIds?.indexOf(item.id) > -1,
            dateRange: getTripDateRange(
              item.trip?.tripDestinations?.items?.filter(notEmpty).map((el) => ({
                startDate: el.startDate,
                endDate: el.endDate,
              })) || [],
            ),
            destinations: getDestinationsString(
              item.trip?.tripDestinations?.items?.filter(notEmpty).map((el) => ({
                startDate: el.startDate,
                endDate: el.endDate,
                name: el.destination?.name || '',
              })) || [],
            ),
            destinationId: item.destination?.id || null,
            destinationIcon: item.destination?.icon || '',
            destinationState: item.destination?.state || '',
            destinationCountry: item.destination?.country || '',
            destinationCoverImage: item.destination?.coverImage || null,
            destinationName: item.destination?.name || null,
            destinationGooglePlaceId: item.destination?.googlePlaceId || null,
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

  return postsByUser
}

export default getPostsByUser
