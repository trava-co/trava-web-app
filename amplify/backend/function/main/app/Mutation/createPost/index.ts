import {
  CreatePostMutationVariables,
  LambdaCustomPrivateCreatePostMutation,
  LambdaCustomPrivateCreatePostMutationVariables,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkTripAccessCreate from './before/checkTripAccessCreate'
import { lambdaCustomPrivateCreatePost } from 'shared-types/graphql/lambda'
import uploadToCloudinaryFromS3 from '../../utils/uploadToCloudinaryFromS3'

const beforeHooks = [checkTripAccessCreate]

async function _privateCreatePost(createPostMutationVariables: LambdaCustomPrivateCreatePostMutationVariables) {
  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaCustomPrivateCreatePostMutationVariables, LambdaCustomPrivateCreatePostMutation>({
      query: lambdaCustomPrivateCreatePost,
      variables: createPostMutationVariables,
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreatePost
}

const createPost: AppSyncResolverHandler<CreatePostMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */

  for (const hook of beforeHooks) {
    console.log(`Running before hook: "${hook.name}"`)
    await hook(event)
  }

  if (event.arguments.input.cloudinaryInput) {
    const { cloudinaryInput } = event.arguments.input
    const post = await _privateCreatePost({
      input: {
        destinationId: event.arguments.input.destinationId,
        description: event.arguments.input.description,
        tripId: event.arguments.input.tripId,
        userId: event.arguments.input.userId,
        attractionId: event.arguments.input.attractionId,
        format: cloudinaryInput.format,
        width: cloudinaryInput.width,
        height: cloudinaryInput.height,
        mediaType: event.arguments.input.mediaType,
        cloudinaryUrl: cloudinaryInput.cloudinaryUrl,
        videoDuration: cloudinaryInput?.videoDuration,
        likesCount: 0,
        commentsCount: 0,
      },
    })

    if (!post) {
      throw new Error('Failed to create post')
    }

    return post.id
  }

  if (!event.arguments.input.bufferItem) {
    throw new Error('BufferItem is missing')
  }

  const uploadResponse = await uploadToCloudinaryFromS3(
    event.arguments.input.bufferItem.bucket,
    `public/${event.arguments.input.bufferItem.key}`,
    event.arguments.input.mediaType,
  )

  const post = await _privateCreatePost({
    input: {
      destinationId: event.arguments.input.destinationId,
      description: event.arguments.input.description,
      tripId: event.arguments.input.tripId,
      userId: event.arguments.input.userId,
      attractionId: event.arguments.input.attractionId,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
      mediaType: event.arguments.input.mediaType,
      cloudinaryUrl: uploadResponse.secure_url,
      videoDuration: uploadResponse?.duration,
      likesCount: 0,
      commentsCount: 0,
    },
  })

  if (!post) {
    throw new Error('Failed to create post')
  }

  return post.id
}

export default createPost
