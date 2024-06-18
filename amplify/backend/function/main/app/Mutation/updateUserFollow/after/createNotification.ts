import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateNotificationInput,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  NOTIFICATION_TYPE,
  UpdateUserFollowMutationVariables,
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
  event: AppSyncResolverEvent<UpdateUserFollowMutationVariables>,
  userFollow: UserFollow,
) => {
  console.log('event', event)

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  await create({
    showInApp: 1,
    receiverUserId: userFollow.userId,
    senderUserId: userFollow.followedUserId,
    type: NOTIFICATION_TYPE.FOLLOW_REQUEST_ACCEPTED,
  })

  return null
}

export default createNotification
