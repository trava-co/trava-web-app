"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMilesToBoundingBox = exports.isPointInsideBoundingBox = exports.computeBoundingBoxFromSingleCoordinatePair = exports.computeBoundingBox = void 0;
const bbox_1 = __importDefault(require("@turf/bbox"));
const turfHelpers = __importStar(require("@turf/helpers"));
// calculate bounds based on all markers
// https://github.com/react-native-mapbox-gl/maps/blob/master/docs/Camera.md
const computeBoundingBox = (items) => {
    const coords = items.map((item) => [
        item.location.startLoc.googlePlace.data.coords.long,
        item.location.startLoc.googlePlace.data.coords.lat,
    ]);
    // if there are no attractions in the trip plan, then return null to avoid turfHelpers error. bbox not required by mapbox.
    if (coords.length === 0)
        return null;
    if (coords.length === 1) {
        // if only one attraction in tripPlan
        coords.push(coords[0]);
    }
    // bbox in [minX, minY, maxX, maxY] order
    const line = turfHelpers.lineString(coords);
    return (0, bbox_1.default)(line);
};
exports.computeBoundingBox = computeBoundingBox;
const computeBoundingBoxFromSingleCoordinatePair = (coords) => {
    const coordsArray = [
        [Number(coords.long), Number(coords.lat)],
        [Number(coords.long), Number(coords.lat)],
    ];
    const line = turfHelpers.lineString(coordsArray);
    return (0, bbox_1.default)(line);
};
exports.computeBoundingBoxFromSingleCoordinatePair = computeBoundingBoxFromSingleCoordinatePair;
const isPointInsideBoundingBox = (point, bbox) => bbox[0] <= point.long && point.long <= bbox[2] && bbox[1] <= point.lat && point.lat <= bbox[3];
exports.isPointInsideBoundingBox = isPointInsideBoundingBox;
const getMilesFromDegreeOfLongitude = (latitude) => {
    // convert latitude from decimal degrees into radians
    const radiansLatitude = (latitude * Math.PI) / 180;
    // take the cosine of the radiansLatitude
    const cosLatitude = Math.cos(radiansLatitude);
    // 1 degree of longitude can be computed by multiplying the cosine of the latitude by the length of a degree at the equator (oneDegreeLatitude)
    const oneDegreeLongitude = 69.172 * cosLatitude;
    return oneDegreeLongitude;
};
const addMilesToBoundingBox = (bbox, miles) => {
    const minLatitude = bbox[1];
    const maxLatitude = bbox[3];
    const minLongitude = bbox[0];
    const maxLongitude = bbox[2];
    const oneDegreeLatitude = 69.172;
    // longitude's 1 mile equivalent depends on latitude. Use average latitude to determine longitude's 1 mile equivalent
    const averageLatitude = (minLatitude + maxLatitude) / 2;
    const oneDegreeLongitude = getMilesFromDegreeOfLongitude(averageLatitude);
    // add the miles to the latitude
    const minLatitudeWithMiles = minLatitude - miles / oneDegreeLatitude;
    const maxLatitudeWithMiles = maxLatitude + miles / oneDegreeLatitude;
    // add the miles to the longitude
    const minLongitudeWithMiles = minLongitude - miles / oneDegreeLongitude;
    const maxLongitudeWithMiles = maxLongitude + miles / oneDegreeLongitude;
    return [minLongitudeWithMiles, minLatitudeWithMiles, maxLongitudeWithMiles, maxLatitudeWithMiles];
};
exports.addMilesToBoundingBox = addMilesToBoundingBox;
