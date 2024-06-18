import { AppSyncResolverHandler } from 'aws-lambda'
import {
  DeleteAttractionMutationVariables,
  LambdaPrivateUpdateAttractionMutation,
  LambdaPrivateUpdateAttractionMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkAttractionAccessDelete from './before/checkAttractionAccessDelete'
import { lambdaPrivateUpdateAttraction } from 'shared-types/graphql/lambda'

const beforeHooks: any = [checkAttractionAccessDelete]

const deleteAttraction: AppSyncResolverHandler<DeleteAttractionMutationVariables, any> = async (event) => {
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
  // only owner (authorId) or user within group "admin" can soft delete attraction
  await ApiClient.get().apiFetch<LambdaPrivateUpdateAttractionMutationVariables, LambdaPrivateUpdateAttractionMutation>(
    {
      query: lambdaPrivateUpdateAttraction,
      variables: {
        input: {
          id: event.arguments.input.id,
          deletedAt: new Date().toISOString(),
        },
      },
    },
  )
}

export default deleteAttraction
