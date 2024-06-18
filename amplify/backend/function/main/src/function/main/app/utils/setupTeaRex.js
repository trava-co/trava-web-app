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
exports.setupTeaRex = void 0;
const getSSMVariable_1 = require("./getSSMVariable");
const tearex_1 = __importDefault(require("tearex"));
let isTeaRexConfigured = false;
const setupTeaRex = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isTeaRexConfigured) {
        return;
    }
    const TEAREX_URL = yield (0, getSSMVariable_1.getSSMVariable)('TEAREX_URL');
    const TEAREX_API_KEY = yield (0, getSSMVariable_1.getSSMVariable)('TEAREX_API_KEY');
    tearex_1.default.init({
        apiKey: TEAREX_API_KEY,
        url: TEAREX_URL,
        stage: process.env.ENV,
    });
    isTeaRexConfigured = true;
});
exports.setupTeaRex = setupTeaRex;
