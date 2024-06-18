import { UploadToCloudinaryMutationVariables } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import uploadToCloudinaryFromS3 from '../../utils/uploadToCloudinaryFromS3'

const s3 = new AWS.S3()

const uploadToCloudinary: AppSyncResolverHandler<UploadToCloudinaryMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */

  // NONE

  const uploadResponse = await uploadToCloudinaryFromS3(
    event.arguments.input.bufferItem.bucket,
    `public/${event.arguments.input.bufferItem.key}`,
    event.arguments.input.mediaType,
  )

  if (!uploadResponse) {
    throw new Error('Failed to create post')
  }

  return {
    cloudinaryUrl: uploadResponse.secure_url,
    videoDuration: uploadResponse?.duration,
    width: uploadResponse.width,
    height: uploadResponse.height,
    format: uploadResponse.format,
  }
}

export default uploadToCloudinary
