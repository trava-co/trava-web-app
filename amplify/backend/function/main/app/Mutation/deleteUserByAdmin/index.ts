import { CUSTOM_ERROR_USER_DELETE_BY_ADMIN, CUSTOM_GET_USER_DATA_DELETE_BY_ADMIN } from 'shared-types/lambdaErrors'
import { AppSyncResolverHandler } from 'aws-lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  LambdaGetUserQuery,
  LambdaGetUserQueryVariables,
  LambdaUpdateUserMutation,
  PrivateDeleteUserMutationVariables,
  UpdateUserInput,
  User,
} from 'shared-types/API'
import deleteCognitoUser from './deleteCognitoUser'
import { lambdaGetUser, lambdaUpdateUser } from 'shared-types/graphql/lambda'
import signOutCognitoUser from './signOutCognitoUser'
import { USER_DELETED_STRING } from '../../utils/constants'

const _getUser = async (variables: LambdaGetUserQueryVariables) => {
  const res = await ApiClient.get().apiFetch<LambdaGetUserQueryVariables, LambdaGetUserQuery>({
    query: lambdaGetUser,
    variables,
  })

  return res.data.getUser
}

const _getUserName = (user: User) => {
  if (user.appleId) return `signinwithapple_${user.username}`
  if (user.facebookId) return `facebook_${user.username}`
  if (user.googleId) return `google_${user.username}`
  else return user.username || ''
}

const _anonymizeUser = async (variables: User) => {
  const {
    id,
    avatar,
    email,
    phone,
    privacy,
    dateOfBirth,
    facebookId,
    googleId,
    appleId,
    description,
    location,
    ...rest
  } = variables

  return await ApiClient.get().apiFetch<{ input: UpdateUserInput }, LambdaUpdateUserMutation>({
    query: lambdaUpdateUser,
    variables: {
      input: {
        appleId: '',
        avatar: null,
        dateOfBirth: '2000-01-01',
        description: USER_DELETED_STRING,
        email: USER_DELETED_STRING,
        facebookId: '',
        googleId: '',
        id,
        location: USER_DELETED_STRING,
        name: USER_DELETED_STRING,
        phone,
        privacy,
        username: USER_DELETED_STRING,
      },
    },
  })
}

const privateDeleteUserByAdmin: AppSyncResolverHandler<PrivateDeleteUserMutationVariables, any> = async (
  event,
  ...args
) => {
  console.log('privateDeleteUserByAdmin')

  const user = await _getUser(event.arguments.input)

  if (!user) {
    throw new Error(`${CUSTOM_GET_USER_DATA_DELETE_BY_ADMIN}: ${JSON.stringify(event.arguments.input)}`)
  }

  const username = _getUserName(user as User)
  console.log('delete user username:', username)

  /**
   * Main query
   */
  try {
    await _anonymizeUser(user as User)
    await signOutCognitoUser(username)
    await deleteCognitoUser(username)
  } catch (err) {
    throw new Error(`${CUSTOM_ERROR_USER_DELETE_BY_ADMIN}: ${err}`)
  }

  return user
}

export default privateDeleteUserByAdmin
