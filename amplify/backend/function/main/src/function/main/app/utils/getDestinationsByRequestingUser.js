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
const getAllPaginatedData_1 = __importDefault(require("./getAllPaginatedData"));
const ApiClient_1 = __importDefault(require("../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const DEFAULT_USER_ARGUMENT = 'defaultUserArgument';
exports.default = (userId = DEFAULT_USER_ARGUMENT) => __awaiter(void 0, void 0, void 0, function* () {
    const destinations = [];
    yield (0, getAllPaginatedData_1.default)((nextToken) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaListDestinations,
            variables: {
                label: 'Destination',
                filter: {
                    or: [{ isTravaCreated: { eq: 1 } }, { authorId: { eq: userId } }],
                    deletedAt: { notContains: '' },
                },
                nextToken,
                limit: 500,
                sortDirection: API_1.ModelSortDirection.ASC,
            },
        });
        return {
            nextToken: (_a = res.data.listDestinationsByLabel) === null || _a === void 0 ? void 0 : _a.nextToken,
            data: res.data,
        };
    }), (data) => {
        var _a;
        (_a = data === null || data === void 0 ? void 0 : data.listDestinationsByLabel) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
            if (item)
                destinations.push(item);
        });
    });
    return destinations;
});
