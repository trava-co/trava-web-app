"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimezoneFromCoords = void 0;
const geo_tz_1 = __importDefault(require("geo-tz"));
function getTimezoneFromCoords(coords) {
    return geo_tz_1.default.find(coords.lat, coords.long)[0];
}
exports.getTimezoneFromCoords = getTimezoneFromCoords;
