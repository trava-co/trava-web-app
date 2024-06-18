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
exports.getUsersMatchingUserIds = void 0;
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const constants_1 = require("../../utils/constants");
const oneWeekAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
};
const exploreTopUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('exploreTopUsers');
    ApiClient_1.default.get().useIamAuth();
    const userBucketListMap = new Map();
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListUserAttractions,
            variables: {
                nextToken,
                filter: {
                    createdAt: { ge: oneWeekAgo() },
                },
            },
        });
        return {
            data: (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.privateListUserAttractions) === null || _b === void 0 ? void 0 : _b.items,
            nextToken: (_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.privateListUserAttractions) === null || _d === void 0 ? void 0 : _d.nextToken,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((userAttraction) => {
            if (userAttraction === null || userAttraction === void 0 ? void 0 : userAttraction.authorId) {
                const count = userBucketListMap.get(userAttraction.authorId) || 0;
                userBucketListMap.set(userAttraction.authorId, count + 1);
            }
        });
    });
    const sortedUsers = Array.from(userBucketListMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    const userIds = sortedUsers.map(([userId]) => userId);
    const users = yield (0, exports.getUsersMatchingUserIds)(userIds);
    const topUserItems = sortedUsers.map(([userId, bucketListsCollected]) => {
        const user = users.find((user) => user.id === userId);
        const topUserItem = Object.assign(Object.assign({}, user), { bucketListsCollected });
        return topUserItem;
    });
    return {
        __typename: 'ExploreTopUsersResponse',
        users: topUserItems,
    };
});
const getUsersMatchingUserIds = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const users = [];
    if (userIds.length === 0) {
        return users;
    }
    const res = yield ApiClient_1.default.get().apiFetch({
        query: lambda_1.lambdaCustomSearchUsers,
        variables: {
            filter: {
                and: [
                    {
                        name: {
                            ne: constants_1.USER_DELETED_STRING,
                        },
                    },
                    {
                        or: [
                            ...userIds.map((userId) => {
                                return {
                                    id: {
                                        eq: userId,
                                    },
                                };
                            }),
                        ],
                    },
                ],
            },
        },
    });
    (_f = (_e = res.data) === null || _e === void 0 ? void 0 : _e.searchUsers) === null || _f === void 0 ? void 0 : _f.items.forEach((user) => {
        if (user) {
            users.push({
                __typename: 'SearchUser',
                id: user.id,
                username: user.username,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }
    });
    return users;
});
exports.getUsersMatchingUserIds = getUsersMatchingUserIds;
exports.default = exploreTopUsers;
