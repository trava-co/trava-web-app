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
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const checkForGroup_1 = require("../../../utils/checkForGroup");
const ApiClient_1 = __importDefault(require("../../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const checkAttractionAccessDelete = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((0, checkForGroup_1.checkForGroup)(event, 'admin'))
        return null;
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_DELETE_ATTRACTION_MESSAGE);
    }
    const currentAttraction = yield ApiClient_1.default.get()
        .useIamAuth()
        .apiFetch({
        query: lambda_1.lambdaGetAttraction,
        variables: {
            id: event.arguments.input.id,
        },
    });
    // shouldn't happen
    if (!currentAttraction)
        throw new Error('Attraction not found');
    if (event.identity.sub !== ((_b = (_a = currentAttraction.data) === null || _a === void 0 ? void 0 : _a.getAttraction) === null || _b === void 0 ? void 0 : _b.authorId))
        throw new Error('Wrong user');
    return null;
});
exports.default = checkAttractionAccessDelete;
