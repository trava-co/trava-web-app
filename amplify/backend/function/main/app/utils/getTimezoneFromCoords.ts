import tz from 'geo-tz'
import { CoordsInput } from 'shared-types/API'

export function getTimezoneFromCoords(coords: CoordsInput) {
  return tz.find(coords.lat, coords.long)[0]
}
