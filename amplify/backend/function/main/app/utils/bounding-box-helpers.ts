import turfBbox from '@turf/bbox'
import * as turfHelpers from '@turf/helpers'
import { Coords, Location } from 'shared-types/API'

type TypeBoundingBoxItem = {
  location: { startLoc: Omit<Location, '__typename'> }
}

// calculate bounds based on all markers
// https://github.com/react-native-mapbox-gl/maps/blob/master/docs/Camera.md
export const computeBoundingBox = (items: TypeBoundingBoxItem[]): turfHelpers.BBox | null => {
  const coords = items.map((item) => [
    item.location.startLoc.googlePlace.data.coords.long,
    item.location.startLoc.googlePlace.data.coords.lat,
  ])
  // if there are no attractions in the trip plan, then return null to avoid turfHelpers error. bbox not required by mapbox.
  if (coords.length === 0) return null

  if (coords.length === 1) {
    // if only one attraction in tripPlan
    coords.push(coords[0])
  }

  // bbox in [minX, minY, maxX, maxY] order
  const line = turfHelpers.lineString(coords)
  return turfBbox(line)
}

export const computeBoundingBoxFromSingleCoordinatePair = (coords: Omit<Coords, '__typename'>): turfHelpers.BBox => {
  const coordsArray = [
    [Number(coords.long), Number(coords.lat)],
    [Number(coords.long), Number(coords.lat)],
  ]
  const line = turfHelpers.lineString(coordsArray)
  return turfBbox(line)
}

export const isPointInsideBoundingBox = (point: Omit<Coords, '__typename'>, bbox: turfHelpers.BBox): boolean =>
  bbox[0] <= point.long && point.long <= bbox[2] && bbox[1] <= point.lat && point.lat <= bbox[3]

const getMilesFromDegreeOfLongitude = (latitude: number) => {
  // convert latitude from decimal degrees into radians
  const radiansLatitude = (latitude * Math.PI) / 180
  // take the cosine of the radiansLatitude
  const cosLatitude = Math.cos(radiansLatitude)

  // 1 degree of longitude can be computed by multiplying the cosine of the latitude by the length of a degree at the equator (oneDegreeLatitude)
  const oneDegreeLongitude = 69.172 * cosLatitude

  return oneDegreeLongitude
}

export const addMilesToBoundingBox = (bbox: turfHelpers.BBox, miles: number): turfHelpers.BBox => {
  const minLatitude = bbox[1]
  const maxLatitude = bbox[3]
  const minLongitude = bbox[0]
  const maxLongitude = bbox[2]
  const oneDegreeLatitude = 69.172

  // longitude's 1 mile equivalent depends on latitude. Use average latitude to determine longitude's 1 mile equivalent
  const averageLatitude = (minLatitude + maxLatitude) / 2

  const oneDegreeLongitude = getMilesFromDegreeOfLongitude(averageLatitude)

  // add the miles to the latitude
  const minLatitudeWithMiles = minLatitude - miles / oneDegreeLatitude
  const maxLatitudeWithMiles = maxLatitude + miles / oneDegreeLatitude

  // add the miles to the longitude
  const minLongitudeWithMiles = minLongitude - miles / oneDegreeLongitude
  const maxLongitudeWithMiles = maxLongitude + miles / oneDegreeLongitude

  return [minLongitudeWithMiles, minLatitudeWithMiles, maxLongitudeWithMiles, maxLatitudeWithMiles]
}
