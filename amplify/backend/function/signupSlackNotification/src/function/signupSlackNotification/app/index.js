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
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const axios_1 = __importDefault(require("axios"));
const getSSMVariable_1 = require("./utils/getSSMVariable");
const ApiClient_1 = __importDefault(require("./utils/ApiClient"));
const getAllUsersPastDay_1 = __importDefault(require("./utils/getAllUsersPastDay"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // only run this function in production
    if (process.env.ENV !== 'prod')
        return;
    const SLACK_WEBHOOK_URL = yield getSSMVariable_1.getSSMVariable('SLACK_WEBHOOK_URL');
    if (!SLACK_WEBHOOK_URL) {
        throw new Error('Slack webhook URL not found');
    }
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            if (!((_a = record.dynamodb) === null || _a === void 0 ? void 0 : _a.NewImage))
                return;
            const newUser = util_dynamodb_1.unmarshall((_b = record.dynamodb) === null || _b === void 0 ? void 0 : _b.NewImage);
            // make an api request to users table to count the number of users who've joined today
            ApiClient_1.default.get().useIamAuth();
            const newUsersToday = yield getAllUsersPastDay_1.default();
            const newUsersTodayLength = (_c = newUsersToday === null || newUsersToday === void 0 ? void 0 : newUsersToday.length) !== null && _c !== void 0 ? _c : 0;
            // include the number of users who've joined today in the slack notification
            if (newUser.username) {
                // await sendSlackNotification(SLACK_WEBHOOK_URL, newUser.username)
                yield sendSlackNotification(SLACK_WEBHOOK_URL, `${newUser.name} joined! Sign up #${newUsersTodayLength} on the day.`);
            }
        }
    }
});
exports.handler = handler;
function sendSlackNotification(webhookUrl, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(webhookUrl, {
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
    });
}
