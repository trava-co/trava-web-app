"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGooglePlaceFromDb = void 0;
const getTableName_1 = __importDefault(require("./getTableName"));
const dbClient_1 = __importDefault(require("./dbClient"));
const googlePlaceTableName = (0, getTableName_1.default)(process.env.API_TRAVA_GOOGLEPLACETABLE_NAME);
async function getGooglePlaceFromDb(placeId) {
    if (!placeId) {
        throw new Error('No placeId found');
    }
    // query dbclient googleplace table using attraction.locations[0].startLoc.googlePlaceId
    const params = {
        TableName: googlePlaceTableName,
        Key: {
            id: placeId,
        },
    };
    const response = await dbClient_1.default.get(params).promise();
    if (!response.Item) {
        throw new Error('No google place found');
    }
    const googlePlace = response.Item;
    return googlePlace;
}
exports.getGooglePlaceFromDb = getGooglePlaceFromDb;
