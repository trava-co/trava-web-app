// @ts-nocheck

import { AppSyncResolverHandler } from 'aws-lambda'
import { getSSMVariable } from '../../utils/getSSMVariable'
import axios from 'axios'
import { FlightStatsGetScheduleDetailsQueryVariables } from 'shared-types/API'

const flightStatsGetScheduleDetails: AppSyncResolverHandler<FlightStatsGetScheduleDetailsQueryVariables, any> = async (
  event,
) => {
  console.log('flightStatsGetScheduleDetails')

  /**
   * Main query
   */

  const flightstatsAppId = await getSSMVariable('FLIGHTSTATS_APPID')
  const flightstatsAppKey = await getSSMVariable('FLIGHTSTATS_APPKEY')

  if (!event.arguments.input) {
    throw new Error('No arguments specified')
  }

  const { flightNumber, day, codeType, month, year, carrier } = event.arguments.input

  const result = (
    await axios.get(
      encodeURI(
        `https://api.flightstats.com/flex/schedules/rest/v1/json/flight/${carrier}/${flightNumber}/departing/${year}/${month}/${day}`,
      ),
      {
        params: {
          appId: flightstatsAppId,
          appKey: flightstatsAppKey,
          codeType,
        },
      },
    )
  ).data

  /**
   * after hooks
   */
  // none

  if (!result) {
    return null
  }

  return result
}

export default flightStatsGetScheduleDetails
