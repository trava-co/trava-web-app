import {
  DeleteAttractionMutationVariables,
  LambdaGetAttractionQuery,
  LambdaGetAttractionQueryVariables,
} from 'shared-types/API'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { CUSTOM_NOT_AUTHORIZED_DELETE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'
import { checkForGroup } from '../../../utils/checkForGroup'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import { lambdaGetAttraction } from 'shared-types/graphql/lambda'

const checkAttractionAccessDelete = async (event: AppSyncResolverEvent<DeleteAttractionMutationVariables>) => {
  if (checkForGroup(event, 'admin')) return null

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_DELETE_ATTRACTION_MESSAGE)
  }

  const currentAttraction = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaGetAttractionQueryVariables, LambdaGetAttractionQuery>({
      query: lambdaGetAttraction,
      variables: {
        id: event.arguments.input.id,
      },
    })

  // shouldn't happen
  if (!currentAttraction) throw new Error('Attraction not found')
  if (event.identity.sub !== currentAttraction.data?.getAttraction?.authorId) throw new Error('Wrong user')

  return null
}

export default checkAttractionAccessDelete
