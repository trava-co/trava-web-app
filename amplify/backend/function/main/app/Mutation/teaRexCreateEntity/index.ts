import { TeaRexCreateEntityMutationVariables } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'

import tearex from 'tearex'

const teaRexCreateEntity: AppSyncResolverHandler<TeaRexCreateEntityMutationVariables, any> = async (event) => {
  /**
   * Main query
   */

  const entity = await tearex.createEntity({
    id: event.arguments.input.teaRexEntity.id,
    label: event.arguments.input.teaRexEntity.label,
  })

  if (!entity) {
    throw new Error('Failed to create TeaRex entity')
  }

  return true
}

export default teaRexCreateEntity
