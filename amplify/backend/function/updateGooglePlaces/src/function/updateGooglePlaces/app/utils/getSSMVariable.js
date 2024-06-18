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
exports.getSSMVariable = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
function getSSMVariable(variableName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { Parameters } = yield new aws_sdk_1.default.SSM()
            .getParameters({
            Names: [variableName].map((secretName) => process.env[secretName] || ''),
            WithDecryption: true,
        })
            .promise();
        if (!Parameters) {
            throw new Error('Failed to retrieve SSM parameters');
        }
        const token = (_a = Parameters.find((parameter) => parameter.Name === process.env[variableName])) === null || _a === void 0 ? void 0 : _a.Value;
        if (!token || token.length === 0) {
            throw new Error(`Failed to retrieve a secret value: ${variableName}`);
        }
        return token;
    });
}
exports.getSSMVariable = getSSMVariable;
