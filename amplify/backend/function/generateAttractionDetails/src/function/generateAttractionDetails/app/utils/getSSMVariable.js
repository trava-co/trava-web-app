"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSSMVariable = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
async function getSSMVariable(variableName) {
    const { Parameters } = await new aws_sdk_1.default.SSM()
        .getParameters({
        Names: [variableName].map((secretName) => process.env[secretName] || ''),
        WithDecryption: true,
    })
        .promise();
    if (!Parameters) {
        throw new Error('Failed to retrieve SSM parameters');
    }
    const token = Parameters.find((parameter) => parameter.Name === process.env[variableName])?.Value;
    if (!token || token.length === 0) {
        throw new Error(`Failed to retrieve a secret value: ${variableName}`);
    }
    return token;
}
exports.getSSMVariable = getSSMVariable;
