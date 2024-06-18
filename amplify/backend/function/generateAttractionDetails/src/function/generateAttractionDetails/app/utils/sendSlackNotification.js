"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSlackNotification = void 0;
const axios_1 = __importDefault(require("axios"));
async function sendSlackNotification(webhookUrl, text) {
    try {
        const response = await axios_1.default.post(webhookUrl, {
            text,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 200) {
            throw new Error(`Slack API request failed with status ${response.status}`);
        }
    }
    catch (error) {
        console.error('Error sending Slack notification:', error);
    }
}
exports.sendSlackNotification = sendSlackNotification;
