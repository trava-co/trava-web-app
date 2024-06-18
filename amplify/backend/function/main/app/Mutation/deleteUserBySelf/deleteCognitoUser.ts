import AWS from 'aws-sdk'

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

async function deleteCognitoUser(username: string): Promise<void> {
  if (!process.env.AUTH_TRAVAF4F82E77_USERPOOLID) {
    throw new Error('Cognito user pool not configured')
  }

  await cognitoIdentityServiceProvider
    .adminDeleteUser({
      UserPoolId: process.env.AUTH_TRAVAF4F82E77_USERPOOLID,
      Username: username,
    })
    .promise()
}

export default deleteCognitoUser