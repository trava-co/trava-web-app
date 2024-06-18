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
exports.getAttractionFailureCount = exports.getAttractionWithDynamoDbClient = void 0;
const ApiClient_1 = __importDefault(require("./ApiClient"));
const dbClient_1 = require("./dbClient");
const getTableName_1 = require("./getTableName");
const lambda_1 = require("shared-types/graphql/lambda");
const attractionTable = getTableName_1.getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME);
function getAttractionWithDynamoDbClient({ attractionId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: attractionTable,
            Key: { id: attractionId },
        };
        const res = yield dbClient_1.dbClient.get(params).promise();
        return res.Item;
    });
}
exports.getAttractionWithDynamoDbClient = getAttractionWithDynamoDbClient;
function getAttractionFailureCount({ attractionId }) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetAttractionFailureCount,
            variables: {
                id: attractionId,
            },
        });
        return (_c = (_b = (_a = res.data.getAttraction) === null || _a === void 0 ? void 0 : _a.generation) === null || _b === void 0 ? void 0 : _b.failureCount) !== null && _c !== void 0 ? _c : 0;
    });
}
exports.getAttractionFailureCount = getAttractionFailureCount;
