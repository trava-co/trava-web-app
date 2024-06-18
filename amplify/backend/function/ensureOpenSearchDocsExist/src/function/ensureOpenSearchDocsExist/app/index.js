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
exports.handler = void 0;
const dbClient_1 = require("./utils/dbClient");
const getAllAttractionIdsInDynamodb_1 = require("./utils/getAllAttractionIdsInDynamodb");
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const API_1 = require("shared-types/API");
const sendSlackMessage_1 = require("./utils/sendSlackMessage");
const BATCH_SIZE = 100;
// this lambda is triggered every day at 7am UTC
// it's job is to check dynamodb, check opensearch index, identify items missing in opensearch index that exist in dynamodb, and to make a trivial update to the dynamodb item to trigger the dynamodb stream, which is configured to call the opensearch streaming lambda, which will PUT the item to opensearch
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('ensureOpenSearchDocsExist started');
    const attractionTable = process.env.API_TRAVA_ATTRACTIONTABLE_NAME;
    if (!attractionTable) {
        throw new Error('source table name not found');
    }
    const [attractionIdsInDynamoDb, attractionIdsInOpenSearch] = yield Promise.all([
        getAllAttractionIdsInDynamodb_1.getAllAttractionIdsInDynamoDb(dbClient_1.dbClient, attractionTable, undefined),
        getAllAttractionIdsInOpenSearch(),
    ]);
    console.log(`attractionIdsInDynamoDb.size: ${attractionIdsInDynamoDb.size}`);
    console.log(`attractionIdsInOpenSearch.size: ${attractionIdsInOpenSearch.size}`);
    // for each attraction in dynamodb, check if it exists in open search. if not, use dbClient to PUT to dynamodb with updatedAt to now
    // updates to dynamodb Attraction table are captured by dynamodb stream, which is configured to trigger OpenSearch streaming lambda, which transforms the dynamodb item into an OpenSearch item and PUTs it to OpenSearch (see the transformation logic at amplify/backend/api/trava/override.ts)
    const idsToUpdate = [];
    for (let attractionIdInDynamoDb of attractionIdsInDynamoDb) {
        // check that it's present in opensearch set
        if (!attractionIdsInOpenSearch.has(attractionIdInDynamoDb)) {
            idsToUpdate.push(attractionIdInDynamoDb);
        }
    }
    console.log(`idsToUpdate.length: ${idsToUpdate.length}`);
    console.log(`updating these ids: ${idsToUpdate.join(', ')}`);
    const chunks = lodash_chunk_1.default(idsToUpdate, BATCH_SIZE);
    const now = new Date().toISOString();
    let totalSuccessCount = 0;
    let totalFailCount = 0;
    const idsFailedToUpdate = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`processing chunk ${i + 1} of ${chunks.length}`);
        const chunkIds = chunks[i];
        let successCount = 0;
        let failCount = 0;
        for (const id of chunkIds) {
            const updateParams = {
                TableName: attractionTable,
                Key: {
                    id,
                },
                UpdateExpression: 'SET updatedAt = :nowValue',
                ExpressionAttributeValues: {
                    ':nowValue': now,
                },
            };
            try {
                yield dbClient_1.dbClient.update(updateParams).promise();
                successCount++;
            }
            catch (error) {
                failCount++;
                idsFailedToUpdate.push(id);
                console.error('Error updating item to DynamoDB:', error);
            }
        }
        console.log(`for chunk ${i + 1}, successCount: ${successCount}, failCount: ${failCount}`);
        totalSuccessCount += successCount;
        totalFailCount += failCount;
    }
    console.log(`totalSuccessCount: ${totalSuccessCount}, totalFailCount: ${totalFailCount}`);
    const backendEnvs = [API_1.BACKEND_ENV_NAME.STAGING, API_1.BACKEND_ENV_NAME.PROD].map((env) => env.toLowerCase());
    const currentEnv = (_a = process.env.ENV) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (backendEnvs.includes(currentEnv)) {
        const itemsUpdated = (idsToUpdate === null || idsToUpdate === void 0 ? void 0 : idsToUpdate.length) || 0;
        // 4. send slack message with results
        const messageParts = [
            `OpenSearch Missing Documents Nightly Update ${currentEnv}:`,
            `- ${itemsUpdated} items in DynamoDB were missing from OpenSearch`,
        ];
        if (itemsUpdated > 0) {
            messageParts.push(`- ${totalSuccessCount} items successfully updated in DynamoDB`);
            messageParts.push(`- ${totalFailCount} items failed to update in DynamoDB`);
            messageParts.push('- See attached CSVs for IDs that were missing and attempted to be updated, and IDs that failed to update');
        }
        const message = messageParts.join('\n');
        yield sendSlackMessage_1.sendSlackMessage(message, idsToUpdate, idsFailedToUpdate, attractionIdsInDynamoDb, attractionIdsInOpenSearch);
    }
    console.log('ensureOpenSearchDocsExist finished');
});
exports.handler = handler;
const LIMIT_PER_OPENSEARCH_QUERY = 1000;
function getAllAttractionIdsInOpenSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const scrollDuration = '5m'; // keep the search context alive for 5 minutes
        let attractionIds = new Set();
        let scrollId;
        try {
            // Initial search request
            const initialResponse = yield ApiClient_1.default.get().openSearchScrollInit('attraction', {
                size: LIMIT_PER_OPENSEARCH_QUERY,
                query: { match_all: {} },
                _source: ['id'],
            }, scrollDuration);
            // Extract scroll ID from initial response
            // @ts-ignore
            scrollId = initialResponse._scroll_id;
            // @ts-ignore
            let hits = initialResponse.hits.hits;
            // log the length
            console.log(`initialResponse.hits.hits.length: ${hits.length}`);
            // Process initial batch of hits
            hits.forEach((hit) => attractionIds.add(hit._source.id));
            // Continue scrolling until no more hits are returned
            while (hits.length) {
                // Fetch next batch of hits
                const scrollResponse = yield ApiClient_1.default.get().openSearchScrollContinue(scrollId, scrollDuration);
                // Update scroll ID if necessary (usually not needed but included for completeness)
                // @ts-ignore
                scrollId = scrollResponse._scroll_id;
                // @ts-ignore
                hits = scrollResponse.hits.hits;
                // log the length
                console.log(`scrollResponse.hits.hits.length: ${hits.length}`);
                // Process hits
                hits.forEach((hit) => attractionIds.add(hit._source.id));
            }
        }
        catch (error) {
            console.error('Error fetching data from OpenSearch:', error);
        }
        finally {
            // Clear the scroll context when done
            if (scrollId) {
                yield ApiClient_1.default.get().openSearchScrollClear([scrollId]);
            }
        }
        return attractionIds;
    });
}
