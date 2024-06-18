import { AppSyncResolverHandler } from 'aws-lambda'
import incrementUserFollows from './incrementUserFollows'
import { CreateUserFollowInput } from 'shared-types/API'

const hooks = [incrementUserFollows]

const createTripAfter: AppSyncResolverHandler<CreateUserFollowInput, any> = async (event, ...args) => {
  // IMPORTANT: THIS IS NOT CONNECTED
  /**
   * Hooks can be run parallel or sequentially
   */
  await Promise.all(
    hooks.map((hook) => {
      console.log(`Running hook: "${hook.name}"`)
      return hook(event, ...args)
    }),
  )

  return event.prev?.result
}

export default createTripAfter
