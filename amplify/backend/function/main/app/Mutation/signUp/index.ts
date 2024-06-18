import { AppSyncResolverHandler } from 'aws-lambda'
import { SignUpMutationVariables, SignUpResponse } from 'shared-types/API'
import createCognitoUser from './createCognitoUser'
import createUser from './createUser'
import deleteCognitoUser from './deleteCognitoUser'
import parsePhoneNumber from 'libphonenumber-js'
import { countryToContinentMap } from '../../utils/country-to-continent-map'

const blockedContinents = ['Africa']
const blockedCountryCodes = ['+92', '+93', '+670', '+972'] // Pakistan, Afghanistan, East Timor, Israel

const BLOCKED_NUMBER_ERROR_MESSAGE =
  'Phone number rejected. Try again with a different phone number, or try signing up with email.'

const isBlockedByCountryCode = (phone: string): boolean => {
  return blockedCountryCodes.some((code) => phone.startsWith(code))
}

const isBlockedByContinent = (phone: string): boolean => {
  const parsedPhoneNumber = parsePhoneNumber(phone)
  const possibleCountries = parsedPhoneNumber?.getPossibleCountries()
  const possibleContinents = possibleCountries?.map((country) => countryToContinentMap[country])
  return possibleContinents?.some((continent) => blockedContinents.includes(continent)) || false
}

const signUp: AppSyncResolverHandler<SignUpMutationVariables, SignUpResponse> = async (event, ...args) => {
  if (!event.arguments.input) throw new Error('No input params passed in request')

  // temp fix against bot: block phone number registration in Africa and Asia
  const phone = event.arguments.input.phone
  if (phone) {
    if (phone && (isBlockedByCountryCode(phone) || isBlockedByContinent(phone))) {
      throw new Error(BLOCKED_NUMBER_ERROR_MESSAGE)
    }
  }

  const signUpResponse = await createCognitoUser(event.arguments.input)

  if (!signUpResponse) {
    throw new Error('Cognito user not created')
  }

  try {
    await createUser(signUpResponse.UserSub, event.arguments.input)
  } catch (err) {
    // if create user in dynamo fails - clean up cognito
    await deleteCognitoUser(event.arguments.input)
    throw err
  }

  return {
    __typename: 'SignUpResponse',
    id: signUpResponse.UserSub,
    destination: signUpResponse.CodeDeliveryDetails?.Destination,
  }
}

export default signUp
