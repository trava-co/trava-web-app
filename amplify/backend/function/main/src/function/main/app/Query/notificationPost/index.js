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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const constants_1 = require("./utils/constants");
const homeTabsAccountTrips = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    ApiClient_1.default.get().useIamAuth();
    if (!((_a = event.arguments.input) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new Error('Wrong parameters');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_NOTIFICATION_POST);
    }
    const post = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaGetPostNotificationPost,
        variables: {
            id: event.arguments.input.id,
        },
    });
    const item = (_b = post === null || post === void 0 ? void 0 : post.data) === null || _b === void 0 ? void 0 : _b.privateGetPost;
    if (!item || item.userId !== event.identity.sub) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_NOTIFICATION_POST);
    }
    if (item === null || item === void 0 ? void 0 : item.deletedAt) {
        return {
            __typename: 'NotificationPostResponse',
            post: null,
        };
    }
    return {
        __typename: 'NotificationPostResponse',
        post: {
            __typename: 'NotificationPost',
            id: item.id,
            createdAt: item.createdAt,
            userId: item.userId,
            tripId: item.tripId,
            membersLength: ((_e = (_d = (_c = item.trip) === null || _c === void 0 ? void 0 : _c.members) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e.length) || 0,
            description: item.description || '',
            cloudinaryUrl: item.cloudinaryUrl || '',
            avatar: ((_f = item.user) === null || _f === void 0 ? void 0 : _f.avatar) || null,
            // check if post creator still belongs to a trip
            username: (((_j = (_h = (_g = item === null || item === void 0 ? void 0 : item.trip) === null || _g === void 0 ? void 0 : _g.members) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j.map((el) => el === null || el === void 0 ? void 0 : el.userId)) || []).indexOf(item.userId) > -1
                ? ((_k = item.user) === null || _k === void 0 ? void 0 : _k.username) || ''
                : ((_l = item.user) === null || _l === void 0 ? void 0 : _l.username) + constants_1.HAS_LEFT_THE_TRIP,
            authorPublic: ((_m = item.user) === null || _m === void 0 ? void 0 : _m.privacy) === API_1.PRIVACY.PUBLIC,
            destinationId: ((_o = item.destination) === null || _o === void 0 ? void 0 : _o.id) || null,
            destinationIcon: ((_p = item.destination) === null || _p === void 0 ? void 0 : _p.icon) || '',
            destinationCoverImage: ((_q = item.destination) === null || _q === void 0 ? void 0 : _q.coverImage) || null,
            destinationName: ((_r = item.destination) === null || _r === void 0 ? void 0 : _r.name) || null,
            destinationState: ((_s = item.destination) === null || _s === void 0 ? void 0 : _s.state) || null,
            destinationCountry: ((_t = item.destination) === null || _t === void 0 ? void 0 : _t.country) || null,
            attractionId: item.attractionId || null,
            attractionName: ((_u = item.attraction) === null || _u === void 0 ? void 0 : _u.name) || null,
            attractionImage: ((_w = (_v = item.attraction) === null || _v === void 0 ? void 0 : _v.images) === null || _w === void 0 ? void 0 : _w[0]) || null,
            likesCount: (_x = item.likesCount) !== null && _x !== void 0 ? _x : 0,
            commentsCount: (_y = item.commentsCount) !== null && _y !== void 0 ? _y : 0,
            mediaType: item.mediaType,
        },
    };
});
exports.default = homeTabsAccountTrips;
