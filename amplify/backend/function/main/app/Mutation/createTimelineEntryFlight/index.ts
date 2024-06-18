import { AppSyncResolverHandler } from 'aws-lambda'
import {
  CreateTimelineEntryFlightMutationVariables,
  LambdaPrivateCreateTimelineEntryMemberMutation,
  LambdaPrivateCreateTimelineEntryMemberMutationVariables,
  PrivateCreateTimelineEntryMutation,
  PrivateCreateTimelineEntryMutationVariables,
  TimelineEntryType,
  UpdateTimelineEntryFlightMutationVariables,
} from 'shared-types/API'
import ApiClient from '../../utils/ApiClient/ApiClient'
import { privateCreateTimelineEntry, updateTimelineEntryFlight } from 'shared-types/graphql/mutations'
import checkIfUserHasAccessToTrip from './before/checkIfUserHasAccessToTrip'
import validateInput from './before/validateInput'
import checkIfUsersAddedBelongToTrip from './before/checkIfUsersAddedBelongToTrip'
import getTripTimelineByTrip from '../../utils/getTripTimelineByTrip'
import { lambdaPrivateCreateTimelineEntryMember } from 'shared-types/graphql/lambda'

const syncBeforeHooks = [validateInput, checkIfUserHasAccessToTrip, checkIfUsersAddedBelongToTrip]

async function _privateCreateTimelineEntryFlight(variables: CreateTimelineEntryFlightMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<PrivateCreateTimelineEntryMutationVariables, PrivateCreateTimelineEntryMutation>({
      query: privateCreateTimelineEntry,
      variables: {
        input: {
          timelineEntryType: TimelineEntryType.FLIGHT,
          tripId: variables.input.tripId,
          notes: variables.input.notes,
          date: variables.input.date,
          time: variables.input.time,
          flightDetails: variables.input.flightDetails,
        },
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateTimelineEntry
}

async function _privateCreateTimelineEntryMember(variables: LambdaPrivateCreateTimelineEntryMemberMutationVariables) {
  if (!variables.input) return

  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<LambdaPrivateCreateTimelineEntryMemberMutationVariables, LambdaPrivateCreateTimelineEntryMemberMutation>({
      query: lambdaPrivateCreateTimelineEntryMember,
      variables: {
        input: variables.input,
      },
    })

  // TODO unified error handler
  if (res.errors?.length) {
    // TODO handle error message parsing:
    throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`)
  }

  return res.data.privateCreateTimelineEntryMember
}

const createTimelineEntryFlight: AppSyncResolverHandler<CreateTimelineEntryFlightMutationVariables, any> = async (
  event,
  ...args
) => {
  /**
   * sync before hooks
   */
  for (const hook of syncBeforeHooks) {
    console.log(`Running sync before hook: "${hook.name}"`)
    await hook(event, ...args)
  }

  /**
   * Main query
   */
  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('Not authorized')
  }

  event.request.headers.authorization && ApiClient.get().useAwsCognitoUserPoolAuth(event.request.headers.authorization)
  const tripTimelineEntries = await getTripTimelineByTrip({
    tripId: event.arguments.input.tripId,
    userId: event.identity.sub,
  })

  const existingTimelineEntry = tripTimelineEntries
    .filter((tripTimelineEntry) => !!tripTimelineEntry)
    .find((tripTimelineEntry) => {
      const flightFromTimelineEntry = tripTimelineEntry?.flightDetails?.scheduledFlights?.[0]
      const flightFromArguments = event.arguments.input?.flightDetails?.scheduledFlights?.[0]

      if (!flightFromTimelineEntry || !flightFromArguments) return

      const flightFromTimelineEntryIata =
        (flightFromTimelineEntry.carrierFsCode ?? '') + (flightFromTimelineEntry.flightNumber ?? '')
      const flightFromArgumentsIata =
        (flightFromArguments.carrierFsCode ?? '') + (flightFromArguments.flightNumber ?? '')

      // since there may be multiple flights with the same flight number, we need to check if the arrival and departure airports are the same
      const sameAirportsForDepartureAndArrival =
        flightFromTimelineEntry.departureAirportFsCode === flightFromArguments.departureAirportFsCode &&
        flightFromTimelineEntry.arrivalAirportFsCode === flightFromArguments.arrivalAirportFsCode

      return (
        tripTimelineEntry?.date === event.arguments.input?.date &&
        flightFromTimelineEntryIata.localeCompare(flightFromArgumentsIata) === 0 &&
        sameAirportsForDepartureAndArrival
      )
    })

  if (existingTimelineEntry) {
    const timelineEntryFlight = await ApiClient.get().apiFetch<UpdateTimelineEntryFlightMutationVariables>({
      query: updateTimelineEntryFlight,
      variables: {
        input: {
          id: existingTimelineEntry.id,
          time: event.arguments.input.time,
          date: event.arguments.input.date,
          flightDetails: event.arguments.input.flightDetails,
          notes: event.arguments.input.notes,
          memberIds: event.arguments.input.memberIds,
        },
      },
    })

    return timelineEntryFlight?.data?.updateTimelineEntryFlight
  }

  ApiClient.get().useIamAuth()

  const timelineEntryFlight = await _privateCreateTimelineEntryFlight(event.arguments)

  if (!timelineEntryFlight) {
    throw new Error('Failed to create timeline entry flight')
  }

  for (const userId of event.arguments.input.memberIds) {
    const timelineEntryMembers = await _privateCreateTimelineEntryMember({
      input: {
        timelineEntryId: timelineEntryFlight.id,
        userId: userId,
      },
    })

    if (!timelineEntryMembers) {
      throw new Error('Failed to create timeline entry member')
    }
  }

  /**
   * sync after
   */
  // none

  return timelineEntryFlight
}

export default createTimelineEntryFlight
