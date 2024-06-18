"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputToTransaction = void 0;
const getTableName_1 = __importDefault(require("../../../utils/getTableName"));
function getInputToTransaction({ createAttractionInput, createGooglePlaceInput }) {
    const attractionTableName = (0, getTableName_1.default)(process.env.API_TRAVA_ATTRACTIONTABLE_NAME);
    const googlePlaceTableName = (0, getTableName_1.default)(process.env.API_TRAVA_GOOGLEPLACETABLE_NAME);
    const transaction = {
        TransactItems: [
            {
                Put: {
                    TableName: attractionTableName,
                    Item: createAttractionInput,
                },
            },
        ],
    };
    if (createGooglePlaceInput) {
        transaction.TransactItems.push({
            Put: {
                TableName: googlePlaceTableName,
                Item: createGooglePlaceInput,
            },
        });
    }
    return transaction;
}
exports.getInputToTransaction = getInputToTransaction;
