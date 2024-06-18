"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let dynamoOptions = {};
// development mock
if ((_a = process.env.AWS_EXECUTION_ENV) === null || _a === void 0 ? void 0 : _a.includes('-mock')) {
    dynamoOptions = {
        endpoint: 'http://localhost:62224',
        region: 'us-fake-1',
        secretAccessKey: 'fake',
        accessKeyId: 'fake',
    };
}
const dbClient = new aws_sdk_1.default.DynamoDB.DocumentClient(dynamoOptions);
exports.default = dbClient;
