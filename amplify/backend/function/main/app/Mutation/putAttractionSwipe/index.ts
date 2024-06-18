import { AppSyncResolverHandler } from 'aws-lambda'
import {
  PutAttractionSwipeMutationVariables,
  PrivateCreateAttractionSwipeMutation,
  PrivateCreateAttractionSwipeMutationVariables,
  PrivateUpdateAttractionSwipeMutation,
  PrivateUpdateAttractionSwipeMutationVariables,
  LambdaPrivateGetAttractionSwipeQuery,
  LambdaPrivateGetAttractionSwipeQueryVariables,
  AttractionSwipeLabel,
} from 'shared-types/API'
import { privateCreateAttractionSwipe, privateUpdateAttractionSwipe } from 'shared-types/graphql/mutations'
import { lambdaPrivateGetAttractionSwipe } from 'shared-types/graphql/lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import checkIfUserTripAndTripDestinationExists from './before/checkIfUserTripAndTripDestinationExists'

const beforeHooks = [checkIfUserTripAndTripDestinationExists]

async function _privateGetAttractionSwipe(variables: LambdaPrivateGetAttractionSwipeQueryVariables) {
  const res = await ApiClient.get().apiFetch<
    LambdaPrivateGetAttractionSwipeQueryVariables,
    LambdaPrivateGetAttractionSwipeQuery
  >({
    query: lambdaPrivateGetAttractionSwipe,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateGetAttractionSwipe
}

async function _privateUpdateAttractionSwipe(variables: PrivateUpdateAttractionSwipeMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    PrivateUpdateAttractionSwipeMutationVariables,
    PrivateUpdateAttractionSwipeMutation
  >({
    query: privateUpdateAttractionSwipe,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateUpdateAttractionSwipe
}

async function _privateCreateAttractionSwipe(variables: PrivateCreateAttractionSwipeMutationVariables) {
  const res = await ApiClient.get().apiFetch<
    PrivateCreateAttractionSwipeMutationVariables,
    PrivateCreateAttractionSwipeMutation
  >({
    query: privateCreateAttractionSwipe,
    variables,
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateAttractionSwipe
}

const putAttractionSwipe: AppSyncResolverHandler<PutAttractionSwipeMutationVariables, any> = async (event, ...args) => {
  console.log('putAttractionSwipe')
  /**
   * before hooks
   */
  await Promise.all(
    beforeHooks.map((hook) => {
      console.log(`Running before hook: "${hook.name}"`)
      return hook(event, ...args)
    }),
  )

  /**
   * Main query
   */

  const { userId, tripId, attractionId } = event.arguments.input

  // check if attractionSwipe already exists
  const existingAttractionSwipe = await _privateGetAttractionSwipe({ userId, tripId, attractionId })

  if (existingAttractionSwipe) {
    // update existing attractionSwipe
    const updatedAttractionSwipe = await _privateUpdateAttractionSwipe(event.arguments)

    if (!updatedAttractionSwipe) {
      throw new Error('Failed to update attractionSwipe')
    }

    return updatedAttractionSwipe
  }

  // add label to variables
  const createSwipeVariables: PrivateCreateAttractionSwipeMutationVariables = {
    ...event.arguments,
    input: {
      ...event.arguments.input,
      label: AttractionSwipeLabel.SWIPE,
    },
  }

  const attractionSwipe = await _privateCreateAttractionSwipe(createSwipeVariables)

  if (!attractionSwipe) {
    throw new Error('Failed to create userTrip')
  }

  /**
   * after hooks
   */
  // none

  return attractionSwipe
}

export default putAttractionSwipe
