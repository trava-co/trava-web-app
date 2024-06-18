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
exports.migrateSingleAttraction = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const aws_sdk_1 = require("aws-sdk");
const API_1 = require("shared-types/API");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const env_names_to_config_1 = require("../../utils/env-names-to-config");
const migrationUtils_1 = require("../../utils/migrationUtils");
const migrateSingleAttraction = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    console.log(`starting migrateSingleAttraction:`);
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.MIGRATE_SINGLE_ATTRACTION_NOT_AUTHORIZED);
    }
    if (!('claims' in event.identity &&
        'cognito:groups' in event.identity.claims &&
        event.identity.claims['cognito:groups'].includes('admin'))) {
        throw new Error(lambdaErrors_1.MIGRATE_SINGLE_ATTRACTION_NOT_AUTHORIZED);
    }
    console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`);
    if (!(event.arguments && 'input' in event.arguments)) {
        throw new Error(lambdaErrors_1.MIGRATE_SINGLE_ATTRACTION_INVALID_INPUT);
    }
    const { sourceEnv, targetEnv, attractionId } = event.arguments.input;
    // if sourceEnv is not BACKEND_ENV_NAME.STAGING or BACKEND_ENV_NAME.PROD, throw an error
    if (sourceEnv !== API_1.BACKEND_ENV_NAME.STAGING || targetEnv !== API_1.BACKEND_ENV_NAME.PROD) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_INVALID_ENV);
    }
    const sourceTableConfig = env_names_to_config_1.envNamesToConfig[sourceEnv];
    const targetTableConfig = env_names_to_config_1.envNamesToConfig[targetEnv];
    // if the sourceEnv or targetEnv input var is not valid, throw an error
    if (!sourceTableConfig || !targetTableConfig) {
        throw new Error(lambdaErrors_1.TABLE_MIGRATION_INVALID_ENV);
    }
    const sourceTable = 'Attraction' + '-' + sourceTableConfig.tableSuffix;
    const targetTable = 'Attraction' + '-' + targetTableConfig.tableSuffix;
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
    console.log(`Source table: ${sourceTable} -> Target table: ${targetTable}`);
    let result;
    try {
        // query source table with attractionId
        result = yield documentClient
            .query({
            TableName: sourceTable,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': attractionId,
            },
        })
            .promise();
    }
    catch (error) {
        console.error('error querying source table');
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
    console.log(`Found ${(_a = result.Items) === null || _a === void 0 ? void 0 : _a.length} item(s) in source table ${sourceTable}: \n${JSON.stringify(result.Items, null, 2)}`);
    const sourceTableItems = result.Items;
    if (!(sourceTableItems === null || sourceTableItems === void 0 ? void 0 : sourceTableItems.length)) {
        throw new Error(`No attraction found with id ${attractionId}`);
    }
    const attraction = sourceTableItems[0];
    // if attraction has authorType USER, throw an error
    if (attraction.authorType === API_1.AUTHOR_TYPE.USER) {
        throw new Error(`Attraction with id ${attractionId} has authorType ${API_1.AUTHOR_TYPE.USER}. Must not migrate.`);
    }
    try {
        // query the target UserAttraction table's secondary index (attractionId), and get the count of the attractionId
        const userAttractionTableName = `UserAttraction-${targetTableConfig.tableSuffix}`;
        const result = yield documentClient
            .query({
            TableName: userAttractionTableName,
            IndexName: 'byAttraction',
            KeyConditionExpression: 'attractionId = :attractionId',
            ExpressionAttributeValues: {
                ':attractionId': attractionId,
            },
            ProjectionExpression: 'attractionId',
        })
            .promise();
        console.log(`Found ${(_b = result.Count) !== null && _b !== void 0 ? _b : 0} UserAttraction items in target table ${targetTable}`);
        const bucketListCountDictionary = {
            [attractionId]: (_c = result.Count) !== null && _c !== void 0 ? _c : 0,
        };
        // get the google places associated with the source attraction locations
        const locations = attraction.locations;
        const googlePlaceIds = (0, migrationUtils_1.getAllGooglePlaceIdsFromAttractionLocations)(locations);
        // for each googlePlaceId, query the sourceGooglePlaceTable for the googlePlace, and build up targetEnvPlaceLastUpdatedDictionary
        const sourceGooglePlaceLastUpdatedDictionary = {};
        let targetGooglePlaceLastUpdatedDictionary = {};
        const sourceGooglePlaceTable = 'GooglePlace-' + sourceTableConfig.tableSuffix;
        for (const googlePlaceId of googlePlaceIds) {
            const sourceGooglePlaces = yield documentClient
                .query({
                TableName: sourceGooglePlaceTable,
                KeyConditionExpression: 'id = :id',
                ExpressionAttributeValues: {
                    ':id': googlePlaceId,
                },
                ProjectionExpression: 'id, dataLastUpdatedAt',
            })
                .promise();
            const sourceGooglePlaceItem = (_d = sourceGooglePlaces === null || sourceGooglePlaces === void 0 ? void 0 : sourceGooglePlaces.Items) === null || _d === void 0 ? void 0 : _d[0];
            if (!sourceGooglePlaceItem) {
                throw new Error(`No google place found with id ${googlePlaceId}`);
            }
            if (!sourceGooglePlaceItem.dataLastUpdatedAt) {
                throw new Error(`No dataLastUpdatedAt found for google place with id ${googlePlaceId}`);
            }
            sourceGooglePlaceLastUpdatedDictionary[googlePlaceId] = sourceGooglePlaceItem.dataLastUpdatedAt;
            const targetGooglePlaceTable = 'GooglePlace-' + targetTableConfig.tableSuffix;
            // query the target GooglePlace table by googlePlaceId to build up the targetEnvPlaceLastUpdatedDictionary
            const targetGooglePlaces = yield documentClient
                .query({
                TableName: targetGooglePlaceTable,
                KeyConditionExpression: 'id = :id',
                ExpressionAttributeValues: {
                    ':id': googlePlaceId,
                },
                ProjectionExpression: 'id, dataLastUpdatedAt',
            })
                .promise();
            console.log(`Found ${(_e = targetGooglePlaces.Items) === null || _e === void 0 ? void 0 : _e.length} google places in target table for googlePlaceId ${googlePlaceId}`);
            const targetGooglePlace = (_f = targetGooglePlaces === null || targetGooglePlaces === void 0 ? void 0 : targetGooglePlaces.Items) === null || _f === void 0 ? void 0 : _f[0];
            if (targetGooglePlace === null || targetGooglePlace === void 0 ? void 0 : targetGooglePlace.dataLastUpdatedAt) {
                targetGooglePlaceLastUpdatedDictionary[googlePlaceId] = targetGooglePlace.dataLastUpdatedAt;
            }
        }
        const s3 = new aws_sdk_1.S3(globalDynamoDBOptions);
        const tableMigrationResponse = yield (0, migrationUtils_1.processItemsInBatches)({
            sourceTableItems,
            processItem: migrationUtils_1.processAttractionItem,
            tableName: migrationUtils_1.MigrationTableName.ATTRACTION,
            sourceTableConfig: sourceTableConfig,
            targetTableConfig: targetTableConfig,
            documentClient,
            bucketListCountDictionary,
            operationType: API_1.OPERATION_TYPE.PUT,
            batchSize: 1,
            sourceGooglePlaceLastUpdatedDictionary,
            targetGooglePlaceLastUpdatedDictionary,
            s3Instance: s3,
        });
        console.log(`tableMigrationResponse: ${JSON.stringify(tableMigrationResponse, null, 2)}`);
        return tableMigrationResponse;
    }
    catch (error) {
        if (!(error instanceof Error)) {
            throw new Error(`${lambdaErrors_1.MIGRATE_SINGLE_ATTRACTION_FAILED}: error is not an instance of Error`);
        }
        // append context to the error message
        error.message = `\n${lambdaErrors_1.MIGRATE_SINGLE_ATTRACTION_FAILED}: ${error.message}`;
        throw error;
    }
});
exports.migrateSingleAttraction = migrateSingleAttraction;
exports.default = exports.migrateSingleAttraction;
