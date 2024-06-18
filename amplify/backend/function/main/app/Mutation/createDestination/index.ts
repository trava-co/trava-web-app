import {
  CreateDestinationMutationVariables,
  PrivateCreateDestinationMutation,
  PrivateCreateDestinationMutationVariables,
} from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkDestinationAccessCreate from './before/checkDestinationAccessCreate'
import { privateCreateDestination } from 'shared-types/graphql/mutations'
import { CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE } from 'shared-types/lambdaErrors'

const beforeHooks = [checkDestinationAccessCreate]

async function _privateCreateDestination(createDestinationMutationVariables: CreateDestinationMutationVariables) {
  const input = { ...createDestinationMutationVariables.input, label: 'Destination' }
  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateDestinationMutationVariables, PrivateCreateDestinationMutation>({
      query: privateCreateDestination,
      variables: { input },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateDestination
}

const createDestination: AppSyncResolverHandler<CreateDestinationMutationVariables, any> = async (event) => {
  /**
   * before hooks
   */

  for (const hook of beforeHooks) {
    console.log(`Running before hook: "${hook.name}"`)
    await hook(event)
  }

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_CREATE_ATTRACTION_MESSAGE)
  }

  /**
   * Main query
   */
  const createDestinationArguments = {
    input: {
      ...event.arguments.input,
      authorId: event.identity.sub || '',
    },
  }

  const destination = await _privateCreateDestination(createDestinationArguments)

  if (!destination) {
    throw new Error('Failed to create destination')
  }

  return destination
}

export default createDestination
