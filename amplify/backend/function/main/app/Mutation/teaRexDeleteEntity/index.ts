import { AppSyncResolverHandler } from 'aws-lambda'

import tearex from 'tearex'
import { TeaRexDeleteEntityMutationVariables } from 'shared-types/API'

const teaRexDeleteEntity: AppSyncResolverHandler<TeaRexDeleteEntityMutationVariables, any> = async (event) => {
  /**
   * Main query
   */

  const entity = await tearex.deleteEntity({
    id: event.arguments.input.teaRexEntity.id,
    label: event.arguments.input.teaRexEntity.label,
  })

  if (!entity) {
    throw new Error('Failed to delete TeaRex entity')
  }

  return true
}

export default teaRexDeleteEntity
