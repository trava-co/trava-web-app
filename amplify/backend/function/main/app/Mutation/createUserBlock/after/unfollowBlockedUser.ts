import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { CreateUserBlockMutationVariables, UserBlock } from 'shared-types/API'
import getUserFollow from '../../../utils/getUserFollow'
import deleteUserFollow from '../../../utils/deleteUserFollow'

const unfollowBlockedUser = async (
  event: AppSyncResolverEvent<CreateUserBlockMutationVariables>,
  userBlock: UserBlock,
) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    return null
  }

  const userFollow = await getUserFollow({
    userId: event.identity.sub,
    followedUserId: userBlock.blockedUserId,
  })

  if (!userFollow) return null

  await deleteUserFollow({
    input: {
      userId: event.identity.sub,
      followedUserId: userBlock.blockedUserId,
    },
  })

  return null
}

export default unfollowBlockedUser
