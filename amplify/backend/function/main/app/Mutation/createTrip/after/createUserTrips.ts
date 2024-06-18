import { AppSyncResolverEvent } from 'aws-lambda/trigger/appsync-resolver'
import {
  CreateTripMutationVariables,
  CreateUserTripInput,
  LambdaCreateUserTripMutation,
  LambdaCreateUserTripMutationVariables,
  Trip,
  UserTripStatus,
} from 'shared-types/API'
import { lambdaCreateUserTrip } from 'shared-types/graphql/lambda'
import ApiClient from '../../../utils/ApiClient/ApiClient'
import chunk from 'lodash.chunk'

const CHUNK_SIZE = 5

async function create(userTrip: CreateUserTripInput) {
  const res = await ApiClient.get().apiFetch<LambdaCreateUserTripMutationVariables, LambdaCreateUserTripMutation>({
    query: lambdaCreateUserTrip,
    variables: {
      input: userTrip,
    },
  })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.createUserTrip
}

const createUserTrips = async (event: AppSyncResolverEvent<CreateTripMutationVariables>, trip: Trip) => {
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (event.identity && 'sub' in event.identity) {
    const adminUserId = event.identity.sub
    const adminInviteLink = event.arguments.input.link
    const userIds = event.arguments.input.userIds
    const uniqueUserIds = [...new Set(userIds)]

    // userTrip host must go first, otherwise you won't be allowed to create other userTrips
    await create({
      tripId: trip.id,
      userId: adminUserId,
      status: UserTripStatus.APPROVED,
      invitedByUserId: adminUserId,
      inviteLink: adminInviteLink,
    })

    // create userTrips for other members
    const userTripPromises = uniqueUserIds.map((userId) =>
      create({
        tripId: trip.id,
        userId,
        status: userId === adminUserId ? UserTripStatus.APPROVED : UserTripStatus.PENDING,
        invitedByUserId: adminUserId,
      }),
    )

    const chunkedUserTripPromises = chunk(userTripPromises, CHUNK_SIZE)

    for (const chunkOfUserTripPromises of chunkedUserTripPromises) {
      await Promise.all(chunkOfUserTripPromises)
    }
  }

  return null
}

export default createUserTrips
