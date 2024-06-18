import ApiClient from './ApiClient'
import {
  LambdaPrivateUpdateAttractionMutationVariables,
  LambdaPrivateUpdateAttractionMutation,
  Status,
  GenerationStep,
  UpdateAttractionInput,
} from 'shared-types/API'
import { lambdaPrivateUpdateAttraction } from 'shared-types/graphql/lambda'
import { sendSlackNotification } from './sendSlackNotification'
import { getSSMVariable } from './getSSMVariable'

export async function updateAttraction(
  updateAttractionMutationVariables: LambdaPrivateUpdateAttractionMutationVariables,
) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateUpdateAttractionMutationVariables,
    LambdaPrivateUpdateAttractionMutation
  >({
    query: lambdaPrivateUpdateAttraction,
    variables: {
      input: updateAttractionMutationVariables.input,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateAttraction
}

export interface IUpdateAttractionWithFailure {
  attractionId: string
  failureCount: number
  step: GenerationStep
  errorMessage: string
}

export async function updateAttractionWithFailure({
  attractionId,
  failureCount,
  step,
  errorMessage,
}: IUpdateAttractionWithFailure) {
  console.error(`Error in step ${step} for attraction ${attractionId}: ${errorMessage}`)

  // if env is staging or prod, send slack notification
  if (process.env.ENV === 'prod' || process.env.ENV === 'staging') {
    const SLACK_WEBHOOK_URL = await getSSMVariable('SLACK_WEBHOOK_URL')
    await sendSlackNotification(
      SLACK_WEBHOOK_URL,
      `${process.env.ENV} backend environment:\nGeneration step ${step} failed for attraction ${attractionId}. \nError: ${errorMessage}`,
    ).catch((error) => {
      console.error('Error sending slack notification:', error)
    })
  }

  const updateAttractionInput: UpdateAttractionInput = {
    id: attractionId,
    generation: {
      step,
      status: Status.FAILED,
      failureCount: failureCount + 1,
      lastUpdatedAt: new Date().toISOString(),
      lastFailureReason: errorMessage,
    },
    descriptionLong: "This is taking longer than usual. We're working on it!",
    descriptionShort: 'Still generating description and details...',
  }

  await updateAttraction({ input: updateAttractionInput })

  console.log(`Attraction ${attractionId} status updated to FAILED`)
}
