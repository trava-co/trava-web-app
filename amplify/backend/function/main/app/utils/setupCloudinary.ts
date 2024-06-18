import { getSSMVariable } from './getSSMVariable'
import cloudinary from 'cloudinary'

let isCloudinaryConfigured = false

export const configureCloudinary = async () => {
  if (isCloudinaryConfigured) {
    return
  }

  const cloudinaryCloudName = await getSSMVariable('CLOUDINARY_CLOUD_NAME')
  const cloudinaryApiKey = await getSSMVariable('CLOUDINARY_API_KEY')
  const cloudinaryApiSecret = await getSSMVariable('CLOUDINARY_API_SECRET')

  cloudinary.v2.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
  })

  isCloudinaryConfigured = true
}
