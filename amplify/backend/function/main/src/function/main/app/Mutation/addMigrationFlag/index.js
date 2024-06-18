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
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const API_1 = require("shared-types/API");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const env_names_to_config_1 = require("../../utils/env-names-to-config");
const migrationUtils_1 = require("../../utils/migrationUtils");
const addMigrationFlag = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`starting tableMigration:`);
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_NOT_AUTHORIZED);
    }
    if (!('claims' in event.identity &&
        'cognito:groups' in event.identity.claims &&
        event.identity.claims['cognito:groups'].includes('admin'))) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_NOT_AUTHORIZED);
    }
    console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`);
    if (!(event.arguments && 'input' in event.arguments && 'tableName' in event.arguments.input)) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_INVALID_INPUT);
    }
    const { tableName: rawTableName, sourceEnv } = event.arguments.input;
    const tableName = rawTableName;
    const sourceTableConfig = env_names_to_config_1.envNamesToConfig[sourceEnv];
    if (!sourceTableConfig) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_INVALID_ENV);
    }
    const DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID = yield (0, getSSMVariable_1.getSSMVariable)('DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID');
    const DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY = yield (0, getSSMVariable_1.getSSMVariable)('DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY');
    const globalDynamoDBOptions = {
        region: 'us-east-1',
        credentials: {
            accessKeyId: DYNAMO_LAMBDA_ADMIN_ACCESS_KEY_ID,
            secretAccessKey: DYNAMO_LAMBDA_ADMIN_SECRET_ACCESS_KEY,
        },
    };
    const documentClient = new dynamodb_1.DocumentClient(globalDynamoDBOptions);
    const sourceTable = tableName + '-' + sourceTableConfig.tableSuffix;
    // add pendingMigration to every item in the table in a batch operation that can handle tens of thousands of items
    // dynamodb batchWrite can handle up to 25 items per batch
    let totalSuccess = 0;
    let totalFail = 0;
    let filterDetails = {};
    if (tableName === migrationUtils_1.MigrationTableName.PHOTOGRAPHER) {
        filterDetails = {};
    }
    else if (tableName === migrationUtils_1.MigrationTableName.ATTRACTION) {
        // authorType === ADMIN alone should be sufficient, but we're being extra careful
        filterDetails = {
            FilterExpression: '#isTravaCreated = :isTravaCreated AND #authorType = :authorType AND attribute_not_exists(#authorId)',
            ExpressionAttributeNames: {
                '#isTravaCreated': 'isTravaCreated',
                '#authorType': 'authorType',
                '#authorId': 'authorId',
            },
            ExpressionAttributeValues: {
                ':isTravaCreated': 1,
                ':authorType': API_1.AUTHOR_TYPE.ADMIN,
            },
        };
    }
    else {
        filterDetails = {
            FilterExpression: '#isTravaCreated = :isTravaCreated',
            ExpressionAttributeNames: { '#isTravaCreated': 'isTravaCreated' },
            ExpressionAttributeValues: {
                ':isTravaCreated': 1,
            },
        };
    }
    try {
        console.log(`Scanning source table: ${sourceTable}`);
        const sourceTableItems = yield (0, migrationUtils_1.scanAll)(documentClient, sourceTable, filterDetails);
        console.log(`Retrieved ${sourceTableItems.length} items to update`);
        for (let i = 0; i < sourceTableItems.length; i += 25) {
            const batch = sourceTableItems.slice(i, i + 25).map((item) => ({
                PutRequest: {
                    Item: Object.assign(Object.assign({}, item), { pendingMigration: true }),
                },
            }));
            const { successCount, failureCount } = yield processBatch(documentClient, batch, sourceTable);
            totalSuccess += successCount;
            totalFail += failureCount;
        }
        console.log(`Migration completed with ${totalSuccess} successes and ${totalFail} failures.`);
    }
    catch (error) {
        console.error('Error during batch update:', error);
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_FAILED);
    }
    return {
        __typename: 'AddMigrationFlagResponse',
        success: totalSuccess,
        fail: totalFail,
    };
});
// Additional utility function for exponential backoff
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Function to process batch with retries
function processBatch(documentClient, batch, tableName, maxRetries = 5) {
    return __awaiter(this, void 0, void 0, function* () {
        let unprocessedItems = batch;
        let retries = 0;
        while (unprocessedItems.length > 0 && retries < maxRetries) {
            const params = {
                RequestItems: {
                    [tableName]: unprocessedItems,
                },
            };
            const response = yield documentClient.batchWrite(params).promise();
            unprocessedItems = [];
            if (response.UnprocessedItems && response.UnprocessedItems[tableName]) {
                unprocessedItems = response.UnprocessedItems[tableName];
                yield delay(50 * Math.pow(2, retries)); // Exponential backoff: 50ms, 100ms, 200ms, etc.
                retries++;
            }
        }
        return {
            successCount: batch.length - unprocessedItems.length,
            failureCount: unprocessedItems.length,
        };
    });
}
exports.default = addMigrationFlag;
