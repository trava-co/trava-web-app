import { CreateUserInput, CreateUserMutationVariables, PRIVACY, FederatedSignUpInput } from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'

export const createUserMutation = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!, $condition: ModelUserConditionInput) {
    createUser(input: $input, condition: $condition) {
      id
    }
  }
`

export type CreateUserMutation = {
  createUser?: {
    __typename: 'User'
    id: string
  } | null
}

async function create(user: CreateUserInput) {
  console.log('create user', user)

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<CreateUserMutationVariables, CreateUserMutation>({
      query: createUserMutation,
      variables: {
        input: user,
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.createUser
}

function getPrivacy(privacy: string): PRIVACY {
  if (privacy === PRIVACY.PRIVATE) return PRIVACY.PRIVATE
  return PRIVACY.PUBLIC
}

async function createUser(data: FederatedSignUpInput) {
  const input = {
    id: data.sub,
    appleId: data.appleId,
    googleId: data.googleId,
    facebookId: data.facebookId,
    email: data.email,
    phone: data.phone,
    username: data.username,
    dateOfBirth: data.dateOfBirth,
    name: data.name,
    privacy: getPrivacy(data.privacy),
    pushNotifications: true,
  }

  await create(input)
}

export default createUser
