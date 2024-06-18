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
Object.defineProperty(exports, "__esModule", { value: true });
const checkForGroup_1 = require("../../../utils/checkForGroup");
const lambdaErrors_1 = require("shared-types/lambdaErrors");
const allowedPropertiesToUpdate = ['id', 'images'];
const checkAttractionUpdateInput = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, checkForGroup_1.checkForGroup)(event, 'admin'))
        return null;
    if (!Object.keys(event.arguments.input).every((key) => allowedPropertiesToUpdate.includes(key))) {
        throw new Error(lambdaErrors_1.CUSTOM_NOT_AUTHORIZED_UPDATE_ATTRACTION_MESSAGE);
    }
    return null;
});
exports.default = checkAttractionUpdateInput;
