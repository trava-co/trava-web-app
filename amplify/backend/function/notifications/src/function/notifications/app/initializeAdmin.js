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
exports.initializeAdmin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const getSSMVariable_1 = require("./utils/getSSMVariable");
const initializeAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * GOOGLE_SERVICE_ACCOUNT_KEY was created using:
     * JSON.stringify(<service_key_json>)
     */
    const serviceAccount = JSON.parse(yield getSSMVariable_1.getSSMVariable('GOOGLE_SERVICE_ACCOUNT_KEY'), (key, value) => key === 'private_key' ? value.replace(/\\n/g, '\n') : value);
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
});
exports.initializeAdmin = initializeAdmin;
