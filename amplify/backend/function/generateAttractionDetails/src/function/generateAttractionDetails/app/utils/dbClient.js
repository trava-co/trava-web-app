"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbClient = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let dynamoOptions = {};
// development mock
if (process.env.AWS_EXECUTION_ENV?.includes('-mock')) {
    dynamoOptions = {
        endpoint: 'http://localhost:62224',
        region: 'us-fake-1',
        secretAccessKey: 'fake',
        accessKeyId: 'fake',
    };
}
const dbClient = new aws_sdk_1.default.DynamoDB.DocumentClient(dynamoOptions);
exports.dbClient = dbClient;
