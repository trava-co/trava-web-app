import { AppSyncResolverHandler } from 'aws-lambda'
import { UpdateUserFollowInput, UpdateUserFollowMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_USER_FOLLOW } from 'shared-types/lambdaErrors'

const attributesAllowedToUpdate: (keyof UpdateUserFollowInput)[] = ['followedUserId', 'userId', 'approved']

const checkIfUserIsAllowedToUpdateUserFollow: AppSyncResolverHandler<UpdateUserFollowMutationVariables, null> = async (
  event,
  context,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_USER_FOLLOW)
  }

  // a user can approve or decline only a request to them
  if (event.identity.sub !== event.arguments.input.followedUserId) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_USER_FOLLOW)
  }

  if (
    !Object.keys(event.arguments.input).every((key) =>
      attributesAllowedToUpdate.includes(key as keyof UpdateUserFollowInput),
    )
  ) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_USER_FOLLOW)
  }

  return null
}

export default checkIfUserIsAllowedToUpdateUserFollow
