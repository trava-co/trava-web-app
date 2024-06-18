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
const apiClient_1 = __importDefault(require("./utils/apiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
var navigators;
(function (navigators) {
    navigators["NOTIFICATIONS_NAVIGATOR"] = "NOTIFICATIONS_NAVIGATOR";
    navigators["TRIP_TABS_NAVIGATOR"] = "TRIP_TABS_NAVIGATOR";
})(navigators || (navigators = {}));
var screens;
(function (screens) {
    screens["LIST"] = "LIST";
    screens["CHAT"] = "CHAT";
})(screens || (screens = {}));
const getNotificationContent = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    let navigator = navigators.NOTIFICATIONS_NAVIGATOR;
    let screen = screens.LIST;
    let params;
    // fallback
    let title = 'Trava';
    let body = "Tap to see what's new...";
    let user;
    let trip;
    let attraction;
    let comment;
    // similar to frontend /app/mutations/createBasecampSystemMessage.ts but title and messages are slightly different
    switch (notification.type) {
        case API_1.NOTIFICATION_TYPE.JOIN_TRIP:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) has joined ${trip === null || trip === void 0 ? void 0 : trip.name}. Say hi!`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.CREATE_CALENDAR:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${notification.text}. Check it out!`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.EDIT_CALENDAR:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${notification.text}. View the new itinerary.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.EDIT_DATES:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} edited the dates for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.RENAME_TRIP:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} edited the name of your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.ADD_DESTINATION:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} edited the destinations for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.REMOVE_DESTINATION:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} edited the destinations for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.ADD_FLIGHT:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} added a flight reservation for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.ADD_LODGING:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} added a lodging reservation for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.ADD_CAR_RENTAL:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.username} added a car rental reservation for your trip.`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        case API_1.NOTIFICATION_TYPE.USER_MESSAGE:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = `${user === null || user === void 0 ? void 0 : user.name}: ${notification.text || 'new photo'}`;
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        // not specified
        case API_1.NOTIFICATION_TYPE.RECALCULATE_CALENDAR:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            title = `${trip === null || trip === void 0 ? void 0 : trip.name}`;
            body = notification.text || '';
            navigator = navigators.TRIP_TABS_NAVIGATOR;
            screen = screens.CHAT;
            params = { tripId: notification.tripId };
            break;
        // social
        case API_1.NOTIFICATION_TYPE.NEW_FOLLOW:
            user = yield getUserData(notification.senderUserId);
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) started following you`;
            break;
        case API_1.NOTIFICATION_TYPE.TRIP_INVITATION_SENT:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) invited you to a new trip: ${trip === null || trip === void 0 ? void 0 : trip.name}`;
            break;
        case API_1.NOTIFICATION_TYPE.TRIP_INVITATION_ACCEPTED:
            if (!notification.tripId) {
                throw new Error('no tripId');
            }
            user = yield getUserData(notification.senderUserId);
            trip = yield getTripData(notification.tripId);
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) accepted your ${trip === null || trip === void 0 ? void 0 : trip.name} trip invitation.`;
            break;
        case API_1.NOTIFICATION_TYPE.FOLLOW_REQUEST_ACCEPTED:
            user = yield getUserData(notification.senderUserId);
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) accepted your follow request. Now you can see their posts, bucket list, and created cards.`;
            break;
        case API_1.NOTIFICATION_TYPE.FOLLOW_REQUEST_SENT:
            user = yield getUserData(notification.senderUserId);
            body = `${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.username}) is requesting to follow you.`;
            break;
        case API_1.NOTIFICATION_TYPE.BUCKET_LIST_ATTRACTION:
            if (!notification.attractionId) {
                throw new Error('no attractionId');
            }
            user = yield getUserData(notification.senderUserId);
            attraction = yield getAttractionData(notification.attractionId);
            body = `${user === null || user === void 0 ? void 0 : user.username} bucketlisted your activity: ${attraction === null || attraction === void 0 ? void 0 : attraction.name}.`;
            break;
        case API_1.NOTIFICATION_TYPE.COMMENT_POST:
            if (!notification.commentId || !notification.postId) {
                throw new Error('no commentId or postId');
            }
            user = yield getUserData(notification.senderUserId);
            comment = yield getCommentData(notification.commentId);
            body = `${user === null || user === void 0 ? void 0 : user.username} commented on your post: "${comment === null || comment === void 0 ? void 0 : comment.text}"`;
            break;
        case API_1.NOTIFICATION_TYPE.LIKE_POST:
            if (!notification.postId) {
                throw new Error('no postId');
            }
            user = yield getUserData(notification.senderUserId);
            body = `${user === null || user === void 0 ? void 0 : user.username} liked your post.`;
            break;
        case API_1.NOTIFICATION_TYPE.REFERRAL_JOINED:
            user = yield getUserData(notification.senderUserId);
            body = `${user === null || user === void 0 ? void 0 : user.username} accepted your invite to join Trava 🎉`;
            break;
        // TODO: trip
        // finished voting: "username finished voting for San Francisco."
        // everyone finished voting: "Everyone has finished voting for San Francisco 🎉 Create the itinerary now!"
        // 3 days since you’ve last swiped an activity for a destination, and you are not marked ready: "We can’t make the itinerary without you! Vote on San Francisco activities now."
    }
    console.log(`title: ${title}\nbody: ${body}`);
    return {
        title,
        body,
        navigator,
        screen,
        stringifyParams: params ? JSON.stringify(params) : '',
    };
});
const getUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const res = yield apiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetUserNotifications,
        variables: {
            userId,
        },
    });
    return (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.getUser;
});
const getTripData = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const res = yield apiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetTripNotifications,
        variables: {
            tripId,
        },
    });
    return (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.privateGetTrip;
});
const getAttractionData = (attractionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const res = yield apiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetAttractionNotifications,
        variables: {
            id: attractionId,
        },
    });
    return (_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.getAttraction;
});
const getCommentData = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const res = yield apiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetCommentNotifications,
        variables: {
            id: commentId,
        },
    });
    return (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.getComment;
});
exports.default = getNotificationContent;
