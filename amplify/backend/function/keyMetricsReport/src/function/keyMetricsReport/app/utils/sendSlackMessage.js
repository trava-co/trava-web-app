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
function sendSlackMessage({ text, newUsersCsv, userSessionsCsv, newAttractionSwipesCsv, newAttractionSwipesByDestinationCsv, attractionsCreatedByDestinationCsv, attractionsCreatedByUserCsv, itineraryFirstTimeViewsCsv, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`text: ${text}`);
        const SLACK_TOKEN = yield getSSMVariable_1.getSSMVariable('SLACK_BOT_TOKEN');
        const CHANNEL_ID = 'C06EZAKMK4M'; // key-metrics channel
        // Headers for CSV files
        const newUsersHeader = 'User ID, Username, Name, Email, Phone \n';
        const userSessionsHeader = 'Session ID, User ID, Username, Name, Email, Device, Version, Initial open time\n';
        const newAttractionSwipesHeader = 'User ID, Username, Name, Email, Swipe Count\n';
        const newAttractionSwipesByDestinationHeader = 'Destination ID, Destination Name, Swipe Count\n';
        const attractionsCreatedByDestinationCsvHeader = 'Destination ID, Destination Name, User Attractions Created, Admin Attractions Created\n';
        const userAttractionsHeader = 'User ID, Username, Name, Email, Created Attractions\n';
        const itineraryFirstTimeViewsHeader = 'User ID, Username, Name, Email, Trip ID, Destination ID, Destination Name, TripPlanViewedAt\n';
        // Combine headers with CSV content
        const newUsersCsvWithHeader = newUsersHeader + newUsersCsv;
        const userSessionsCsvWithHeader = userSessionsHeader + userSessionsCsv;
        const newAttractionSwipesCsvWithHeader = newAttractionSwipesHeader + newAttractionSwipesCsv;
        const newAttractionSwipesByDestinationCsvWithHeader = newAttractionSwipesByDestinationHeader + newAttractionSwipesByDestinationCsv;
        const attractionsCreatedByDestinationCsvWithHeader = attractionsCreatedByDestinationCsvHeader + attractionsCreatedByDestinationCsv;
        const attractionsCreatedByUserCsvWithHeader = userAttractionsHeader + attractionsCreatedByUserCsv;
        const itineraryFirstTimeViewsCsvWithHeader = itineraryFirstTimeViewsHeader + itineraryFirstTimeViewsCsv;
        // Filenames for each CSV file
        const filenames = [
            'new_user_ids.csv',
            'user_sessions.csv',
            'new_attraction_swipes.csv',
            'new_swipes_by_destination.csv',
            'new_attractions_by_destination.csv',
            'new_attractions_created_by_user.csv',
            'itinerary_view_user_ids.csv',
        ];
        const csvContents = [
            newUsersCsvWithHeader,
            userSessionsCsvWithHeader,
            newAttractionSwipesCsvWithHeader,
            newAttractionSwipesByDestinationCsvWithHeader,
            attractionsCreatedByDestinationCsvWithHeader,
            attractionsCreatedByUserCsvWithHeader,
            itineraryFirstTimeViewsCsvWithHeader,
        ];
        // Send initial message
        const messageResponse = yield axios_1.default.post('https://slack.com/api/chat.postMessage', {
            channel: CHANNEL_ID,
            text,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SLACK_TOKEN}`,
            },
        });
        if (!messageResponse.data.ok) {
            throw new Error(`Failed to send Slack message: ${messageResponse.data.error}`);
        }
        const threadTimestamp = messageResponse.data.ts;
        // Upload files in a thread
        for (let i = 0; i < csvContents.length; i++) {
            const fileContent = csvContents[i];
            if (fileContent) {
                const csvBuffer = Buffer.from(fileContent, 'utf8');
                const formData = new form_data_1.default();
                formData.append('token', SLACK_TOKEN);
                formData.append('channels', CHANNEL_ID);
                formData.append('thread_ts', threadTimestamp);
                formData.append('filename', filenames[i]);
                formData.append('filetype', 'csv');
                formData.append('file', csvBuffer, {
                    filename: filenames[i],
                    contentType: 'text/csv',
                });
                const fileResponse = yield axios_1.default.post('https://slack.com/api/files.upload', formData, {
                    headers: Object.assign({}, formData.getHeaders()),
                });
                if (!fileResponse.data.ok) {
                    throw new Error(`Failed to upload file to Slack: ${fileResponse.data.error}`);
                }
            }
        }
    });
}
exports.sendSlackMessage = sendSlackMessage;
