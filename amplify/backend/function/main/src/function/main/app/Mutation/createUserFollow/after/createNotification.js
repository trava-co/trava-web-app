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
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
function create(notification) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCreateNotification,
            variables: {
                input: notification,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.createNotification;
    });
}
const createNotification = (event, userFollow) => __awaiter(void 0, void 0, void 0, function* () {
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        return null;
    }
    if (userFollow.approved) {
        yield create({
            showInApp: 1,
            receiverUserId: userFollow.followedUserId,
            senderUserId: event.identity.sub,
            type: API_1.NOTIFICATION_TYPE.NEW_FOLLOW,
        });
    }
    else {
        yield create({
            showInApp: 1,
            receiverUserId: userFollow.followedUserId,
            senderUserId: event.identity.sub,
            type: API_1.NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT,
        });
    }
    return null;
});
exports.default = createNotification;
