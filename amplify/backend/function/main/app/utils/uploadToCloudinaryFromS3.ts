import { MEDIA_TYPES } from 'shared-types/API'
import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const uploadToCloudinaryFromS3 = async (bucket: string, key: string, mediaType: MEDIA_TYPES) => {
  const params = {
    Bucket: bucket,
    Key: key,
  }

  const data = await s3.getObject(params).createReadStream()

  const cloudinaryUploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
    const options: UploadApiOptions = {
      folder: 'posts',
      resource_type: 'auto',
      image_metadata: true,
    }

    if (mediaType === MEDIA_TYPES.VIDEO) {
      options.bitrate = '800k'
      options.transformation = [{ width: 973, height: 1920, crop: 'fill' }]
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, response) => {
      if (response) {
        resolve(response)
      } else {
        reject(error)
      }
    })

    data.pipe(uploadStream)
  })

  return await cloudinaryUploadPromise
}

export default uploadToCloudinaryFromS3
