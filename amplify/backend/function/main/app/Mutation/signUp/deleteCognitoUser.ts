import AWS from 'aws-sdk'
import { SignUpInput } from 'shared-types/API'

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

async function deleteCognitoUser(data: SignUpInput): Promise<void> {
  if (!process.env.AUTH_TRAVAF4F82E77_USERPOOLID) {
    throw new Error('Cognito user pool not configured')
  }

  await cognitoIdentityServiceProvider
    .adminDeleteUser({
      UserPoolId: process.env.AUTH_TRAVAF4F82E77_USERPOOLID,
      Username: data.username,
    })
    .promise()
}

export default deleteCognitoUser
