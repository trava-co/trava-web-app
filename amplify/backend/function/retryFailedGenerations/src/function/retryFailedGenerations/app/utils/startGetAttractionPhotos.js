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
exports.startGetAttractionPhotos = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const API_1 = require("shared-types/API");
const updateAttraction_1 = require("./updateAttraction");
const lambda = new aws_sdk_1.default.Lambda();
function startGetAttractionPhotos({ queryVariables, failureCount }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield lambda
                .invoke({
                FunctionName: `getAttractionPhotos-${process.env.ENV}`,
                Payload: JSON.stringify({ arguments: queryVariables }),
                InvocationType: 'Event', // for asynchronous execution
            })
                .promise();
            console.log(`response from startGetAttractionPhotos async invocation: ${JSON.stringify(res, null, 2)}.`);
            return res;
        }
        catch (error) {
            yield updateAttraction_1.updateAttractionWithFailure({
                attractionId: queryVariables.input.attractionId,
                failureCount,
                step: API_1.GenerationStep.GET_PHOTOS,
                errorMessage: error.message,
            });
        }
    });
}
exports.startGetAttractionPhotos = startGetAttractionPhotos;
