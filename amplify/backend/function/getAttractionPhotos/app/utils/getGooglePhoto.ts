import { Client as GoogleClient } from '@googlemaps/google-maps-services-js'
import { PlacePhotoInput, S3ObjectInput } from 'shared-types/API'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { dbClient } from './dbClient'
import { S3 } from 'aws-sdk'
import { PassThrough } from 'stream'
import { getTableName } from './getTableName'
// @ts-ignore
import { load } from 'cheerio'
import * as Yup from 'yup'

const google = new GoogleClient({})
const s3 = new S3()

interface IGetGooglePhoto extends PlacePhotoInput {
  destinationId: string
  attractionId: string
  order: number
  GOOGLE_MAPS_KEY: string
  STORAGE_BUCKETNAME: string
}

export async function getGooglePhoto({
  photo_reference,
  html_attributions,
  destinationId,
  attractionId,
  order,
  GOOGLE_MAPS_KEY,
  STORAGE_BUCKETNAME,
}: IGetGooglePhoto) {
  const googlePhoto = await google.placePhoto({
    params: {
      photoreference: photo_reference as string,
      maxheight: 1060,
      maxwidth: 1500,
      key: GOOGLE_MAPS_KEY,
    },
    responseType: 'arraybuffer',
  })

  let authorName = 'Anonymous'
  let authorUrl = ''

  if (html_attributions?.[0]) {
    console.log(`html_attributions: ${JSON.stringify(html_attributions, null, 2)}`)
    const $ = load(html_attributions[0])
    const anchor = $('a')

    if (anchor.length) {
      authorName = anchor.text()
      authorUrl = anchor.attr('href') || ''
    }
  }

  console.log(`authorName: ${authorName}, authorUrl: ${authorUrl}`)

  // query Photographers collection's name index to see if the photographer already exists
  console.log(`checking if photographer ${authorName} exists in the db`)
  const photographerTableName = getTableName(process.env.API_TRAVA_PHOTOGRAPHERTABLE_NAME)
  const params = {
    TableName: photographerTableName,
    IndexName: 'byPhotographerName',
    KeyConditionExpression: '#name = :name',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': authorName,
    },
  }

  const { Items: photographerData } = await dbClient.query(params).promise()

  // get first result
  const existingPhotographer = photographerData?.[0]

  let photographerId = uuidv4() // this will be used in the key of the photo object

  if (existingPhotographer) {
    console.log(`existingPhotographer exists`)
    photographerId = existingPhotographer.id
  } else {
    console.log(`photographer does not exist. creating entry for ${photographerId}, ${authorName}`)
    // if the photographer doesn't exist, add them to the db
    await createPhotographerInDb(photographerId, authorName, authorUrl)
  }

  // Use sharp to resize the image while maintaining the aspect ratio
  let img = sharp(googlePhoto.data)
  const metadata = await img.metadata()
  const imageFormat = metadata.format // This should give you 'jpeg', 'png', etc.

  const key = `attractions/coverImages/${destinationId}/${attractionId}/order=${order}_photographer=${photographerId}.${imageFormat}`

  console.log(`key: ${key}`)

  // Create a pass-through stream
  const pass = new PassThrough()

  if (metadata.width && metadata.height) {
    // Image has valid dimensions, resize it
    console.log(`image has valid dimensions: ${metadata.width} x ${metadata.height}`)

    const aspectRatio = 1.415 // target aspect ratio
    let resizeWidth: number, resizeHeight: number

    if (metadata.width / metadata.height > aspectRatio) {
      // original image is wider than target aspect ratio
      resizeHeight = Math.min(1060, metadata.height)
      resizeWidth = Math.round(resizeHeight * aspectRatio)
    } else {
      // original image is taller than target aspect ratio
      resizeWidth = Math.min(1500, metadata.width)
      resizeHeight = Math.round(resizeWidth / aspectRatio)
    }

    img.resize(resizeWidth, resizeHeight).pipe(pass)
  } else {
    // Image dimensions are not valid, upload the original image
    sharp(googlePhoto.data).pipe(pass)
  }

  // Setting up S3 upload parameters
  const uploadParams = {
    Bucket: STORAGE_BUCKETNAME,
    Key: `public/${key}`,
    Body: pass,
  }

  // log bucket and key, but not the body
  console.log(`uploadParams: ${JSON.stringify({ Bucket: uploadParams.Bucket, Key: uploadParams.Key })}`)
  console.log('about to upload to S3')

  // Upload to S3
  await s3.upload(uploadParams).promise()

  console.log(`uploaded to S3 successfully`)

  // Construct the S3Object to return
  const s3Object: S3ObjectInput = {
    bucket: STORAGE_BUCKETNAME,
    region: s3.config.region ?? 'us-east-1',
    key,
  }

  return s3Object
}

async function createPhotographerInDb(photographerId: string, authorName: string, authorUrl: string) {
  const input = {
    id: photographerId,
    name: authorName,
    url: authorUrl,
  }

  // use yup to validate input
  const PhotographerSchema = Yup.object({
    id: Yup.string().required('photographer id is required'),
    name: Yup.string().required('photographer name is required'),
    url: Yup.string().optional(),
  })

  try {
    await PhotographerSchema.validate(input, { abortEarly: false })
  } catch (error) {
    console.error(`Create photographer input does not conform to schema: ${error}`)
    throw new Error(`Create photographer input does not conform to schema: ${error}`)
  }

  const params = {
    TableName: getTableName(process.env.API_TRAVA_PHOTOGRAPHERTABLE_NAME),
    Item: input,
  }

  try {
    await dbClient.put(params).promise()
  } catch (error) {
    console.error(`Error creating photographer: ${error}`)
    throw new Error(`Error creating photographer: ${error}`)
  }

  return params.Item
}
