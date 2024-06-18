import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper'

export function override(resources: AmplifyAuthCognitoStackTemplate) {
  // use only for new environments (created on Amplify 7+)
  // resources.userPool.schema = [{
  //   name: 'email', required: false, mutable: true
  // }]

  // use only for existing environments (created on Amplify <7)
  resources.userPool.schema = []

  resources.userPoolClient.readAttributes = [
    'address',
    'birthdate',
    'email',
    'family_name',
    'middle_name',
    'gender',
    'locale',
    'given_name',
    'name',
    'nickname',
    'phone_number',
    'preferred_username',
    'picture',
    'profile',
    'updated_at',
    'website',
    'zoneinfo',
    'email_verified',
    'phone_number_verified',
  ]
  resources.userPoolClient.writeAttributes = [
    'address',
    'birthdate',
    'middle_name',
    'gender',
    'locale',
    'name',
    'nickname',
    'preferred_username',
    'picture',
    'profile',
    'updated_at',
    'website',
    'zoneinfo',
    'email',
    'family_name',
    'given_name',
    'phone_number',
  ]
  resources.userPoolClientWeb.readAttributes = [
    'address',
    'birthdate',
    'email',
    'family_name',
    'middle_name',
    'gender',
    'locale',
    'given_name',
    'name',
    'nickname',
    'phone_number',
    'preferred_username',
    'picture',
    'profile',
    'updated_at',
    'website',
    'zoneinfo',
    'email_verified',
    'phone_number_verified',
  ]
  resources.userPoolClientWeb.writeAttributes = [
    'address',
    'birthdate',
    'middle_name',
    'gender',
    'locale',
    'name',
    'nickname',
    'preferred_username',
    'picture',
    'profile',
    'updated_at',
    'website',
    'zoneinfo',
    'email',
    'family_name',
    'given_name',
    'phone_number',
  ]

  resources.userPoolClient.tokenValidityUnits = {
    accessToken: 'hours',
    idToken: 'hours',
    refreshToken: 'days',
  }

  resources.userPoolClient.refreshTokenValidity = 365 * 5 // 5 years
  // set access token validity and id token validity to 1 day
  resources.userPoolClient.accessTokenValidity = 24
  resources.userPoolClient.idTokenValidity = 24
}
