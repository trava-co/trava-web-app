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
const API_1 = require("shared-types/API");
const lambda_1 = require("shared-types/graphql/lambda");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const getUserContacts = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getUserContacts');
    ApiClient_1.default.get().useIamAuth();
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_GET_USER_CONTACTS);
    }
    const requestingUserId = event.identity.sub;
    let userContactsOnTravaIds = [];
    let contactsNotOnTrava = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // query UserContact model's local secondary index for all UserContacts for this user in alphabetical order
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateGetUserContactsByUserByContactName,
            variables: {
                userId: requestingUserId,
                sortDirection: API_1.ModelSortDirection.ASC,
                nextToken,
                limit: 1000,
            },
        });
        return {
            data: (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.privateGetUserContactsByUserByContactName) === null || _b === void 0 ? void 0 : _b.items,
            nextToken: (_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.privateGetUserContactsByUserByContactName) === null || _d === void 0 ? void 0 : _d.nextToken,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((userContactItem) => {
            var _a, _b, _c, _d, _e;
            if (userContactItem) {
                if ((_a = userContactItem.travaUserIds) === null || _a === void 0 ? void 0 : _a.length) {
                    const parsedTravaUserIds = (_c = ((_b = userContactItem === null || userContactItem === void 0 ? void 0 : userContactItem.travaUserIds) !== null && _b !== void 0 ? _b : [])) === null || _c === void 0 ? void 0 : _c.filter((id) => !!id);
                    userContactsOnTravaIds.push(...parsedTravaUserIds);
                }
                else {
                    contactsNotOnTrava.push({
                        __typename: 'Contact',
                        id: userContactItem.recordId,
                        name: userContactItem.name,
                        emailAddresses: (_d = userContactItem.email) !== null && _d !== void 0 ? _d : [],
                        phoneNumbers: (_e = userContactItem.phone) !== null && _e !== void 0 ? _e : [],
                    });
                }
            }
        });
    });
    // get all User objects for contacts on Trava
    const contactsOnTrava = yield (0, exports.getUsersMatchingUserIds)(userContactsOnTravaIds);
    // return an array of Users describing contacts on trava, contacts not on trava, and public users
    return {
        __typename: 'GetUserContactsResponse',
        contactsOnTrava,
        contactsNotOnTrava,
        userContactsOnTravaIds,
    };
});
const getUsersMatchingUserIds = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    if (userIds.length === 0) {
        return users;
    }
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g, _h;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaCustomSearchUsers,
            variables: {
                nextToken,
                filter: {
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
            },
        });
        return {
            nextToken: (_f = (_e = res.data) === null || _e === void 0 ? void 0 : _e.searchUsers) === null || _f === void 0 ? void 0 : _f.nextToken,
            data: (_h = (_g = res.data) === null || _g === void 0 ? void 0 : _g.searchUsers) === null || _h === void 0 ? void 0 : _h.items,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((user) => {
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
    });
    return users;
});
exports.getUsersMatchingUserIds = getUsersMatchingUserIds;
exports.default = getUserContacts;
