"use strict";
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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const mutations_1 = require("shared-types/graphql/mutations");
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const axios_1 = __importDefault(require("axios"));
const getDestinationsByRequestingUser_1 = __importDefault(require("../../utils/getDestinationsByRequestingUser"));
const locationRestrictionInMeters = 50 * 1609.34; // 50 miles
const removeSpecialCharacters = (str) => str.replace(/[^\w\s]/gi, '').replace('\n', ' ');
function _privateCreateDestination(createDestinationMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const input = Object.assign(Object.assign({}, createDestinationMutationVariables.input), { label: 'Destination' });
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: mutations_1.privateCreateDestination,
            variables: { input },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateDestination;
    });
}
const createDestinationFromAttraction = (attractionInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, getSSMVariable_1.getSSMVariable)('GOOGLE_MAPS_API_KEY');
    const { city, state, country, continent, authorId, attractionCoords } = attractionInfo;
    const searchName = `${city}, ${state}, ${country}`;
    if (!searchName) {
        return;
    }
    // get google place info
    // note: locationrestriction has a bug at the moment: https://github.com/googlemaps/openapi-specification/issues/406
    const [googleResponse, destinations] = yield Promise.all([
        axios_1.default.get(encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`), {
            params: Object.assign({ input: removeSpecialCharacters(searchName), fields: 'place_id,name,geometry', key: token, inputtype: 'textquery' }, (attractionCoords && {
                locationrestriction: `circle:${locationRestrictionInMeters}@${attractionCoords.lat},${attractionCoords.long}`,
            })),
        }),
        (0, getDestinationsByRequestingUser_1.default)(authorId || undefined),
    ]);
    const googleResponseData = googleResponse.data;
    if (!('candidates' in googleResponseData)) {
        return;
    }
    const firstCandidate = googleResponseData.candidates[0];
    if (firstCandidate) {
        const candidateGooglePlaceId = firstCandidate.place_id;
        const existingDestination = destinations.find((destination) => destination.googlePlaceId === candidateGooglePlaceId);
        // if the user already has access to this destination (trava created or they're the author), return the destinationId without creating a duplicate
        if (existingDestination) {
            return existingDestination;
        }
    }
    // create new destination
    const newDestination = yield _privateCreateDestination({
        input: {
            name: firstCandidate.name,
            coords: {
                long: firstCandidate.geometry.location.lng,
                lat: firstCandidate.geometry.location.lat,
            },
            isTravaCreated: 0,
            googlePlaceId: firstCandidate.place_id,
            state,
            country,
            continent,
            featured: false,
            authorId,
        },
    });
    if (!newDestination) {
        throw new Error('Failed to create destination');
    }
    return newDestination;
});
exports.default = createDestinationFromAttraction;
