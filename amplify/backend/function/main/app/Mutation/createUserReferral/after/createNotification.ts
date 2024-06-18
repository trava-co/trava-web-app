import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateNotificationInput,
  CreateUserReferralMutationVariables,
  LambdaCreateNotificationMutation,
  LambdaCreateNotificationMutationVariables,
  NOTIFICATION_TYPE,
  UserReferral,
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
  event: AppSyncResolverEvent<CreateUserReferralMutationVariables>,
  userReferral: UserReferral,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  // notify both the referrer and referred users
  await Promise.all([
    create({
      showInApp: 1,
      receiverUserId: userReferral.userId, // referring user
      senderUserId: event.identity.sub, // referred user
      type: NOTIFICATION_TYPE.REFERRAL_JOINED,
    }),
    create({
      showInApp: 1,
      receiverUserId: event.identity.sub, // referred user
      senderUserId: userReferral.userId, // referring user
      type: NOTIFICATION_TYPE.REFERRAL_ONBOARDING,
    }),
  ])

  return null
}

export default createNotification
