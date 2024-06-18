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
const queries_1 = require("shared-types/graphql/queries");
const ApiClient_1 = __importDefault(require("./ApiClient"));
function getLastUpdateParity() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get().apiFetch({
            query: queries_1.listUpdatesByType,
            variables: {
                type: API_1.UpdateType.DESTINATION_NEARBY_ATTRACTION_COUNT,
                sortDirection: API_1.ModelSortDirection.DESC,
                limit: 1,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return (_b = res.data.listUpdatesByType) === null || _b === void 0 ? void 0 : _b.items[0];
    });
}
exports.default = getLastUpdateParity;
