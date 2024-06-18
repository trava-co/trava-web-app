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
exports.getAllGooglePlaceIdsFromAttractionLocations = exports.getGooglePlaceLastUpdatedAtDictionary = exports.getBucketListCountDictionary = exports.scanAll = exports.processAttractionItem = exports.processItem = exports.processItemsInBatches = exports.MigrateItemResult = exports.MigrationTableName = void 0;
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("./ApiClient/ApiClient"));
const retryWithExponentialBackoff_1 = require("./retryWithExponentialBackoff");
var MigrationTableName;
(function (MigrationTableName) {
    MigrationTableName["ATTRACTION"] = "Attraction";
    MigrationTableName["DESTINATION"] = "Destination";
    MigrationTableName["PHOTOGRAPHER"] = "Photographer";
})(MigrationTableName || (exports.MigrationTableName = MigrationTableName = {}));
const scanAll = (documentClient, tableName, filterDetails) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let items = [];
    let result = yield documentClient
        .scan(Object.assign({ TableName: tableName }, filterDetails))
        .promise();
    if ((_a = result === null || result === void 0 ? void 0 : result.Count) !== null && _a !== void 0 ? _a : 0 > 0)
        items = items.concat(result.Items);
    while (result.LastEvaluatedKey) {
        result = yield documentClient
            .scan(Object.assign({ TableName: tableName, ExclusiveStartKey: result.LastEvaluatedKey }, filterDetails))
            .promise();
        if ((_b = result === null || result === void 0 ? void 0 : result.Count) !== null && _b !== void 0 ? _b : 0 > 0)
            items = items.concat(result.Items);
    }
    console.log(`Found ${items.length} items: ${tableName}`);
    return items;
});
exports.scanAll = scanAll;
const scanFields = (documentClient, tableName, fieldNames, // Array of field names
filterDetails) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    // Returns an array of objects with generic types
    let items = [];
    let result = yield documentClient
        .scan(Object.assign({ TableName: tableName, ProjectionExpression: fieldNames.join(', ') }, filterDetails))
        .promise();
    if ((_c = result === null || result === void 0 ? void 0 : result.Count) !== null && _c !== void 0 ? _c : 0 > 0) {
        items = items.concat((_d = result.Items) !== null && _d !== void 0 ? _d : []);
    }
    while (result.LastEvaluatedKey) {
        result = yield documentClient
            .scan(Object.assign({ TableName: tableName, ExclusiveStartKey: result.LastEvaluatedKey, ProjectionExpression: fieldNames.join(', ') }, filterDetails))
            .promise();
        if ((_e = result === null || result === void 0 ? void 0 : result.Count) !== null && _e !== void 0 ? _e : 0 > 0) {
            items = items.concat((_f = result.Items) !== null && _f !== void 0 ? _f : []);
        }
    }
    console.log(`Found ${items.length} items in ${tableName}`);
    return items;
});
var MigrateItemResult;
(function (MigrateItemResult) {
    MigrateItemResult["SUCCESS"] = "success";
    MigrateItemResult["FAIL"] = "fail";
    MigrateItemResult["SKIPPED"] = "skipped";
    MigrateItemResult["REMAINING"] = "remaining";
})(MigrateItemResult || (exports.MigrateItemResult = MigrateItemResult = {}));
function processItem({ item, transformItem, tableName, targetTableConfig, documentClient, bucketListCountDictionary, operationType, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!transformItem) {
            throw new Error('transformItem is undefined');
        }
        const transformedItem = transformItem(item, targetTableConfig.bucketName, bucketListCountDictionary);
        const operationInsert = operationType === API_1.OPERATION_TYPE.INSERT;
        const targetTable = tableName + '-' + targetTableConfig.tableSuffix;
        try {
            yield documentClient
                .put(Object.assign({ TableName: targetTable, Item: transformedItem }, (operationInsert && { ConditionExpression: 'attribute_not_exists(id)' })))
                .promise();
            return MigrateItemResult.SUCCESS;
        }
        catch (error) {
            if (!(error instanceof Error)) {
                throw new Error('error is not an instance of Error');
            }
            // if the item already exists and we're doing an insert, skip it
            if (operationInsert && (error === null || error === void 0 ? void 0 : error.code) === 'ConditionalCheckFailedException') {
                return MigrateItemResult.SKIPPED;
            }
            else {
                // append info about the item to the error message
                error.message = `${error.message}\nOriginal item: ${JSON.stringify(item, null, 2)}\n Transformed item: ${JSON.stringify(transformedItem, null, 2)}`;
                throw error;
            }
        }
    });
}
exports.processItem = processItem;
/** mutates the attraction and returns it */
function transformAttraction(item, bucketName, bucketListCountDictionary) {
    var _a, _b;
    // 1. update the bucketListCount for each source attraction to have the correct value
    item.bucketListCount = (_a = bucketListCountDictionary[item.id]) !== null && _a !== void 0 ? _a : 0;
    // 2. update the bucket name for each image
    if ((_b = item.images) === null || _b === void 0 ? void 0 : _b.length) {
        item.images = item.images.map((image) => {
            if (image !== null) {
                return Object.assign(Object.assign({}, image), { bucket: bucketName });
            }
            else {
                return image;
            }
        });
    }
    return item;
}
function getAllGooglePlaceIdsFromAttractionLocations(locations) {
    const googlePlaceIdsOnSourceAttractionSet = new Set();
    const filteredLocations = locations.filter((location) => location !== null);
    for (let location of filteredLocations) {
        if (location.startLoc.googlePlaceId) {
            googlePlaceIdsOnSourceAttractionSet.add(location.startLoc.googlePlaceId);
        }
        if (location.endLoc.googlePlaceId) {
            googlePlaceIdsOnSourceAttractionSet.add(location.endLoc.googlePlaceId);
        }
    }
    const googlePlaceIdsOnSourceAttraction = Array.from(googlePlaceIdsOnSourceAttractionSet);
    return googlePlaceIdsOnSourceAttraction;
}
exports.getAllGooglePlaceIdsFromAttractionLocations = getAllGooglePlaceIdsFromAttractionLocations;
function processAttractionItem({ item, tableName, sourceTableConfig, targetTableConfig, documentClient, operationType, bucketListCountDictionary, sourceGooglePlaceLastUpdatedDictionary, targetGooglePlaceLastUpdatedDictionary, }) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!bucketListCountDictionary) {
            throw new Error(`bucketListCountDictionary is undefined for attraction ${item.id}`);
        }
        const { locations } = item;
        if (!locations) {
            throw new Error(`locations is undefined for attraction ${item.id}`);
        }
        // step 1: get all the googlePlaceIds on the source attraction
        const googlePlaceIdsOnSourceAttraction = getAllGooglePlaceIdsFromAttractionLocations(locations);
        // step 2: transform the attraction (mutative)
        const transformedItem = transformAttraction(item, targetTableConfig.bucketName, bucketListCountDictionary);
        // define some variables we'll need later
        const targetAttractionTableName = tableName + '-' + targetTableConfig.tableSuffix;
        const operationInsert = operationType === API_1.OPERATION_TYPE.INSERT;
        // define a function to copy over the attraction and googlePlaces in a transaction
        function copyAttractionAndGooglePlaces() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sourceGooglePlaceLastUpdatedDictionary || !targetGooglePlaceLastUpdatedDictionary) {
                    throw new Error('sourceGooglePlaceLastUpdatedDictionary or targetGooglePlaceLastUpdatedDictionary is undefined');
                }
                // put the target attraction and copy over all the GooglePlaces in a transaction, provided that the source googlePlace is newer than the target googlePlace
                // use the dictionaries to determine if the source googlePlace is newer than the target googlePlace, and if so, add it to the list of googlePlaces to copy over
                let googlePlaceIdsToCopyOver = [];
                for (let googlePlaceId of googlePlaceIdsOnSourceAttraction) {
                    const sourceGooglePlaceLastUpdatedAt = sourceGooglePlaceLastUpdatedDictionary[googlePlaceId];
                    const targetGooglePlaceLastUpdatedAt = targetGooglePlaceLastUpdatedDictionary[googlePlaceId];
                    if (!sourceGooglePlaceLastUpdatedAt) {
                        throw new Error('sourceGooglePlaceLastUpdatedAt is undefined');
                    }
                    if (!targetGooglePlaceLastUpdatedAt || sourceGooglePlaceLastUpdatedAt > targetGooglePlaceLastUpdatedAt) {
                        googlePlaceIdsToCopyOver.push(googlePlaceId);
                    }
                }
                console.log(`copyAttractionAndGooglePlaces: googlePlaceIdsToCopyOver: ${JSON.stringify(googlePlaceIdsToCopyOver)}`);
                // assemble the list of googlePlaces to copy over
                let googlePlacesToCopyOver = [];
                for (let googlePlaceId of googlePlaceIdsToCopyOver) {
                    const googlePlace = yield documentClient
                        .get({
                        TableName: 'GooglePlace-' + sourceTableConfig.tableSuffix,
                        Key: {
                            id: googlePlaceId,
                        },
                    })
                        .promise();
                    if (!googlePlace.Item) {
                        throw new Error('googlePlace.Item is undefined');
                    }
                    googlePlacesToCopyOver.push(googlePlace.Item);
                }
                // copy over the attraction and googlePlaces in a transaction
                const transaction = {
                    TransactItems: [
                        {
                            Put: {
                                TableName: targetAttractionTableName,
                                Item: transformedItem,
                            },
                        },
                        ...googlePlacesToCopyOver.map((googlePlace) => ({
                            Put: {
                                TableName: 'GooglePlace-' + targetTableConfig.tableSuffix,
                                Item: googlePlace,
                            },
                        })),
                    ],
                };
                yield documentClient.transactWrite(transaction).promise();
            });
        }
        // step 3: query target attraction table w/ attractionId
        const { Item: targetTableAttraction } = yield documentClient
            .get({
            TableName: targetAttractionTableName,
            Key: {
                id: item.id,
            },
        })
            .promise();
        try {
            if (targetTableAttraction) {
                console.log('targetTableAttraction exists');
                // attraction found in target table with matching attraction id, so if operationType is INSERT, skip this. Else, copy over.
                if (operationInsert) {
                    console.log('operation type is INSERT, so skip');
                    return MigrateItemResult.SKIPPED;
                }
                else {
                    console.log('operation type is PUT, so copy over');
                    // operation type is PUT, so copy over
                    yield copyAttractionAndGooglePlaces();
                    console.log('copied over attraction and googlePlaces: SUCCESS');
                    return MigrateItemResult.SUCCESS;
                }
            }
            else {
                // no attraction found in target table with matching attraction id
                console.log('targetTableAttraction does not exist');
                // query opensearch target attraction index with current attraction's googlePlaceIds, filtered by isTravaCreated === 1
                // only want to override user created attractions (isTravaCreated === 0)
                // if this returns any hits, then skip this attraction, to ensure we don't create two trava attractions for the same googlePlaceId in target env. if no hits, call copyAttractionAndGooglePlaces()
                // first, determine the openSearchUrl
                const targetOpenSearchUrl = targetTableConfig.openSearchUrl;
                console.log(`targetOpenSearchUrl: ${targetOpenSearchUrl}`);
                if (!targetOpenSearchUrl) {
                    throw new Error('targetOpenSearchUrl is undefined');
                }
                const matchingAttractionsInTargetEnvOSQuery = createOpenSearchQuery({
                    googlePlaceIds: googlePlaceIdsOnSourceAttraction,
                });
                const matchingAttractionsInTargetEnv = yield (0, retryWithExponentialBackoff_1.retryWithExponentialBackoff)({
                    func: () => ApiClient_1.default.get()
                        .useIamAuth()
                        .openSearchFetch('attraction', matchingAttractionsInTargetEnvOSQuery, targetOpenSearchUrl),
                    maxRetries: 4,
                });
                console.log(`matchingAttractionsInTargetEnv: ${JSON.stringify(matchingAttractionsInTargetEnv, null, 2)}`);
                // check the total hits
                // @ts-ignore
                const numMatchedAttractions = (_b = (_a = matchingAttractionsInTargetEnv === null || matchingAttractionsInTargetEnv === void 0 ? void 0 : matchingAttractionsInTargetEnv.hits) === null || _a === void 0 ? void 0 : _a.total) === null || _b === void 0 ? void 0 : _b.value;
                if (numMatchedAttractions === 0) {
                    console.log('no isTravaCreated attractions found in opensearch, so copy over the attraction and googlePlaces');
                    yield copyAttractionAndGooglePlaces();
                    console.log('copied over attraction and googlePlaces: SUCCESS');
                    return MigrateItemResult.SUCCESS;
                }
                else {
                    console.log(`${numMatchedAttractions} attractions with isTravaCreated = 1 exists in opensearch`);
                    // filter for attractions with authorType === AUTHOR_TYPE.USER. let's update these to have AUTHOR_TYPE.ADMIN.
                    // @ts-ignore
                    const matchingAttractionsInTargetEnvWithAuthorTypeUser = matchingAttractionsInTargetEnv.hits.hits
                        .filter((attraction) => attraction._source.authorType === API_1.AUTHOR_TYPE.USER)
                        .map((attraction) => attraction._source.id);
                    const numMatchingAttractionsInTargetEnvWithAuthorTypeUser = matchingAttractionsInTargetEnvWithAuthorTypeUser.length;
                    const numMatchingAttractionsInTargetEnvWithAuthorTypeAdmin = numMatchedAttractions - numMatchingAttractionsInTargetEnvWithAuthorTypeUser;
                    // if there already exists an admin attraction in target env, skip
                    if (numMatchingAttractionsInTargetEnvWithAuthorTypeAdmin > 0) {
                        console.log('already exists an attraction in target env with authorType = AUTHOR_TYPE.ADMIN, so skip');
                        return MigrateItemResult.SKIPPED;
                    }
                    // if we get here, then there are no admin attractions in target env with same googlePlaceId, and there's >= 1 user generated attractions, so we should update the first one to have authorType = AUTHOR_TYPE.ADMIN and remove authorId
                    // recall, these have isTravaCreated = 1, so if they also have authorType = AUTHOR_TYPE.USER, then they are user generated attractions
                    // we don't guarantee any ties back to the user for user generated attractions
                    const attractionId = matchingAttractionsInTargetEnvWithAuthorTypeUser[0];
                    console.log(`updating attraction ${attractionId} to have authorType = AUTHOR_TYPE.ADMIN`);
                    yield documentClient
                        .update({
                        TableName: targetAttractionTableName,
                        Key: {
                            id: attractionId,
                        },
                        UpdateExpression: 'SET authorType = :authorType REMOVE authorId',
                        ExpressionAttributeValues: {
                            ':authorType': API_1.AUTHOR_TYPE.ADMIN,
                        },
                    })
                        .promise();
                    return MigrateItemResult.SUCCESS;
                }
            }
        }
        catch (error) {
            if (!(error instanceof Error)) {
                throw new Error('error is not an instance of Error');
            }
            // append info about the item to the error message
            error.message = `${error.message}\nOriginal item: ${JSON.stringify(item, null, 2)}\n Transformed item: ${JSON.stringify(transformedItem, null, 2)}`;
            throw error;
        }
    });
}
exports.processAttractionItem = processAttractionItem;
function processItemsInBatches({ sourceTableItems, processItem, transformItem, tableName, sourceTableConfig, targetTableConfig, documentClient, bucketListCountDictionary, operationType, batchSize, sourceGooglePlaceLastUpdatedDictionary, targetGooglePlaceLastUpdatedDictionary, s3Instance, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const batches = (0, lodash_chunk_1.default)(sourceTableItems, batchSize);
        console.log(`process items in batches: ${batches.length} batches`);
        let dataMigrationResultTracker = {
            __typename: 'MigrationResult',
            [MigrateItemResult.SUCCESS]: 0,
            [MigrateItemResult.FAIL]: 0,
            [MigrateItemResult.SKIPPED]: 0,
            [MigrateItemResult.REMAINING]: sourceTableItems.length,
        };
        let imageMigrationResultTracker = {
            __typename: 'MigrationResult',
            [MigrateItemResult.SUCCESS]: 0,
            [MigrateItemResult.FAIL]: 0,
            [MigrateItemResult.SKIPPED]: 0,
            [MigrateItemResult.REMAINING]: sourceTableItems.length,
        };
        const startTime = Date.now();
        const timeout = 10 * 60 * 1000; // 10 minutes in ms
        for (const batch of batches) {
            // Check if the timeout has been reached before processing the next batch
            if (Date.now() - startTime > timeout) {
                console.log('Timeout reached. Exiting batch processing.');
                break;
            }
            const results = yield Promise.allSettled(batch.map((item) => __awaiter(this, void 0, void 0, function* () {
                // remove pendingMigration from this item using dbClient
                if (item.pendingMigration !== undefined) {
                    console.log(`removing pendingMigration field from ${tableName} ${item.id}`);
                    try {
                        yield documentClient
                            .update({
                            TableName: tableName + '-' + sourceTableConfig.tableSuffix,
                            Key: {
                                id: item.id,
                            },
                            UpdateExpression: 'REMOVE pendingMigration',
                        })
                            .promise();
                    }
                    catch (error) {
                        throw new Error(`error removing pendingMigration field from attraction ${item.id}. error: ${error.message}`);
                    }
                    // delete pendingMigration from item
                    delete item.pendingMigration;
                }
                console.log(`processing item ${item.id}`);
                // 1. Photo migration operation (if applicable)
                // must handle photo migration first, because item migration may mutate the item to point to different images
                const imagesToProcess = getImagesToProcess(tableName, item);
                const numImagesToProcess = imagesToProcess.length;
                let photoMigrationPromises = [];
                if (numImagesToProcess > 0) {
                    console.log(`processing ${numImagesToProcess} images for item ${item.id}`);
                    if (!s3Instance) {
                        throw new Error('s3Instance is undefined');
                    }
                    photoMigrationPromises = imagesToProcess.map((image) => addImageToTargetBucketIfNotExists({
                        image,
                        targetBucket: targetTableConfig.bucketName,
                        s3: s3Instance,
                    }));
                }
                // 2. Data migration operation
                const dataMigrationPromise = processItem({
                    item,
                    transformItem,
                    tableName,
                    sourceTableConfig,
                    targetTableConfig,
                    documentClient,
                    bucketListCountDictionary,
                    operationType,
                    sourceGooglePlaceLastUpdatedDictionary,
                    targetGooglePlaceLastUpdatedDictionary,
                });
                // Wait for both data migration and photo migration to complete
                const [dataMigrationResult, ...photoMigrationResults] = yield Promise.allSettled([
                    dataMigrationPromise,
                    ...photoMigrationPromises,
                ]);
                return { id: item.id, dataMigrationResult, photoMigrationResults };
            })));
            // tabulate results for this batch
            results.forEach((result) => {
                dataMigrationResultTracker[MigrateItemResult.REMAINING]--;
                imageMigrationResultTracker[MigrateItemResult.REMAINING]--;
                if (result.status === 'fulfilled') {
                    // access the dataMigrationResult and photoMigrationResults
                    const { id, dataMigrationResult, photoMigrationResults } = result.value;
                    // check if dataMigrationResult is fulfilled
                    if (dataMigrationResult.status === 'fulfilled') {
                        dataMigrationResultTracker[dataMigrationResult.value]++;
                    }
                    else {
                        console.error(`error migrating data for item with id: ${id}. \n error: ${JSON.stringify(dataMigrationResult.reason, null, 2)}`);
                        dataMigrationResultTracker[MigrateItemResult.FAIL]++;
                    }
                    // if any of the photoMigrationResults are rejected, then consider the photo migration for this item to have failed
                    const failedPhotoMigrationResults = photoMigrationResults.filter((photoMigrationResult) => photoMigrationResult.status === 'rejected');
                    if (failedPhotoMigrationResults.length) {
                        console.error(`Photo migration failed for item with id: ${id}. \n error: ${JSON.stringify(failedPhotoMigrationResults, null, 2)}`);
                        imageMigrationResultTracker[MigrateItemResult.FAIL]++;
                    }
                    // if every photoMigrationResult is fulfilled with value of SKIPPED, then consider the photo migration for this item to have been skipped
                    else if (photoMigrationResults.every((photoMigrationResult) => photoMigrationResult.status === 'fulfilled' && photoMigrationResult.value === MigrateItemResult.SKIPPED)) {
                        imageMigrationResultTracker[MigrateItemResult.SKIPPED]++;
                    }
                    // if every photoMigrationResult is fulfilled with value of SUCCESS, then consider the photo migration for this item to have succeeded
                    else if (photoMigrationResults.every((photoMigrationResult) => photoMigrationResult.status === 'fulfilled' && photoMigrationResult.value === MigrateItemResult.SUCCESS)) {
                        imageMigrationResultTracker[MigrateItemResult.SUCCESS]++;
                    }
                }
                else {
                    console.error('somehow, result.status containing both dataMigrationResult and photoMigrationResults rejected');
                    console.error(`${JSON.stringify(result.reason, null, 2)}. reason: ${result.reason}`);
                    dataMigrationResultTracker[MigrateItemResult.FAIL]++;
                    imageMigrationResultTracker[MigrateItemResult.FAIL]++;
                }
            });
            console.log(`Processed batch containing ${batch.length} item(s)`);
            console.log(`Batch results for dataMigration: ${JSON.stringify(dataMigrationResultTracker, null, 2)}`);
            console.log(`Batch results for imageMigration: ${JSON.stringify(imageMigrationResultTracker, null, 2)}`);
            if (batchSize > 50) {
                // sleep for a half second to avoid throttling
                yield new Promise((resolve) => setTimeout(resolve, 500));
            }
        }
        return {
            __typename: 'TableMigrationResponse',
            mainTableResult: dataMigrationResultTracker,
            imageResult: imageMigrationResultTracker,
        };
    });
}
exports.processItemsInBatches = processItemsInBatches;
function getImagesToProcess(tableName, item) {
    var _a, _b;
    if (tableName === MigrationTableName.ATTRACTION) {
        const attractionItem = item;
        const validImagesToProcess = ((_a = attractionItem.images) !== null && _a !== void 0 ? _a : []).filter((image) => Boolean((image === null || image === void 0 ? void 0 : image.bucket) && (image === null || image === void 0 ? void 0 : image.key)));
        return validImagesToProcess;
    }
    else if (tableName === MigrationTableName.DESTINATION) {
        const destinationItem = item;
        const validImagesToProcess = ((_b = [destinationItem.coverImage]) !== null && _b !== void 0 ? _b : []).filter((image) => Boolean((image === null || image === void 0 ? void 0 : image.bucket) && (image === null || image === void 0 ? void 0 : image.key)));
        return validImagesToProcess;
    }
    else {
        // return empty array for other entities which don't have photos
        return [];
    }
}
// Helper function for S3 operations
function addImageToTargetBucketIfNotExists({ image, targetBucket, s3, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(image === null || image === void 0 ? void 0 : image.bucket) || !(image === null || image === void 0 ? void 0 : image.key)) {
            const message = `Image is missing bucket or key: ${JSON.stringify(image)}`;
            console.error(message);
            throw new Error(message);
        }
        const sourceParams = {
            Bucket: image.bucket,
            Key: `public/${image.key}`,
        };
        const targetParams = {
            Bucket: targetBucket,
            Key: `public/${image.key}`,
        };
        try {
            yield s3.headObject(targetParams).promise();
            // console.log('Image already exists, skipping')
            return MigrateItemResult.SKIPPED;
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.code) === 'NotFound') {
                // console.log("Target image doesn't exist, copying from source")
                const copyParams = Object.assign({ CopySource: `${sourceParams.Bucket}/${sourceParams.Key}` }, targetParams);
                // console.log(`copyParams: ${JSON.stringify(copyParams, null, 2)}`)
                yield s3.copyObject(copyParams).promise();
                // console.log('Image copied successfully, path: ', targetParams.Key)
                return MigrateItemResult.SUCCESS;
            }
            console.error(`error: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    });
}
const getBucketListCountDictionary = (documentClient, tableSuffix) => __awaiter(void 0, void 0, void 0, function* () {
    const userAttractionTableName = `UserAttraction-${tableSuffix}`;
    let userAttractions = yield scanFields(documentClient, userAttractionTableName, ['attractionId']);
    // compute a dictionary of attractionId -> bucketListCount by iterating over userAttractions
    // and incrementing the bucketListCount for each attractionId
    const bucketListCountDictionary = userAttractions.reduce((acc, userAttraction) => {
        var _a;
        const attractionId = userAttraction.attractionId;
        const bucketListCount = (_a = acc[attractionId]) !== null && _a !== void 0 ? _a : 0;
        acc[attractionId] = bucketListCount + 1;
        return acc;
    }, {});
    return bucketListCountDictionary;
});
exports.getBucketListCountDictionary = getBucketListCountDictionary;
const getGooglePlaceLastUpdatedAtDictionary = (documentClient, tableSuffix) => __awaiter(void 0, void 0, void 0, function* () {
    const googlePlaceTableName = `GooglePlace-${tableSuffix}`;
    let googlePlaces = yield scanFields(documentClient, googlePlaceTableName, ['id', 'dataLastUpdatedAt']);
    const googlePlaceLastUpdatedAtDictionary = {};
    googlePlaces.forEach((googlePlace) => {
        if (googlePlace.dataLastUpdatedAt) {
            googlePlaceLastUpdatedAtDictionary[googlePlace.id] = googlePlace.dataLastUpdatedAt;
        }
    });
    return googlePlaceLastUpdatedAtDictionary;
});
exports.getGooglePlaceLastUpdatedAtDictionary = getGooglePlaceLastUpdatedAtDictionary;
const createOpenSearchQuery = ({ googlePlaceIds }) => {
    const mustNotConditions = [
        {
            exists: {
                field: 'deletedAt',
            },
        },
    ];
    const filterConditions = [
        {
            terms: {
                googlePlaceIds,
            },
        },
        {
            term: {
                isTravaCreated: 1,
            },
        },
    ];
    const query = {
        bool: {
            filter: filterConditions,
            must_not: mustNotConditions,
        },
    };
    return {
        _source: {
            includes: ['id', 'authorType'],
        },
        size: 25,
        query,
    };
};
