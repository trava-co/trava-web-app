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
exports.startGenerateAttractionDetails = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const lambda = new aws_sdk_1.default.Lambda();
function startGenerateAttractionDetails(attractionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield lambda
            .invoke({
            FunctionName: `generateAttractionDetails-${process.env.ENV}`,
            Payload: JSON.stringify({
                arguments: {
                    attractionId,
                },
            }),
            InvocationType: 'Event', // for asynchronous execution
        })
            .promise();
        console.log(`response from startGenerateAttractionDetails async invocation: ${JSON.stringify(res, null, 2)}.`);
        return res;
    });
}
exports.startGenerateAttractionDetails = startGenerateAttractionDetails;
