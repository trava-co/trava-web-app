import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { CreateUserBlockMutationVariables, UserBlock } from 'shared-types/API'
import getUserFollow from '../../../utils/getUserFollow'
import deleteUserFollow from '../../../utils/deleteUserFollow'

const removeFollowFromBlockedUser = async (
  event: AppSyncResolverEvent<CreateUserBlockMutationVariables>,
  userBlock: UserBlock,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  const userFollow = await getUserFollow({
    userId: userBlock.blockedUserId,
    followedUserId: event.identity.sub,
  })

  if (!userFollow) return null

  await deleteUserFollow({
    input: {
      userId: userBlock.blockedUserId,
      followedUserId: event.identity.sub,
    },
  })

  return null
}

export default removeFollowFromBlockedUser
