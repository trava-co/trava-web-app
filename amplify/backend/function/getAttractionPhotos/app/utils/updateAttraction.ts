import {
  UpdateAttractionInput,
  GenerationStep,
  Status,
  LambdaPrivateUpdateAttractionMutationVariables,
  LambdaPrivateUpdateAttractionMutation,
} from 'shared-types/API'
import { getTableName } from './getTableName'
import { dbClient } from './dbClient'
import { sendSlackNotification } from './sendSlackNotification'
import { getAttractionFailureCount } from './getAttraction'
import ApiClient from './ApiClient'
import { lambdaPrivateUpdateAttraction } from 'shared-types/graphql/lambda'
import { getSSMVariable } from './getSSMVariable'

const attractionTable = getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME)

const tenMinutesAgoDateTimeISO = new Date(new Date().getTime() - 10 * 60 * 1000).toISOString() // Time 10 minutes ago in ISO format

export async function updateAttractionStatusToInProgress({ attractionId }: { attractionId: string }) {
  const params = {
    TableName: attractionTable,
    Key: { id: attractionId },
    ConditionExpression:
      '(#generation.#step = :getPhotos and #generation.#statusAttr = :pending) or (#generation.#step = :getPhotos and #generation.#statusAttr = :inProgress and #generation.#lastUpdatedAt < :tenMinutesAgoDateTimeISO)',
    UpdateExpression: 'set #generation.#statusAttr = :inProgress, #generation.#lastUpdatedAt = :now',
    ExpressionAttributeValues: {
      ':getPhotos': GenerationStep.GET_PHOTOS,
      ':pending': Status.PENDING,
      ':inProgress': Status.IN_PROGRESS,
      ':now': new Date().toISOString(),
      ':tenMinutesAgoDateTimeISO': tenMinutesAgoDateTimeISO,
    },
    ExpressionAttributeNames: {
      '#generation': 'generation',
      '#step': 'step',
      '#statusAttr': 'status', // status is a reserved word
      '#lastUpdatedAt': 'lastUpdatedAt',
    },
    ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
  }

  await dbClient.update(params).promise()
  console.log(`Attraction ${attractionId} status updated to IN_PROGRESS`)
}

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
  failureCount?: number
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

  if (failureCount === undefined) {
    // should never happen, but just in case
    // get the attraction
    failureCount = await getAttractionFailureCount({ attractionId })
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
