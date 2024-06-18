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
const getAllPaginatedData_1 = __importDefault(require("../../utils/getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getAllUserContacts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // get all UserContacts for this user
    const userContacts = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateListUserContacts,
            variables: {
                userId,
                nextToken,
                limit: 1000,
            },
        });
        return {
            data: (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.privateListUserContacts) === null || _b === void 0 ? void 0 : _b.items,
            nextToken: (_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.privateListUserContacts) === null || _d === void 0 ? void 0 : _d.nextToken,
        };
    }), (data) => {
        data === null || data === void 0 ? void 0 : data.forEach((item) => {
            if (!item)
                return;
            userContacts.push(item);
        });
    });
    return userContacts;
});
exports.default = getAllUserContacts;
