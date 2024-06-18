import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'
import {
  DistanceBetweenLocations,
  MapBoxAttractionLocationsInput,
  MapBoxGetDistancesQueryVariables,
  MapboxGetDistancesResult,
  PrivateCreateDistanceMutation,
  PrivateCreateDistanceMutationVariables,
  PrivateGetDistanceQuery,
  PrivateGetDistanceQueryVariables,
} from 'shared-types/API'
import { getSSMVariable } from '../../utils/getSSMVariable'
import { privateCreateDistance } from 'shared-types/graphql/mutations'
import { privateGetDistance } from 'shared-types/graphql/queries'
import ApiClient from '../../utils/ApiClient/ApiClient'

const getDistanceString = (attractionABArray: MapBoxAttractionLocationsInput['locations'][0]) => {
  // attractionABArray = [{attractionId: '1', lat: 1, long: 1}, {attractionId: '2', lat: 2, long: 2}]
  // returns string longA,latA;longB,latB
  const attractionA = attractionABArray[0]
  const attractionB = attractionABArray[1]

  return `${attractionA.long},${attractionA.lat};${attractionB.long},${attractionB.lat}`
}

const mapBoxGetDistances: AppSyncResolverHandler<MapBoxGetDistancesQueryVariables, MapboxGetDistancesResult> = async (
  event,
) => {
  const timeTakenLambda = 'mapBoxGetDistances Lambda'
  console.time(timeTakenLambda)

  const eventArgumentsLocations = event.arguments.input.locations
  if (!eventArgumentsLocations) throw new Error('No input params passed in request')

  const token = await getSSMVariable('MAPBOX_TOKEN')

  const attractionsLocationsPromises = eventArgumentsLocations.map(async (attractionABArray) => {
    // last element doesn't have distance
    const distanceString = getDistanceString(attractionABArray)

    // check if distance between two attractions exists in db
    const getDistanceFromDb = await ApiClient.get()
      .useIamAuth()
      .apiFetch<PrivateGetDistanceQueryVariables, PrivateGetDistanceQuery>({
        query: privateGetDistance,
        variables: {
          key: distanceString,
        },
      })

    // don't hit mapbox if exists
    if (getDistanceFromDb?.data?.privateGetDistance) {
      console.log(
        `found distance in db for ${distanceString}`,
        JSON.stringify(getDistanceFromDb.data.privateGetDistance),
      )
      return {
        dbKey: distanceString,
        dbValue: getDistanceFromDb?.data?.privateGetDistance.value,
      }
    }

    console.log('Mapbox Request ' + distanceString)
    return axios.get(
      encodeURI(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${distanceString}?alternatives=false&continue_straight=false&geometries=geojson&overview=simplified&steps=false&access_token=${token}`,
      ),
    )
  })

  const distances = await Promise.allSettled(attractionsLocationsPromises)

  // save distances to db
  const promisesToSave = distances.map((el: any, distancesIndex) => {
    if (el.status === 'fulfilled' && el?.value?.data?.routes?.[0]?.distance) {
      // only mapbox requests (without db requests)

      const distanceString = getDistanceString(eventArgumentsLocations[distancesIndex])

      return ApiClient.get()
        .useIamAuth()
        .apiFetch<PrivateCreateDistanceMutationVariables, PrivateCreateDistanceMutation>({
          query: privateCreateDistance,
          variables: {
            input: {
              key: distanceString,
              value: parseFloat(el.value.data.routes[0].distance) * 0.000621371192,
            },
          },
        })
    }

    return undefined
  })

  await Promise.all(promisesToSave)

  const result = distances.map((el: any, index) => {
    return {
      attractionId_1: eventArgumentsLocations[index][0].attractionId,
      attractionId_2: eventArgumentsLocations[index][1].attractionId,
      distance:
        el.status === 'fulfilled'
          ? el?.value?.data?.routes?.[0]?.distance * 0.000621371192 || el?.value?.dbValue || 0
          : 0, // convert meters to miles. if promise is rejected, returns 0
      __typename: 'DistanceBetweenLocations' as DistanceBetweenLocations['__typename'],
    }
  })

  console.timeEnd(timeTakenLambda)
  return {
    __typename: 'MapboxGetDistancesResult',
    locations: result,
  }
}

export default mapBoxGetDistances
