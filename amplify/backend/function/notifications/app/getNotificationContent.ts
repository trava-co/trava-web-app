import {
  LambdaGetAttractionNotificationsQuery,
  LambdaGetAttractionNotificationsQueryVariables,
  LambdaGetCommentNotificationsQuery,
  LambdaGetCommentNotificationsQueryVariables,
  LambdaGetTripNotificationsQuery,
  LambdaGetTripNotificationsQueryVariables,
  LambdaGetUserNotificationsQuery,
  LambdaGetUserNotificationsQueryVariables,
  Notification,
  NOTIFICATION_TYPE,
} from 'shared-types/API'
import ApiClient from './utils/apiClient'
import {
  lambdaGetAttractionNotifications,
  lambdaGetCommentNotifications,
  lambdaGetTripNotifications,
  lambdaGetUserNotifications,
} from 'shared-types/graphql/lambda'

enum navigators {
  NOTIFICATIONS_NAVIGATOR = 'NOTIFICATIONS_NAVIGATOR',
  TRIP_TABS_NAVIGATOR = 'TRIP_TABS_NAVIGATOR',
}

enum screens {
  LIST = 'LIST',
  CHAT = 'CHAT',
}

const getNotificationContent = async (notification: Notification) => {
  let navigator = navigators.NOTIFICATIONS_NAVIGATOR
  let screen = screens.LIST
  let params

  // fallback
  let title = 'Trava'
  let body = "Tap to see what's new..."

  let user
  let trip
  let attraction
  let comment

  // similar to frontend /app/mutations/createBasecampSystemMessage.ts but title and messages are slightly different
  switch (notification.type) {
    case NOTIFICATION_TYPE.JOIN_TRIP:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.name} (${user?.username}) has joined ${trip?.name}. Say hi!`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.CREATE_CALENDAR:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${notification.text}. Check it out!`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.EDIT_CALENDAR:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${notification.text}. View the new itinerary.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.EDIT_DATES:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} edited the dates for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.RENAME_TRIP:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} edited the name of your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.ADD_DESTINATION:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} edited the destinations for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.REMOVE_DESTINATION:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} edited the destinations for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.ADD_FLIGHT:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} added a flight reservation for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.ADD_LODGING:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} added a lodging reservation for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.ADD_CAR_RENTAL:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.username} added a car rental reservation for your trip.`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    case NOTIFICATION_TYPE.USER_MESSAGE:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = `${user?.name}: ${notification.text || 'new photo'}`
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    // not specified
    case NOTIFICATION_TYPE.RECALCULATE_CALENDAR:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      title = `${trip?.name}`
      body = notification.text || ''
      navigator = navigators.TRIP_TABS_NAVIGATOR
      screen = screens.CHAT
      params = { tripId: notification.tripId }
      break

    // social
    case NOTIFICATION_TYPE.NEW_FOLLOW:
      user = await getUserData(notification.senderUserId)
      body = `${user?.name} (${user?.username}) started following you`
      break

    case NOTIFICATION_TYPE.TRIP_INVITATION_SENT:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      body = `${user?.name} (${user?.username}) invited you to a new trip: ${trip?.name}`
      break

    case NOTIFICATION_TYPE.TRIP_INVITATION_ACCEPTED:
      if (!notification.tripId) {
        throw new Error('no tripId')
      }
      user = await getUserData(notification.senderUserId)
      trip = await getTripData(notification.tripId)
      body = `${user?.name} (${user?.username}) accepted your ${trip?.name} trip invitation.`
      break

    case NOTIFICATION_TYPE.FOLLOW_REQUEST_ACCEPTED:
      user = await getUserData(notification.senderUserId)
      body = `${user?.name} (${user?.username}) accepted your follow request. Now you can see their posts, bucket list, and created cards.`
      break

    case NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT:
      user = await getUserData(notification.senderUserId)
      body = `${user?.name} (${user?.username}) is requesting to follow you.`
      break

    case NOTIFICATION_TYPE.BUCKET_LIST_ATTRACTION:
      if (!notification.attractionId) {
        throw new Error('no attractionId')
      }
      user = await getUserData(notification.senderUserId)
      attraction = await getAttractionData(notification.attractionId)
      body = `${user?.username} bucketlisted your activity: ${attraction?.name}.`
      break

    case NOTIFICATION_TYPE.COMMENT_POST:
      if (!notification.commentId || !notification.postId) {
        throw new Error('no commentId or postId')
      }
      user = await getUserData(notification.senderUserId)
      comment = await getCommentData(notification.commentId)
      body = `${user?.username} commented on your post: "${comment?.text}"`
      break

    case NOTIFICATION_TYPE.LIKE_POST:
      if (!notification.postId) {
        throw new Error('no postId')
      }
      user = await getUserData(notification.senderUserId)
      body = `${user?.username} liked your post.`
      break
    case NOTIFICATION_TYPE.REFERRAL_JOINED:
      user = await getUserData(notification.senderUserId)
      body = `${user?.username} accepted your invite to join Trava 🎉`
      break

    // TODO: trip
    // finished voting: "username finished voting for San Francisco."
    // everyone finished voting: "Everyone has finished voting for San Francisco 🎉 Create the itinerary now!"
    // 3 days since you’ve last swiped an activity for a destination, and you are not marked ready: "We can’t make the itinerary without you! Vote on San Francisco activities now."
  }

  console.log(`title: ${title}\nbody: ${body}`)

  return {
    title,
    body,
    navigator,
    screen,
    stringifyParams: params ? JSON.stringify(params) : '',
  }
}

const getUserData = async (userId: string) => {
  const res = await ApiClient.get().apiFetch<LambdaGetUserNotificationsQueryVariables, LambdaGetUserNotificationsQuery>(
    {
      query: lambdaGetUserNotifications,
      variables: {
        userId,
      },
    },
  )
  return res?.data?.getUser
}

const getTripData = async (tripId: string) => {
  const res = await ApiClient.get().apiFetch<LambdaGetTripNotificationsQueryVariables, LambdaGetTripNotificationsQuery>(
    {
      query: lambdaGetTripNotifications,
      variables: {
        tripId,
      },
    },
  )
  return res?.data?.privateGetTrip
}

const getAttractionData = async (attractionId: string) => {
  const res = await ApiClient.get().apiFetch<
    LambdaGetAttractionNotificationsQueryVariables,
    LambdaGetAttractionNotificationsQuery
  >({
    query: lambdaGetAttractionNotifications,
    variables: {
      id: attractionId,
    },
  })
  return res?.data?.getAttraction
}

const getCommentData = async (commentId: string) => {
  const res = await ApiClient.get().apiFetch<
    LambdaGetCommentNotificationsQueryVariables,
    LambdaGetCommentNotificationsQuery
  >({
    query: lambdaGetCommentNotifications,
    variables: {
      id: commentId,
    },
  })
  return res?.data?.getComment
}

export default getNotificationContent
