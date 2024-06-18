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
const API_1 = require("shared-types/API");
const getAllPaginatedData_1 = __importDefault(require("../../../utils/getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const CHUNK_SIZE = 25;
function _updateNotification(variables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaUpdateNotification,
            variables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.updateNotification;
    });
}
function _lambdaListNotificationsByReceiverUser(variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const notifications = [];
        yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const res = yield ApiClient_1.default.get().apiFetch({
                query: lambda_1.lambdaListNotificationsByReceiverUser,
                variables: Object.assign(Object.assign({}, variables), { limit: 100, nextToken }),
            });
            return {
                nextToken: (_a = res.data.listNotificationsByReceiverUser) === null || _a === void 0 ? void 0 : _a.nextToken,
                data: (_b = res.data.listNotificationsByReceiverUser) === null || _b === void 0 ? void 0 : _b.items,
            };
        }), (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((item) => {
                if (!item)
                    return;
                notifications.push(item);
            });
        });
        return notifications;
    });
}
const updateNotifications = (event, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    // trigger only when a user sets privacy to PUBLIC
    if ('privacy' in event.arguments.input && event.arguments.input.privacy === API_1.PRIVACY.PUBLIC) {
        const notifications = yield _lambdaListNotificationsByReceiverUser({ receiverUserId: user.id });
        const updateNotificationPromises = notifications
            .filter((notification) => notification.type === API_1.NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT)
            .map((notification) => _updateNotification({
            input: {
                id: notification.id,
                type: API_1.NOTIFICATION_TYPE.NEW_FOLLOW,
            },
        }));
        const chunks = (0, lodash_chunk_1.default)(updateNotificationPromises, CHUNK_SIZE);
        for (const chunkOfPromises of chunks) {
            yield Promise.all(chunkOfPromises);
        }
    }
    return null;
});
exports.default = updateNotifications;
