import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateNotificationInput,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  NOTIFICATION_TYPE,
  UpdateUserTripMutationVariables,
  UserTrip,
  UserTripStatus,
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

const createNotification = async (event: AppSyncResolverEvent<UpdateUserTripMutationVariables>, userTrip: UserTrip) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  // don't notify if a userTrip update doesn't set the status to APPROVED
  if (event.arguments.input.status !== UserTripStatus.APPROVED) {
    return null
  }

  // don't notify themself (example: inviting to a trip via dynamic link -> accepting the invitation)
  if (userTrip.invitedByUserId === event.identity.sub) {
    return null
  }

  await create({
    showInApp: 1,
    receiverUserId: userTrip.invitedByUserId,
    senderUserId: event.identity.sub,
    tripId: userTrip.tripId,
    type: NOTIFICATION_TYPE.TRIP_INVITATION_ACCEPTED,
  })

  return null
}

export default createNotification
