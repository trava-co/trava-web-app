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
const lambda = new aws_sdk_1.default.Lambda();
function startGetAttractionPhotos(variables) {
    return __awaiter(this, void 0, void 0, function* () {
        lambda.invoke({
            FunctionName: `getAttractionPhotos-${process.env.ENV}`,
            Payload: JSON.stringify(variables),
            InvocationType: 'Event', // for asynchronous execution
        }, function (error, data) {
            if (error) {
                console.error(error);
            }
            else {
                console.log('Lambda invoked:', data);
            }
        });
    });
}
exports.startGetAttractionPhotos = startGetAttractionPhotos;
