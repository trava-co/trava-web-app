import dbClient from '../../../utils/dbClient'
import getTableName from '../../../utils/getTableName'
import { AppSyncResolverHandler } from 'aws-lambda'
import { CreateUserFollowInput } from 'shared-types/API'

async function _increment(id: string, field: 'followingCount' | 'followersCount') {
  const TableName = getTableName(process.env.API_TRAVA_USERTABLE_NAME)

  await dbClient
    .update({
      TableName,
      Key: {
        id,
      },
      UpdateExpression: `ADD ${field} :inc`,
      ExpressionAttributeValues: { ':inc': { N: '1' } },
    })
    .promise()
}

const incrementUserFollows: AppSyncResolverHandler<CreateUserFollowInput, null> = async (event) => {
  console.log('event', event)

  // TODO check event.prev or handle in type check

  if (!event.prev) {
    // should never happen as this is called as a pipeline resolver
    throw new Error('event.prev is not defined. Check if the resolver is correctly set up.')
  }

  const userId: string = event.prev.result.userId
  const followedUserId: string = event.prev.result.followedUserId

  await _increment(userId, 'followingCount')
  await _increment(followedUserId, 'followersCount')

  return null
}

export default incrementUserFollows
