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
const getSSMVariable_1 = require("./getSSMVariable");
const form_data_1 = __importDefault(require("form-data"));
function sendSlackMessage(text, placeIds) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`text: ${text}, placeIds: ${placeIds}`);
        const SLACK_TOKEN = yield getSSMVariable_1.getSSMVariable('SLACK_BOT_TOKEN');
        const CHANNEL_ID = 'C05T3S3JY6R'; // google-places-nightly-update channel
        if (!SLACK_TOKEN) {
            throw new Error('Slack bot token not found');
        }
        let fileId;
        // If placeIds are provided, upload them as a .csv file
        if (placeIds && placeIds.length > 0) {
            const csvContent = 'Place ID\n' + placeIds.join('\n');
            const csvBuffer = Buffer.from(csvContent, 'utf8');
            const formData = new form_data_1.default();
            formData.append('token', SLACK_TOKEN);
            formData.append('channels', CHANNEL_ID);
            formData.append('filename', 'place_ids.csv');
            formData.append('filetype', 'csv');
            formData.append('file', csvBuffer, {
                filename: 'place_ids.csv',
                contentType: 'text/csv',
            });
            const fileResponse = yield axios_1.default.post('https://slack.com/api/files.upload', formData, {
                headers: Object.assign({}, formData.getHeaders()),
            });
            if (!fileResponse.data.ok) {
                throw new Error(`Failed to upload file to Slack: ${fileResponse.data.error}`);
            }
            fileId = fileResponse.data.file.id;
        }
        const attachments = fileId ? [{ file_id: fileId }] : [];
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
