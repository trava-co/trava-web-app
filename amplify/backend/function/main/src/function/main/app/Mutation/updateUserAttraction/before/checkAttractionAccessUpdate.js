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
const getAttraction_1 = __importDefault(require("../../../utils/getAttraction"));
const checkAttractionAccessUpdate = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, checkForGroup_1.checkForGroup)(event, 'admin'))
        return null;
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE);
    }
    const attraction = yield (0, getAttraction_1.default)({
        id: event.arguments.input.id,
    });
    if (!attraction) {
        throw new Error(`Attraction with id ${event.arguments.input.id} not found`);
    }
    if (event.identity.sub !== attraction.authorId) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE);
    }
    return null;
});
exports.default = checkAttractionAccessUpdate;
