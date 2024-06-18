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
exports.handler = void 0;
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const tearex_1 = __importDefault(require("tearex"));
const getSSMVariable_1 = require("./getSSMVariable");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const TEAREX_URL = yield getSSMVariable_1.getSSMVariable('TEAREX_URL');
    const TEAREX_API_KEY = yield getSSMVariable_1.getSSMVariable('TEAREX_API_KEY');
    const ENV = process.env.ENV;
    if (!ENV) {
        throw new Error('No ENV set');
    }
    if (!TEAREX_URL || !TEAREX_API_KEY) {
        throw new Error('Secrets not found');
    }
    tearex_1.default.init({
        url: TEAREX_URL,
        apiKey: TEAREX_API_KEY,
        stage: process.env.ENV,
    });
    for (const record of event.Records) {
        if (!record.eventSourceARN) {
            throw new Error('Source table unknown');
        }
        const sourceTable = getTableNameFromEventSourceARN(record.eventSourceARN);
        if (record.eventName === 'INSERT') {
            if (!((_a = record.dynamodb) === null || _a === void 0 ? void 0 : _a.NewImage))
                return;
            const newUnmarshalledRecord = util_dynamodb_1.unmarshall((_b = record.dynamodb) === null || _b === void 0 ? void 0 : _b.NewImage);
            yield tearex_1.default.createEntity({
                id: newUnmarshalledRecord.id,
                label: sourceTable,
            });
        }
        if (record.eventName === 'MODIFY') {
            if (!((_c = record.dynamodb) === null || _c === void 0 ? void 0 : _c.NewImage) || !((_d = record.dynamodb) === null || _d === void 0 ? void 0 : _d.OldImage))
                return;
            const newUnmarshalledRecord = util_dynamodb_1.unmarshall((_e = record.dynamodb) === null || _e === void 0 ? void 0 : _e.NewImage);
            const oldUnmarshalledRecord = util_dynamodb_1.unmarshall((_f = record.dynamodb) === null || _f === void 0 ? void 0 : _f.OldImage);
            if (!oldUnmarshalledRecord.deletedAt && !!newUnmarshalledRecord.deletedAt) {
                // deletedAt has been set
                yield tearex_1.default.deleteEntity({
                    id: newUnmarshalledRecord.id,
                    label: sourceTable,
                });
            }
            else if (!!oldUnmarshalledRecord.deletedAt && !newUnmarshalledRecord.deletedAt) {
                // deletedAt has been unset
                yield tearex_1.default.createEntity({
                    id: newUnmarshalledRecord.id,
                    label: sourceTable,
                });
            }
        }
        if (record.eventName === 'REMOVE') {
            if (!((_g = record.dynamodb) === null || _g === void 0 ? void 0 : _g.OldImage))
                return;
            const oldUnmarshalledRecord = util_dynamodb_1.unmarshall((_h = record.dynamodb) === null || _h === void 0 ? void 0 : _h.OldImage);
            yield tearex_1.default.deleteEntity({
                id: oldUnmarshalledRecord.id,
                label: sourceTable,
            });
        }
    }
});
exports.handler = handler;
function getTableNameFromEventSourceARN(eventSourceArn) {
    return eventSourceArn.split('/')[1].split('-')[0];
}
