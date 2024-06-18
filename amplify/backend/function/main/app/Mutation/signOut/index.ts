import { SignOutMutation, SignOutMutationVariables, UpdateUserTripMutationVariables } from 'shared-types/API'
import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { NOT_AUTHORIZED_REMOVE_FCM_TOKEN } from 'shared-types/lambdaErrors'
import { lambdaUpdateUser } from 'shared-types/graphql/lambda'

const signOut: AppSyncResolverHandler<UpdateUserTripMutationVariables, any> = async (event) => {
  console.log('signOut')

  /**
   * Main query
   */

  if (event.identity && 'sub' in event.identity) {
    try {
      await ApiClient.get().apiFetch<SignOutMutationVariables, SignOutMutation>({
        query: lambdaUpdateUser,
        variables: { input: { id: event.identity.sub, fcmToken: null } },
      })
    } catch (err) {
      console.error(err)
    }
  } else throw new Error(NOT_AUTHORIZED_REMOVE_FCM_TOKEN)
}

export default signOut
