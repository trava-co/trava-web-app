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
import {
  CUSTOM_ERROR_USER_DELETE_BY_SELF,
  CUSTOM_GET_USER_DATA_DELETE_BY_SELF,
  CUSTOM_NOT_AUTHORIZED_USER_DELETE_BY_SELF,
} from 'shared-types/lambdaErrors'
import signOutCognitoUser from './signOutCognitoUser'
import { USER_DELETED_STRING } from '../../utils/constants'

const _getUser = async (variables: LambdaGetUserQueryVariables) => {
  const res = await ApiClient.get().apiFetch<LambdaGetUserQueryVariables, LambdaGetUserQuery>({
    query: lambdaGetUser,
    variables,
  })

  return res.data.getUser
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

const privateDeleteUserBySelf: AppSyncResolverHandler<PrivateDeleteUserMutationVariables, any> = async (
  event,
  ...args
) => {
  console.log('privateDeleteUserBySelf')

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_USER_DELETE_BY_SELF)
  }

  if (!(event.identity && 'username' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_USER_DELETE_BY_SELF)
  }

  const sub = event.identity.sub
  const username = event.identity.username

  console.log('delete user sub:', sub)
  console.log('delete user username:', username)

  const user = await _getUser({ id: event.identity.sub })

  if (!user) {
    throw new Error(`${CUSTOM_GET_USER_DATA_DELETE_BY_SELF}: ${JSON.stringify(event.arguments.input)}`)
  }

  /**
   * Main query
   */
  try {
    await _anonymizeUser(user as User)
    await signOutCognitoUser(event.identity.username)
    await deleteCognitoUser(event.identity.username)
  } catch (err) {
    throw new Error(`${CUSTOM_ERROR_USER_DELETE_BY_SELF}: ${event.identity.sub}, ${event.identity.username}, ${err}`)
  }
}

export default privateDeleteUserBySelf
