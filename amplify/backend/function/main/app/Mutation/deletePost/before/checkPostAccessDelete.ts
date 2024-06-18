import {
  DeletePostMutationVariables,
  LambdaPrivateGetPostQuery,
  LambdaPrivateGetPostQueryVariables,
} from 'shared-types/API'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { CUSTOM_NOT_AUTHORIZED_DELETE_POST_MESSAGE } from 'shared-types/lambdaErrors'
import { checkForGroup } from '../../../utils/checkForGroup'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaPrivateGetPost } from 'shared-types/graphql/lambda'

const checkPostAccessDelete = async (event: AppSyncResolverEvent<DeletePostMutationVariables>) => {
  if (checkForGroup(event, 'admin')) return null

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_POST_MESSAGE)
  }

  const currentPost = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateGetPostQueryVariables, LambdaPrivateGetPostQuery>({
      query: lambdaPrivateGetPost,
      variables: {
        id: event.arguments.input.id,
      },
    })

  // shouldn't happen
  if (!currentPost) throw new Error('Post not found')
  if (event.identity.sub !== currentPost.data?.privateGetPost?.userId) throw new Error('Wrong user')

  return null
}

export default checkPostAccessDelete
