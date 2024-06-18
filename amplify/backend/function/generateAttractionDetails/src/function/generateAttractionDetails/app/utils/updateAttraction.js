"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttractionWithFailure = exports.updateAttraction = exports.updateAttractionStatusToInProgress = void 0;
const ApiClient_1 = __importDefault(require("./ApiClient"));
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const getTableName_1 = require("./getTableName");
const dbClient_1 = require("./dbClient");
const getAttraction_1 = require("./getAttraction");
const sendSlackNotification_1 = require("./sendSlackNotification");
const getSSMVariable_1 = require("./getSSMVariable");
const attractionTable = (0, getTableName_1.getTableName)(process.env.API_TRAVA_ATTRACTIONTABLE_NAME);
async function updateAttractionStatusToInProgress({ attractionId }) {
    const params = {
        TransactItems: [
            {
                Update: {
                    TableName: attractionTable,
                    Key: { id: attractionId },
                    ConditionExpression: '#generation.#step = :getDetails and #generation.#statusAttr = :pending',
                    UpdateExpression: 'set #generation.#statusAttr = :inProgress, #generation.#lastUpdatedAt = :now',
                    ExpressionAttributeValues: {
                        ':getDetails': API_1.GenerationStep.GET_DETAILS,
                        ':pending': API_1.Status.PENDING,
                        ':inProgress': API_1.Status.IN_PROGRESS,
                        ':now': new Date().toISOString(),
                    },
                    ExpressionAttributeNames: {
                        '#generation': 'generation',
                        '#step': 'step',
                        '#statusAttr': 'status', // status is a reserved word
                        '#lastUpdatedAt': 'lastUpdatedAt',
                    },
                    ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
                },
            },
        ],
    };
    await dbClient_1.dbClient.transactWrite(params).promise();
    console.log(`Attraction ${attractionId} status updated to IN_PROGRESS`);
    const attraction = await (0, getAttraction_1.getAttraction)({ id: attractionId });
    return attraction;
}
exports.updateAttractionStatusToInProgress = updateAttractionStatusToInProgress;
async function updateAttraction(updateAttractionMutationVariables) {
    const res = await ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaPrivateUpdateAttraction,
        variables: {
            input: updateAttractionMutationVariables.input,
        },
    });
    // TODO unified error handler
    if (res.errors?.length) {
        // TODO handle error message parsing:
        throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
    }
    return res.data.privateUpdateAttraction;
}
exports.updateAttraction = updateAttraction;
async function updateAttractionWithFailure({ attractionId, failureCount, step, errorMessage, }) {
    console.error(`Error in step ${step} for attraction ${attractionId}: ${errorMessage}`);
    // if env is staging or prod, send slack notification
    if (process.env.ENV === 'prod' || process.env.ENV === 'staging') {
        const SLACK_WEBHOOK_URL = await (0, getSSMVariable_1.getSSMVariable)('SLACK_WEBHOOK_URL');
        await (0, sendSlackNotification_1.sendSlackNotification)(SLACK_WEBHOOK_URL, `${process.env.ENV} backend environment:\nGeneration step ${step} failed for attraction ${attractionId}. \nError: ${errorMessage}`).catch((error) => {
            console.error('Error sending slack notification:', error);
        });
    }
    if (failureCount === undefined) {
        // should never happen, but just in case
        // get the attraction
        const result = await (0, getAttraction_1.getAttraction)({ id: attractionId });
        failureCount = result?.generation?.failureCount ?? 0;
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
    await updateAttraction({ input: updateAttractionInput });
    console.log(`Attraction ${attractionId} status updated to FAILED`);
}
exports.updateAttractionWithFailure = updateAttractionWithFailure;
