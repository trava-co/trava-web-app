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
const apiClient_1 = __importDefault(require("./utils/apiClient"));
const mutations_1 = require("shared-types/graphql/mutations");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    for (const record of event.Records) {
        if (record.eventName === 'MODIFY' || record.eventName === 'INSERT') {
            if (!((_a = record.dynamodb) === null || _a === void 0 ? void 0 : _a.NewImage) || !((_b = record.dynamodb) === null || _b === void 0 ? void 0 : _b.OldImage))
                return;
            const oldImageUnmarshalled = util_dynamodb_1.unmarshall((_c = record.dynamodb) === null || _c === void 0 ? void 0 : _c.OldImage);
            const newImageUnmarshalled = util_dynamodb_1.unmarshall((_d = record.dynamodb) === null || _d === void 0 ? void 0 : _d.NewImage);
            if (lodash_isequal_1.default(oldImageUnmarshalled.tripPlan, newImageUnmarshalled.tripPlan))
                return;
            yield apiClient_1.default.get().apiFetch({
                query: mutations_1.createTripPlanLog,
                variables: {
                    input: {
                        tripPlan: newImageUnmarshalled.tripPlan,
                    },
                },
            });
        }
    }
});
exports.handler = handler;
