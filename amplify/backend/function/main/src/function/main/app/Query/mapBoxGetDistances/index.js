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
const axios_1 = __importDefault(require("axios"));
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const mutations_1 = require("shared-types/graphql/mutations");
const queries_1 = require("shared-types/graphql/queries");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const getDistanceString = (attractionABArray) => {
    // attractionABArray = [{attractionId: '1', lat: 1, long: 1}, {attractionId: '2', lat: 2, long: 2}]
    // returns string longA,latA;longB,latB
    const attractionA = attractionABArray[0];
    const attractionB = attractionABArray[1];
    return `${attractionA.long},${attractionA.lat};${attractionB.long},${attractionB.lat}`;
};
const mapBoxGetDistances = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const timeTakenLambda = 'mapBoxGetDistances Lambda';
    console.time(timeTakenLambda);
    const eventArgumentsLocations = event.arguments.input.locations;
    if (!eventArgumentsLocations)
        throw new Error('No input params passed in request');
    const token = yield (0, getSSMVariable_1.getSSMVariable)('MAPBOX_TOKEN');
    const attractionsLocationsPromises = eventArgumentsLocations.map((attractionABArray) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // last element doesn't have distance
        const distanceString = getDistanceString(attractionABArray);
        // check if distance between two attractions exists in db
        const getDistanceFromDb = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: queries_1.privateGetDistance,
            variables: {
                key: distanceString,
            },
        });
        // don't hit mapbox if exists
        if ((_a = getDistanceFromDb === null || getDistanceFromDb === void 0 ? void 0 : getDistanceFromDb.data) === null || _a === void 0 ? void 0 : _a.privateGetDistance) {
            console.log(`found distance in db for ${distanceString}`, JSON.stringify(getDistanceFromDb.data.privateGetDistance));
            return {
                dbKey: distanceString,
                dbValue: (_b = getDistanceFromDb === null || getDistanceFromDb === void 0 ? void 0 : getDistanceFromDb.data) === null || _b === void 0 ? void 0 : _b.privateGetDistance.value,
            };
        }
        console.log('Mapbox Request ' + distanceString);
        return axios_1.default.get(encodeURI(`https://api.mapbox.com/directions/v5/mapbox/walking/${distanceString}?alternatives=false&continue_straight=false&geometries=geojson&overview=simplified&steps=false&access_token=${token}`));
    }));
    const distances = yield Promise.allSettled(attractionsLocationsPromises);
    // save distances to db
    const promisesToSave = distances.map((el, distancesIndex) => {
        var _a, _b, _c, _d;
        if (el.status === 'fulfilled' && ((_d = (_c = (_b = (_a = el === null || el === void 0 ? void 0 : el.value) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.routes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.distance)) {
            // only mapbox requests (without db requests)
            const distanceString = getDistanceString(eventArgumentsLocations[distancesIndex]);
            return ApiClient_1.default.get()
                .useIamAuth()
                .apiFetch({
                query: mutations_1.privateCreateDistance,
                variables: {
                    input: {
                        key: distanceString,
                        value: parseFloat(el.value.data.routes[0].distance) * 0.000621371192,
                    },
                },
            });
        }
        return undefined;
    });
    yield Promise.all(promisesToSave);
    const result = distances.map((el, index) => {
        var _a, _b, _c, _d, _e;
        return {
            attractionId_1: eventArgumentsLocations[index][0].attractionId,
            attractionId_2: eventArgumentsLocations[index][1].attractionId,
            distance: el.status === 'fulfilled'
                ? ((_d = (_c = (_b = (_a = el === null || el === void 0 ? void 0 : el.value) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.routes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.distance) * 0.000621371192 || ((_e = el === null || el === void 0 ? void 0 : el.value) === null || _e === void 0 ? void 0 : _e.dbValue) || 0
                : 0,
            __typename: 'DistanceBetweenLocations',
        };
    });
    console.timeEnd(timeTakenLambda);
    return {
        __typename: 'MapboxGetDistancesResult',
        locations: result,
    };
});
exports.default = mapBoxGetDistances;
