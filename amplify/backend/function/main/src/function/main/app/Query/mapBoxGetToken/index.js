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
const getSSMVariable_1 = require("../../utils/getSSMVariable");
const mapBoxGetToken = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('mapBoxGetToken');
    /**
     * Main query
     */
    const token = yield (0, getSSMVariable_1.getSSMVariable)('MAPBOX_TOKEN');
    if (!token) {
        throw new Error('no token found in SSM');
    }
    return { __typename: 'MapboxGetTokenResult', token };
});
exports.default = mapBoxGetToken;
