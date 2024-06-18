import { AppSyncResolverHandler } from 'aws-lambda'
import chunk from 'lodash.chunk'
import {
  DeleteUserTripMutationVariables,
  LambdaPrivateDeleteAttractionSwipeMutation,
  LambdaPrivateDeleteAttractionSwipeMutationVariables,
} from 'shared-types/API'
import { lambdaPrivateDeleteAttractionSwipe } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getUserAttractionSwipes from '../../../utils/getUserAttractionSwipes'

const CHUNK_SIZE = 10

const deleteAttractionSwipes: AppSyncResolverHandler<DeleteUserTripMutationVariables, null> = async (event) => {
  const { tripId, userId } = event.arguments.input

  const attractionSwipesToRemove = await getUserAttractionSwipes({ tripId, userId })

  const promises = attractionSwipesToRemove?.map((attractionId) => {
    return ApiClient.get().apiFetch<
      LambdaPrivateDeleteAttractionSwipeMutationVariables,
      LambdaPrivateDeleteAttractionSwipeMutation
    >({
      query: lambdaPrivateDeleteAttractionSwipe,
      variables: {
        input: {
          attractionId,
          tripId,
          userId,
        },
      },
    })
  })

  const chunks = chunk(promises, CHUNK_SIZE)

  for (const chunkOfPromises of chunks) {
    await Promise.all(chunkOfPromises)
  }

  return null
}

export default deleteAttractionSwipes
