import { AppSyncResolverHandler } from 'aws-lambda'
import {
  LambdaPrivateUpdateUserMutation,
  LambdaPrivateUpdateUserMutationVariables,
  SettingsSendReportMutationVariables,
  SettingsSendReportResponse,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { lambdaPrivateUpdateUser } from 'shared-types/graphql/lambda'

const aws = require('aws-sdk')
const ses = new aws.SES({ region: process.env.REGION })

async function _privateUpdateUser(variables: LambdaPrivateUpdateUserMutationVariables) {
  const res = await ApiClient.get().apiFetch<LambdaPrivateUpdateUserMutationVariables, LambdaPrivateUpdateUserMutation>(
    {
      query: lambdaPrivateUpdateUser,
      variables,
    },
  )

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateUser
}

const settingsSendReport: AppSyncResolverHandler<
  SettingsSendReportMutationVariables,
  SettingsSendReportResponse
> = async (event) => {
  if (!(event.identity && 'sub' in event.identity)) throw new Error('Not authorized')
  if (!event.arguments.input) throw new Error('No input params passed in request')

  const supportEmailSource = 'support@hellotrava.com'
  const supportEmailDestination = ['support@hellotrava.com', 'marcin.bojar@teacode.io', 'olivier.purak@teacode.io']

  const { message, userEmail, userContactEmail } = event.arguments.input

  // maintaining backwards compatibility
  const userContactEmailToUse = userContactEmail || userEmail

  const text = `Report environment: ${process.env.ENV}\nReporter's userId: ${
    event.identity.sub
  }\nReport message: ${message}${
    userContactEmailToUse ? `\n\nRespond to this email to contact the reporter: ${userContactEmailToUse}` : ''
  }`

  const params = {
    Destination: {
      ToAddresses: supportEmailDestination,
    },
    Message: {
      Body: {
        Text: { Data: text },
      },
      Subject: { Data: 'Trava Report an issue' },
    },
    Source: supportEmailSource,
  }

  const sendEmailPromise = ses.sendEmail(params).promise()

  // update user contactEmail if provided. don't want to persist old userEmail field here, as that might be an apple hidden email, which we can't respond to
  let updateUserPromise
  if (userContactEmail) {
    updateUserPromise = _privateUpdateUser({
      input: {
        id: event.identity.sub,
        contactEmail: userContactEmail,
      },
    }).catch((error) => {
      console.log('Failed to update user contactEmail', error)
    })
  }

  const [sendEmail] = await Promise.all([sendEmailPromise, updateUserPromise])

  if (!sendEmail) {
    throw new Error('Failed to send report')
  }

  return {
    messageId: sendEmail.MessageId,
    __typename: 'SettingsSendReportResponse',
  }
}

export default settingsSendReport
