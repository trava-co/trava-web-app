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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAttractionIdsInDynamoDb = void 0;
const getAllAttractionIdsInDynamoDb = (documentClient, tableName, filterDetails) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let ids = [];
    let result = yield documentClient
        .scan(Object.assign({ TableName: tableName, ProjectionExpression: 'id' }, filterDetails))
        .promise();
    if (((_a = result === null || result === void 0 ? void 0 : result.Count) !== null && _a !== void 0 ? _a : 0) > 0 && result.Items) {
        ids = ids.concat(result.Items.map((item) => item.id));
    }
    while (result.LastEvaluatedKey) {
        result = yield documentClient
            .scan(Object.assign({ TableName: tableName, ProjectionExpression: 'id', ExclusiveStartKey: result.LastEvaluatedKey }, filterDetails))
            .promise();
        if (((_b = result === null || result === void 0 ? void 0 : result.Count) !== null && _b !== void 0 ? _b : 0) > 0 && result.Items) {
            ids = ids.concat(result.Items.map((item) => item.id));
        }
    }
    console.log(`Found ${ids.length} ids: ${tableName}`);
    return new Set(ids);
});
exports.getAllAttractionIdsInDynamoDb = getAllAttractionIdsInDynamoDb;
