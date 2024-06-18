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
const initializeAdmin_1 = require("./initializeAdmin");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const getUserFcmToken_1 = __importDefault(require("./getUserFcmToken"));
const createMessage_1 = __importDefault(require("./createMessage"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (process.env.IS_ENABLED === 'true') {
        for (const record of event.Records) {
            if (record.eventName === 'INSERT') {
                try {
                    // https://stackoverflow.com/questions/57763991/initializeapp-when-adding-firebase-to-app-and-to-server
                    if (!firebase_admin_1.default.apps.length) {
                        yield initializeAdmin_1.initializeAdmin();
                    }
                    const notificationDynamoFormatted = (_a = record.dynamodb) === null || _a === void 0 ? void 0 : _a.NewImage;
                    if (!notificationDynamoFormatted)
                        return;
                    const notification = util_dynamodb_1.unmarshall(notificationDynamoFormatted);
                    const registrationToken = yield getUserFcmToken_1.default({ id: notification.receiverUserId });
                    if (!registrationToken)
                        return; // user turned off notifications
                    const message = yield createMessage_1.default(notification, registrationToken);
                    yield firebase_admin_1.default.messaging().send(message);
                    console.log(`Notification to: ${notification.receiverUserId} has been sent`);
                }
                catch (err) {
                    console.warn('Notification error', ((_b = record.dynamodb) === null || _b === void 0 ? void 0 : _b.NewImage) && util_dynamodb_1.unmarshall((_c = record.dynamodb) === null || _c === void 0 ? void 0 : _c.NewImage), err);
                    throw new Error(err);
                }
            }
            else {
                console.log(`notifications-lambda doesn't handle ${record.eventName} event`);
            }
        }
    }
    else
        console.log('Lambda notifications disabled');
});
exports.handler = handler;
