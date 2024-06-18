import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateNotificationInput,
  CreateUserFollowMutationVariables,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  NOTIFICATION_TYPE,
  UserFollow,
} from 'shared-types/API'
import { lambdaCreateNotification } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'

async function create(notification: CreateNotificationInput) {
  const res = await ApiClient.get().apiFetch<
    LambdaCreateNotificationMutationVariables,
    LambdaCreateNotificationMutation
  >({
    query: lambdaCreateNotification,
    variables: {
      input: notification,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.createNotification
}

const createNotification = async (
  event: AppSyncResolverEvent<CreateUserFollowMutationVariables>,
  userFollow: UserFollow,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  if (userFollow.approved) {
    await create({
      showInApp: 1,
      receiverUserId: userFollow.followedUserId,
      senderUserId: event.identity.sub,
      type: NOTIFICATION_TYPE.NEW_FOLLOW,
    })
  } else {
    await create({
      showInApp: 1,
      receiverUserId: userFollow.followedUserId,
      senderUserId: event.identity.sub,
      type: NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT,
    })
  }

  return null
}

export default createNotification
