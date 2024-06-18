import AWS from 'aws-sdk'
import { AttributeListType, SignUpResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { SignUpInput } from 'shared-types/API'

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

function getUserAttributes(data: SignUpInput) {
  const userAttributes: AttributeListType = []

  if (data.email) {
    userAttributes.push({
      Name: 'email',
      Value: data.email,
    })
  }

  if (data.phone) {
    userAttributes.push({
      Name: 'phone_number',
      Value: data.phone,
    })
  }

  return userAttributes
}

async function getClientId(): Promise<string> {
  if (!process.env.AUTH_TRAVAF4F82E77_USERPOOLID) {
    throw new Error('Cognito user pool not configured')
  }

  const userPoolClients = await cognitoIdentityServiceProvider
    .listUserPoolClients({
      UserPoolId: process.env.AUTH_TRAVAF4F82E77_USERPOOLID,
    })
    .promise()

  if (!userPoolClients.UserPoolClients?.length) {
    throw new Error('No AppSync client found.')
  }

  if (!userPoolClients.UserPoolClients[0].ClientId) {
    throw new Error('No AppSync client found.')
  }

  return userPoolClients.UserPoolClients[0].ClientId
}

async function createCognitoUser(data: SignUpInput): Promise<SignUpResponse> {
  const res = await cognitoIdentityServiceProvider
    .signUp({
      ClientId: await getClientId(),
      Password: data.password,
      Username: data.username,
      UserAttributes: getUserAttributes(data),
    })
    .promise()

  return res
}

export default createCognitoUser
