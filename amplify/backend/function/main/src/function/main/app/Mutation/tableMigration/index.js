"use strict";
// #####  #  ####  #    #     ####  ######
// #    # # #      #   #     #    # #
// #    # #  ####  ####      #    # #####
// #####  #      # #  #      #    # #
// #   #  # #    # #   #     #    # #
// #    # #  ####  #    #     ####  #
//
// #####    ##   #####   ##      #       ####   ####   ####
// #    #  #  #    #    #  #     #      #    # #      #
// #    # #    #   #   #    #    #      #    #  ####   ####
// #    # ######   #   ######    #      #    #      #      #
// #    # #    #   #   #    #    #      #    # #    # #    #
// #####  #    #   #   #    #    ######  ####   ####   ####
//
// USE WITH CAUTION!!!!
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
const aws_sdk_1 = require("aws-sdk");
const API_1 = require("shared-types/API");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const env_names_to_config_1 = require("../../utils/env-names-to-config");
const migrationUtils_1 = require("../../utils/migrationUtils");
const tableMigration = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { tableName: rawTableName, sourceEnv, targetEnv, operationType } = event.arguments.input;
    const tableName = rawTableName;
    console.log(`Migrating table ${JSON.stringify(tableName, null, 2)}`);
    const sourceTableConfig = env_names_to_config_1.envNamesToConfig[sourceEnv];
    const targetTableConfig = env_names_to_config_1.envNamesToConfig[targetEnv];
    // if the sourceEnv or targetEnv input var is not valid, throw an error
    if (!sourceTableConfig || !targetTableConfig) {
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
    const s3 = new aws_sdk_1.S3(globalDynamoDBOptions);
    const sourceTable = tableName + '-' + sourceTableConfig.tableSuffix;
    const targetTable = tableName + '-' + targetTableConfig.tableSuffix;
    console.log(`Source table: ${sourceTable}`);
    console.log(`Target table: ${targetTable}`);
    let filterDetails = {};
    if (tableName === migrationUtils_1.MigrationTableName.PHOTOGRAPHER) {
        filterDetails = {
            FilterExpression: '#pendingMigration = :pendingMigration',
            ExpressionAttributeNames: { '#pendingMigration': 'pendingMigration' },
            ExpressionAttributeValues: { ':pendingMigration': true },
        };
    }
    else if (tableName === migrationUtils_1.MigrationTableName.ATTRACTION) {
        // authorType === ADMIN alone should be sufficient, but we're being extra careful
        filterDetails = {
            FilterExpression: '#isTravaCreated = :isTravaCreated AND #authorType = :authorType AND attribute_not_exists(#authorId) AND #pendingMigration = :pendingMigration',
            ExpressionAttributeNames: {
                '#isTravaCreated': 'isTravaCreated',
                '#authorType': 'authorType',
                '#authorId': 'authorId',
                '#pendingMigration': 'pendingMigration',
            },
            ExpressionAttributeValues: {
                ':isTravaCreated': 1,
                ':authorType': API_1.AUTHOR_TYPE.ADMIN,
                ':pendingMigration': true,
            },
        };
    }
    else {
        filterDetails = {
            FilterExpression: '#isTravaCreated = :isTravaCreated AND #pendingMigration = :pendingMigration',
            ExpressionAttributeNames: { '#isTravaCreated': 'isTravaCreated', '#pendingMigration': 'pendingMigration' },
            ExpressionAttributeValues: {
                ':isTravaCreated': 1,
                ':pendingMigration': true,
            },
        };
    }
    console.log('filterDetails', JSON.stringify(filterDetails));
    const sourceTableItems = yield (0, migrationUtils_1.scanAll)(documentClient, sourceTable, filterDetails);
    console.log(`Retrieved ${sourceTableItems.length} items to process`);
    try {
        let tableMigrationResponse;
        switch (tableName) {
            case migrationUtils_1.MigrationTableName.PHOTOGRAPHER:
                tableMigrationResponse = yield (0, migrationUtils_1.processItemsInBatches)({
                    sourceTableItems,
                    processItem: migrationUtils_1.processItem,
                    transformItem: transformPhotographer,
                    tableName,
                    sourceTableConfig,
                    targetTableConfig,
                    documentClient,
                    operationType,
                    batchSize: 250,
                });
                break;
            case migrationUtils_1.MigrationTableName.DESTINATION:
                tableMigrationResponse = yield (0, migrationUtils_1.processItemsInBatches)({
                    sourceTableItems,
                    processItem: migrationUtils_1.processItem,
                    transformItem: transformDestination,
                    tableName,
                    sourceTableConfig,
                    targetTableConfig,
                    documentClient,
                    operationType,
                    batchSize: 250,
                    s3Instance: s3,
                });
                break;
            case migrationUtils_1.MigrationTableName.ATTRACTION:
                const bucketListCountDictionary = yield (0, migrationUtils_1.getBucketListCountDictionary)(documentClient, targetTableConfig.tableSuffix);
                // if generation exists, it must be in the GET_DETAILS step and have succeeded, so that we only migrate successfully generated attractions
                const sourceTableItemsToMigrate = sourceTableItems.filter((item) => !item.generation ||
                    (item.generation.step === API_1.GenerationStep.GET_DETAILS && item.generation.status === API_1.Status.SUCCEEDED));
                const sourceGooglePlaceLastUpdatedDictionary = yield (0, migrationUtils_1.getGooglePlaceLastUpdatedAtDictionary)(documentClient, sourceTableConfig.tableSuffix);
                const targetGooglePlaceLastUpdatedDictionary = yield (0, migrationUtils_1.getGooglePlaceLastUpdatedAtDictionary)(documentClient, targetTableConfig.tableSuffix);
                tableMigrationResponse = yield (0, migrationUtils_1.processItemsInBatches)({
                    sourceTableItems: sourceTableItemsToMigrate,
                    processItem: migrationUtils_1.processAttractionItem,
                    tableName,
                    sourceTableConfig: sourceTableConfig,
                    targetTableConfig: targetTableConfig,
                    documentClient,
                    bucketListCountDictionary,
                    operationType,
                    batchSize: 1,
                    sourceGooglePlaceLastUpdatedDictionary,
                    targetGooglePlaceLastUpdatedDictionary,
                    s3Instance: s3,
                });
                break;
            default:
                throw new Error('Table name not supported');
        }
        console.log(`table migration completed:\n\n${tableName} results: ${JSON.stringify(tableMigrationResponse, null, 2)}}`);
        return tableMigrationResponse;
    }
    catch (error) {
        if (!(error instanceof Error)) {
            throw new Error(`${lambdaErrors_1.TABLE_MIGRATION_FAILED}: error is not an instance of Error`);
        }
        // append context to the error message
        error.message = `\n${lambdaErrors_1.TABLE_MIGRATION_FAILED}: ${error.message}`;
        throw error;
    }
});
function transformPhotographer(item) {
    return item;
}
function transformDestination(item, bucketName) {
    var _a;
    if ((_a = item.coverImage) === null || _a === void 0 ? void 0 : _a.bucket) {
        item.coverImage.bucket = bucketName;
    }
    return item;
}
exports.default = tableMigration;
