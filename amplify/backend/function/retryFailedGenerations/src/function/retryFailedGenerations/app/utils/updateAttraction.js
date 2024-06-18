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
exports.updateAttractionWithFailure = exports.updateAttraction = void 0;
const ApiClient_1 = __importDefault(require("./ApiClient"));
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const sendSlackNotification_1 = require("./sendSlackNotification");
const getSSMVariable_1 = require("./getSSMVariable");
function updateAttraction(updateAttractionMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateAttraction,
            variables: {
                input: updateAttractionMutationVariables.input,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateUpdateAttraction;
    });
}
exports.updateAttraction = updateAttraction;
function updateAttractionWithFailure({ attractionId, failureCount, step, errorMessage, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(`Error in step ${step} for attraction ${attractionId}: ${errorMessage}`);
        // if env is staging or prod, send slack notification
        if (process.env.ENV === 'prod' || process.env.ENV === 'staging') {
            const SLACK_WEBHOOK_URL = yield getSSMVariable_1.getSSMVariable('SLACK_WEBHOOK_URL');
            yield sendSlackNotification_1.sendSlackNotification(SLACK_WEBHOOK_URL, `${process.env.ENV} backend environment:\nGeneration step ${step} failed for attraction ${attractionId}. \nError: ${errorMessage}`).catch((error) => {
                console.error('Error sending slack notification:', error);
            });
        }
        const updateAttractionInput = {
            id: attractionId,
            generation: {
                step,
                status: API_1.Status.FAILED,
                failureCount: failureCount + 1,
                lastUpdatedAt: new Date().toISOString(),
                lastFailureReason: errorMessage,
            },
            descriptionLong: "This is taking longer than usual. We're working on it!",
            descriptionShort: 'Still generating description and details...',
        };
        yield updateAttraction({ input: updateAttractionInput });
        console.log(`Attraction ${attractionId} status updated to FAILED`);
    });
}
exports.updateAttractionWithFailure = updateAttractionWithFailure;
