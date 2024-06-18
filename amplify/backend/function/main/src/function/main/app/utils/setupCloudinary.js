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
exports.configureCloudinary = void 0;
const getSSMVariable_1 = require("./getSSMVariable");
const cloudinary_1 = __importDefault(require("cloudinary"));
let isCloudinaryConfigured = false;
const configureCloudinary = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isCloudinaryConfigured) {
        return;
    }
    const cloudinaryCloudName = yield (0, getSSMVariable_1.getSSMVariable)('CLOUDINARY_CLOUD_NAME');
    const cloudinaryApiKey = yield (0, getSSMVariable_1.getSSMVariable)('CLOUDINARY_API_KEY');
    const cloudinaryApiSecret = yield (0, getSSMVariable_1.getSSMVariable)('CLOUDINARY_API_SECRET');
    cloudinary_1.default.v2.config({
        cloud_name: cloudinaryCloudName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
        secure: true,
    });
    isCloudinaryConfigured = true;
});
exports.configureCloudinary = configureCloudinary;
