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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExploreSearchAttraction = void 0;
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const transformLocationsToSearchLocations_1 = require("./transformLocationsToSearchLocations");
const turf = __importStar(require("@turf/turf"));
function getExploreSearchAttraction({ attractionId, centerCoords, }) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetAttractionDetailsForSearchAttraction,
            variables: {
                id: attractionId,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        const attraction = (_b = res.data) === null || _b === void 0 ? void 0 : _b.getAttraction;
        if (!attraction) {
            throw new Error('Attraction not found');
        }
        const validLocations = (_c = attraction.locations) === null || _c === void 0 ? void 0 : _c.filter((location) => !!location);
        if (!(validLocations === null || validLocations === void 0 ? void 0 : validLocations.length)) {
            throw new Error('Attraction has no locations');
        }
        const searchLocations = (0, transformLocationsToSearchLocations_1.transformAttractionLocationsToSearchLocations)(validLocations);
        let minDistance;
        if (centerCoords) {
            const searchLocationsCoordinatePairs = [];
            for (const location of searchLocations) {
                const startLocCoords = (_d = location.startLoc.googlePlace) === null || _d === void 0 ? void 0 : _d.data.coords;
                startLocCoords && searchLocationsCoordinatePairs.push([startLocCoords.long, startLocCoords.lat]);
                const endLocCoords = (_e = location.endLoc.googlePlace) === null || _e === void 0 ? void 0 : _e.data.coords;
                endLocCoords && searchLocationsCoordinatePairs.push([endLocCoords.long, endLocCoords.lat]);
            }
            // get the min haversine distance between any of the searchLocationsCoordinatePairs and the centerCoords
            minDistance = searchLocationsCoordinatePairs.reduce((minDistance, coordinatePair) => {
                const distance = turf.distance(coordinatePair, [centerCoords.long, centerCoords.lat]);
                return distance < minDistance ? distance : minDistance;
            }, Infinity);
        }
        const searchAttraction = Object.assign(Object.assign(Object.assign(Object.assign({ __typename: 'ExploreSearchAttractionItem', attractionCategories: attraction.attractionCategories, attractionCuisine: attraction.attractionCuisine }, (attraction.author && {
            id: attraction.author.id,
            name: attraction.author.name,
            username: attraction.author.username,
            avatar: attraction.author.avatar,
        })), { bucketListCount: attraction.bucketListCount }), (centerCoords && { distance: minDistance })), { duration: attraction.duration, id: attraction.id, images: attraction.images, isTravaCreated: attraction.isTravaCreated, locations: searchLocations, name: attraction.name, recommendationBadges: attraction.recommendationBadges, type: attraction.type });
        return searchAttraction;
    });
}
exports.getExploreSearchAttraction = getExploreSearchAttraction;
