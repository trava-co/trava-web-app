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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uploadToCloudinaryFromS3_1 = __importDefault(require("../../utils/uploadToCloudinaryFromS3"));
const s3 = new aws_sdk_1.default.S3();
const uploadToCloudinary = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    // NONE
    const uploadResponse = yield (0, uploadToCloudinaryFromS3_1.default)(event.arguments.input.bufferItem.bucket, `public/${event.arguments.input.bufferItem.key}`, event.arguments.input.mediaType);
    if (!uploadResponse) {
        throw new Error('Failed to create post');
    }
    return {
        cloudinaryUrl: uploadResponse.secure_url,
        videoDuration: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.duration,
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format,
    };
});
exports.default = uploadToCloudinary;
