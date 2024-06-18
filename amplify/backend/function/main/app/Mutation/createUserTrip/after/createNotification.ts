import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateNotificationInput,
  CreateUserTripMutationVariables,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  NOTIFICATION_TYPE,
  UserTrip,
} from 'shared-types/API'
import { lambdaCreateNotification } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'

export async function create(notification: CreateNotificationInput) {
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

const createNotification = async (event: AppSyncResolverEvent<CreateUserTripMutationVariables>, userTrip: UserTrip) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (event.identity && 'sub' in event.identity) {
    // prevent notifying themself
    if (userTrip.userId === event.identity.sub) {
      return null
    }

    await create({
      showInApp: 1,
      receiverUserId: userTrip.userId,
      senderUserId: event.identity.sub,
      tripId: userTrip.tripId,
      type: NOTIFICATION_TYPE.TRIP_INVITATION_SENT,
    })
  }

  return null
}

export default createNotification
