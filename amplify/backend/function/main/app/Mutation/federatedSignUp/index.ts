import { FederatedSignUpMutationVariables, FederatedSignUpResponse } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import createUser from './createUser'

const federatedSignUp: AppSyncResolverHandler<FederatedSignUpMutationVariables, FederatedSignUpResponse> = async (
  event,
  ...args
) => {
  console.log('federatedSignUp')

  if (!event.arguments.input) throw new Error('No input params passed in request')

  try {
    await createUser(event.arguments.input)
  } catch (err) {
    throw err
  }

  return {
    __typename: 'FederatedSignUpResponse',
    id: event.arguments.input.sub,
  }
}

export default federatedSignUp
