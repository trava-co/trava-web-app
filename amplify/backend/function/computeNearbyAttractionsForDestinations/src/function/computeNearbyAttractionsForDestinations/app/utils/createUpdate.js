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
const mutations_1 = require("shared-types/graphql/mutations");
const ApiClient_1 = __importDefault(require("./ApiClient"));
const getLastUpdateParity_1 = __importDefault(require("./getLastUpdateParity"));
function createUpdate(parity) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // strange bug where aws is retrying our scheduled lambda multiple times, despite no errors
        // to avoid creating more than one update per run, check if an update with the same parity has been made in the past 15 minutes. if it has, then return early.
        const lastUpdate = yield getLastUpdateParity_1.default();
        const currentTime = Date.now();
        const fifteenMinutesAgo = currentTime - 15 * 60 * 1000; // 15 min is the timeout
        const lastUpdateCreationTime = (lastUpdate === null || lastUpdate === void 0 ? void 0 : lastUpdate.createdAt) ? new Date(lastUpdate.createdAt).getTime() : 0;
        if (lastUpdate && lastUpdate.parityLastProcessed === parity && lastUpdateCreationTime > fifteenMinutesAgo) {
            console.log(`Update with parity ${parity} was made in the past 15 minutes. Skipping this update.`);
            return;
        }
        const res = yield ApiClient_1.default.get().apiFetch({
            query: mutations_1.privateCreateUpdate,
            variables: {
                input: {
                    type: API_1.UpdateType.DESTINATION_NEARBY_ATTRACTION_COUNT,
                    parityLastProcessed: parity,
                },
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreateUpdate;
    });
}
exports.default = createUpdate;
