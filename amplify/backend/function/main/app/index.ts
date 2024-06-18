/* Amplify Params - DO NOT EDIT
	API_TRAVA_GRAPHQLAPIENDPOINTOUTPUT
	API_TRAVA_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from './utils/ApiClient/ApiClient'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import minMax from 'dayjs/plugin/minMax'
import { configureCloudinary } from './utils/setupCloudinary'
import { setupTeaRex } from './utils/setupTeaRex'

dayjs.extend(customParseFormat)
dayjs.extend(minMax)

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  // @ts-ignore
  const model = event.model
  // @ts-ignore
  const stage = event.stage

  // use cognito user pool auth if event.identity.sub is present
  event.request.headers.authorization &&
    event.identity &&
    'sub' in event.identity &&
    event.identity.sub &&
    ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)

  await configureCloudinary()
  await setupTeaRex()

  let func
  if (model && stage) {
    // @ts-ignore
    const { default: _func } = await import(`./${model}/${event.fieldName}/${stage}/index.js`) // important (after compilation it's js)
    func = _func
  } else {
    // @ts-ignore
    // @ts-ignore
    const { default: _func } = await import(`./${event.typeName}/${event.fieldName}/index.js`) // important (after compilation it's js)
    func = _func
  }

  try {
    const res = await func(event)
    if (res?.errors?.length) console.log('errors ===', res.errors)
    return res
  } catch (e) {
    console.warn('function error:\n', e)
    throw e
  }
}
