import { AppSyncResolverHandler } from 'aws-lambda'
import chunk from 'lodash.chunk'
import {
  AttractionSwipe,
  DeleteTripDestinationMutationVariables,
  LambdaPrivateDeleteAttractionSwipeMutation,
  LambdaPrivateDeleteAttractionSwipeMutationVariables,
} from 'shared-types/API'
import { lambdaPrivateDeleteAttractionSwipe } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import getTripDestinationAttractionSwipes from '../../../utils/getTripDestinationAttractionSwipes'

const CHUNK_SIZE = 10

const deleteAttractionSwipes: AppSyncResolverHandler<DeleteTripDestinationMutationVariables, null> = async (event) => {
  const { tripId, destinationId } = event.arguments.input

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!event.identity || !('sub' in event.identity)) {
    throw new Error('should not happen')
  }

  // used only to get to the swipes the current userTrip has access to
  const userId = event.identity.sub

  const attractionSwipesToRemove = await getTripDestinationAttractionSwipes({ tripId, userId, destinationId })

  const deleteAttractionSwipeInputs = attractionSwipesToRemove
    ?.filter((attractionSwipe): attractionSwipe is AttractionSwipe => !!attractionSwipe)
    .map((attractionSwipe) => ({
      attractionId: attractionSwipe.attractionId,
      tripId,
      userId: attractionSwipe.userId,
    }))

  const promises = deleteAttractionSwipeInputs?.map((input) => {
    return ApiClient.get().apiFetch<
      LambdaPrivateDeleteAttractionSwipeMutationVariables,
      LambdaPrivateDeleteAttractionSwipeMutation
    >({
      query: lambdaPrivateDeleteAttractionSwipe,
      variables: {
        input,
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
