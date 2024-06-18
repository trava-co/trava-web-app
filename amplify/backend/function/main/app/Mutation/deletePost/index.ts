import { AppSyncResolverHandler } from 'aws-lambda'
import {
  DeletePostMutationVariables,
  LambdaPrivateUpdatePostMutation,
  LambdaPrivateUpdatePostMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkPostAccessDelete from './before/checkPostAccessDelete'
import { lambdaPrivateUpdatePost } from 'shared-types/graphql/lambda'

const beforeHooks: any = [checkPostAccessDelete]

const deletePost: AppSyncResolverHandler<DeletePostMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */
  for (const hook of beforeHooks) {
    console.log(`Running before hook: "${hook.name}"`)
    await hook(event)
  }

  /**
   * Main query
   */
  // only owner (authorId) or user within group "admin" can soft delete post
  const deletedPost = await ApiClient.get().apiFetch<
    LambdaPrivateUpdatePostMutationVariables,
    LambdaPrivateUpdatePostMutation
  >({
    query: lambdaPrivateUpdatePost,
    variables: {
      input: {
        id: event.arguments.input.id,
        deletedAt: new Date().toISOString(),
      },
    },
  })

  return deletedPost.data?.privateUpdatePost
}

export default deletePost
