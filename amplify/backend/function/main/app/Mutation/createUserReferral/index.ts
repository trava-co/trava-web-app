import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateUserReferralMutationVariables,
  GetUserQueryVariables,
  LambdaGetUserQuery,
  LambdaGetUserQueryVariables,
  LambdaPrivateCreateUserReferralMutation,
  LambdaPrivateCreateUserReferralMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import createNotification from './after/createNotification'
import { lambdaGetUser, lambdaPrivateCreateUserReferral } from 'shared-types/graphql/lambda'

const afterHooks = [createNotification]

async function _getUser(variables: GetUserQueryVariables) {
  const res = await ApiClient.get().apiFetch<LambdaGetUserQueryVariables, LambdaGetUserQuery>({
    query: lambdaGetUser,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.getUser
}

async function _privateCreateUserReferral(variables: CreateUserReferralMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateCreateUserReferralMutationVariables,
    LambdaPrivateCreateUserReferralMutation
  >({
    query: lambdaPrivateCreateUserReferral,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateUserReferral
}

const createUserReferral: AppSyncResolverHandler<CreateUserReferralMutationVariables, any> = async (event, ...args) => {
  /**
   * before hooks
   */

  /**
   * Main query
   */

  const referringUser = await _getUser({
    id: event.arguments.input.userId,
  })

  if (!referringUser) {
    throw new Error('Failed to create user referral: referring user not found')
  }

  const userReferral = await _privateCreateUserReferral({
    input: event.arguments.input,
  })

  if (!userReferral) {
    throw new Error('Failed to create userReferral')
  }

  /**
   * after hooks
   */
  await Promise.all(
    afterHooks.map((hook) => {
      console.log(`Running after hook: "${hook.name}"`)
      return hook(event, userReferral)
    }),
  )

  return userReferral
}

export default createUserReferral
