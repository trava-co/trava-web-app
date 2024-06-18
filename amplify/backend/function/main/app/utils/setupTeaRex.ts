import { getSSMVariable } from './getSSMVariable'

import tearex from 'tearex'

let isTeaRexConfigured = false

export const setupTeaRex = async () => {
  if (isTeaRexConfigured) {
    return
  }

  const TEAREX_URL = await getSSMVariable('TEAREX_URL')
  const TEAREX_API_KEY = await getSSMVariable('TEAREX_API_KEY')

  tearex.init({
    apiKey: TEAREX_API_KEY,
    url: TEAREX_URL,
    stage: process.env.ENV,
  })

  isTeaRexConfigured = true
}
