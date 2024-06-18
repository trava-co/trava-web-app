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
const getFollowsIds_1 = __importDefault(require("../homeTabsFeed/getFollowsIds"));
const notEmpty_1 = __importDefault(require("../../utils/notEmpty"));
const homeTabsFeedPeopleOnThisTrip = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    ApiClient_1.default.get().useIamAuth();
    if (!event.arguments.input) {
        throw new Error('invalid arguments');
    }
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED_DETAILS);
    }
    const myUserId = event.identity.sub;
    // check if userId is mine
    if (myUserId !== event.arguments.input.userId) {
        // check if user is public
        const user = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaGetUserPrivacy,
            variables: {
                userId: event.arguments.input.userId,
            },
        });
        if (((_b = (_a = user === null || user === void 0 ? void 0 : user.data) === null || _a === void 0 ? void 0 : _a.getUser) === null || _b === void 0 ? void 0 : _b.privacy) === API_1.PRIVACY.PRIVATE) {
            // check if I follow this userId
            const followsIds = yield (0, getFollowsIds_1.default)(event.identity.sub);
            if (followsIds.indexOf(event.arguments.input.userId) === -1) {
                throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_HOME_TABS_FEED_DETAILS);
            }
        }
    }
    // 1. Get members of the trip to which the post is connected
    const getMembers = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaHomeTabsFeedPostDetailsGetMembers,
        variables: {
            tripId: event.arguments.input.tripId,
        },
    });
    const getMembersIds = (_f = (_e = (_d = (_c = getMembers === null || getMembers === void 0 ? void 0 : getMembers.data) === null || _c === void 0 ? void 0 : _c.privateGetTrip) === null || _d === void 0 ? void 0 : _d.members) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.filter(notEmpty_1.default).map((el) => el.userId);
    // 2. Get UserFollows for each member (computed userFollowByMe doesn't work with iam auth)
    if (!getMembersIds) {
        throw new Error('No members');
    }
    const userFollowPromises = getMembersIds.map((memberId) => {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaHomeTabsFeedPostDetailsGetUserFollow,
            variables: {
                userId: myUserId,
                followedUserId: memberId,
            },
        });
    });
    const getUserFollows = yield Promise.all(userFollowPromises);
    return {
        __typename: 'HomeTabsFeedPeopleOnThisTripResponse',
        members: (_j = (_h = (_g = getMembers === null || getMembers === void 0 ? void 0 : getMembers.data) === null || _g === void 0 ? void 0 : _g.privateGetTrip) === null || _h === void 0 ? void 0 : _h.members) === null || _j === void 0 ? void 0 : _j.items,
        userFollows: getUserFollows.map((el) => { var _a; return (_a = el === null || el === void 0 ? void 0 : el.data) === null || _a === void 0 ? void 0 : _a.getUserFollow; }),
    };
});
exports.default = homeTabsFeedPeopleOnThisTrip;
