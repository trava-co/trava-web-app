import { AdminUpdateAttractionMutationVariables } from 'shared-types/API'
import { CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'
import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import { checkForGroup } from '../../../utils/checkForGroup'

const checkAttractionAccessUpdate = async (event: AppSyncResolverEvent<AdminUpdateAttractionMutationVariables>) => {
  if (checkForGroup(event, 'admin')) return null
  else {
    throw new Error(CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE)
  }
}

export default checkAttractionAccessUpdate
