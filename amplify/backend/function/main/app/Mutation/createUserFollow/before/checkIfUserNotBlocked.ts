import { AppSyncResolverHandler } from 'aws-lambda'
import { CreateUserFollowMutationVariables, GetUserBlockQuery, GetUserBlockQueryVariables } from 'shared-types/API'
import {
  CUSTOM_NOT_AUTHORIZED_CREATE_USER_FOLLOW,
  CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE,
} from 'shared-types/lambdaErrors'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { getUserBlock } from 'shared-types/graphql/queries'

const checkIfUserNotBlocked: AppSyncResolverHandler<CreateUserFollowMutationVariables, null> = async (event) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  // if user (sub) belongs to tripId - can create (example: add members)

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_TRIP_MESSAGE)
  }

  // check if user block exists from one side...
  const userBlockedByMe = await ApiClient.get().apiFetch<GetUserBlockQueryVariables, GetUserBlockQuery>({
    query: getUserBlock,
    variables: {
      userId: event.arguments.input.userId,
      blockedUserId: event.arguments.input.followedUserId,
    },
  })

  if (userBlockedByMe?.data?.getUserBlock) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_FOLLOW)
  }

  // ...and from the opposite side
  const blockOfMeByUser = await ApiClient.get().apiFetch<GetUserBlockQueryVariables, GetUserBlockQuery>({
    query: getUserBlock,
    variables: {
      userId: event.arguments.input.followedUserId,
      blockedUserId: event.arguments.input.userId,
    },
  })

  if (blockOfMeByUser?.data?.getUserBlock) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_USER_FOLLOW)
  }

  return null
}

export default checkIfUserNotBlocked
