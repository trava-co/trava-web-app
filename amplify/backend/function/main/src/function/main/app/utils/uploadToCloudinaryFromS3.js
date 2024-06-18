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
const cloudinary_1 = require("cloudinary");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3();
const uploadToCloudinaryFromS3 = (bucket, key, mediaType) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucket,
        Key: key,
    };
    const data = yield s3.getObject(params).createReadStream();
    const cloudinaryUploadPromise = new Promise((resolve, reject) => {
        const options = {
            folder: 'posts',
            resource_type: 'auto',
            image_metadata: true,
        };
        if (mediaType === API_1.MEDIA_TYPES.VIDEO) {
            options.bitrate = '800k';
            options.transformation = [{ width: 973, height: 1920, crop: 'fill' }];
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, response) => {
            if (response) {
                resolve(response);
            }
            else {
                reject(error);
            }
        });
        data.pipe(uploadStream);
    });
    return yield cloudinaryUploadPromise;
});
exports.default = uploadToCloudinaryFromS3;
