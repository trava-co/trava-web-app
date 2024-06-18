import admin from 'firebase-admin'
import { getSSMVariable } from './utils/getSSMVariable'

export const initializeAdmin = async () => {
  /**
   * GOOGLE_SERVICE_ACCOUNT_KEY was created using:
   * JSON.stringify(<service_key_json>)
   */
  const serviceAccount = JSON.parse(await getSSMVariable('GOOGLE_SERVICE_ACCOUNT_KEY'), (key, value) =>
    key === 'private_key' ? value.replace(/\\n/g, '\n') : value,
  )

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}
