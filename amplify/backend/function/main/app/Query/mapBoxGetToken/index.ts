import { AppSyncResolverHandler } from 'aws-lambda'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { MapboxGetTokenResult } from 'shared-types/API'

const mapBoxGetToken: AppSyncResolverHandler<any, MapboxGetTokenResult> = async (event) => {
  console.log('mapBoxGetToken')

  /**
   * Main query
   */

  const token = await getSSMVariable('MAPBOX_TOKEN')

  if (!token) {
    throw new Error('no token found in SSM')
  }

  return { __typename: 'MapboxGetTokenResult', token }
}

export default mapBoxGetToken
