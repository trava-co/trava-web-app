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
exports.sendSlackMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const getSSMVariable_1 = require("./getSSMVariable");
function sendSlackMessage(text, idsAttemptedToUpdate, idsFailedToUpdate, idsInDynamoDb, idsInOpenSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\ntext: ${text}, \nidsAttemptedToUpdate: ${idsAttemptedToUpdate}, \nidsFailedToUpdate: ${idsFailedToUpdate}`);
        const SLACK_TOKEN = yield getSSMVariable_1.getSSMVariable('SLACK_BOT_TOKEN');
        const CHANNEL_ID = 'C05T3S3JY6R'; // nightly-data-update channel
        if (!SLACK_TOKEN) {
            throw new Error('Slack bot token not found');
        }
        const fileIds = [];
        // If idsAttemptedToUpdate are provided, upload them as a .csv file
        if (idsAttemptedToUpdate && idsAttemptedToUpdate.length > 0) {
            const idsAttemptedToUpdateFileId = yield uploadIdsToSlack('idsAttemptedToUpdate', idsAttemptedToUpdate, SLACK_TOKEN, CHANNEL_ID);
            fileIds.push(idsAttemptedToUpdateFileId);
        }
        if (idsFailedToUpdate && idsFailedToUpdate.length > 0) {
            const idsFailedToUpdateFileId = yield uploadIdsToSlack('idsFailedToUpdate', idsFailedToUpdate, SLACK_TOKEN, CHANNEL_ID);
            fileIds.push(idsFailedToUpdateFileId);
        }
        // if either idsAttemptedToUpdate or idsFailedToUpdate are provided, upload idsInDynamoDb and idsInOpenSearch
        if ((idsAttemptedToUpdate === null || idsAttemptedToUpdate === void 0 ? void 0 : idsAttemptedToUpdate.length) || (idsFailedToUpdate === null || idsFailedToUpdate === void 0 ? void 0 : idsFailedToUpdate.length)) {
            const idsInDynamoDbFileId = yield uploadIdsToSlack('idsInDynamoDb', [...(idsInDynamoDb !== null && idsInDynamoDb !== void 0 ? idsInDynamoDb : [])], SLACK_TOKEN, CHANNEL_ID);
            fileIds.push(idsInDynamoDbFileId);
            const idsInOpenSearchFileId = yield uploadIdsToSlack('idsInOpenSearch', [...(idsInOpenSearch !== null && idsInOpenSearch !== void 0 ? idsInOpenSearch : [])], SLACK_TOKEN, CHANNEL_ID);
            fileIds.push(idsInOpenSearchFileId);
        }
        const attachments = fileIds.map((fileId) => ({ file_id: fileId }));
        const messageResponse = yield axios_1.default.post('https://slack.com/api/chat.postMessage', {
            channel: CHANNEL_ID,
            text,
            attachments,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SLACK_TOKEN}`,
            },
        });
        if (!messageResponse.data.ok) {
            throw new Error(`Failed to send Slack message: ${messageResponse.data.error}`);
        }
    });
}
exports.sendSlackMessage = sendSlackMessage;
function uploadIdsToSlack(prefix, ids, token, channelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvContent = `${prefix}\n` + ids.join('\n');
        const csvBuffer = Buffer.from(csvContent, 'utf8');
        const formData = new form_data_1.default();
        formData.append('token', token);
        formData.append('channels', channelId);
        formData.append('filename', `${prefix}.csv`);
        formData.append('filetype', 'csv');
        formData.append('file', csvBuffer, {
            filename: `${prefix}.csv`,
            contentType: 'text/csv',
        });
        const fileResponse = yield axios_1.default.post('https://slack.com/api/files.upload', formData, {
            headers: Object.assign({}, formData.getHeaders()),
        });
        if (!fileResponse.data.ok) {
            throw new Error(`Failed to upload file to Slack: ${fileResponse.data.error}`);
        }
        return fileResponse.data.file.id;
    });
}
