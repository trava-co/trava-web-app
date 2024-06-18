"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getGooglePhoto = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const dbClient_1 = require("./dbClient");
const aws_sdk_1 = require("aws-sdk");
const stream_1 = require("stream");
const getTableName_1 = require("./getTableName");
// @ts-ignore
const cheerio_1 = require("cheerio");
const Yup = __importStar(require("yup"));
const google = new google_maps_services_js_1.Client({});
const s3 = new aws_sdk_1.S3();
function getGooglePhoto({ photo_reference, html_attributions, destinationId, attractionId, order, GOOGLE_MAPS_KEY, STORAGE_BUCKETNAME, }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const googlePhoto = yield google.placePhoto({
            params: {
                photoreference: photo_reference,
                maxheight: 1060,
                maxwidth: 1500,
                key: GOOGLE_MAPS_KEY,
            },
            responseType: 'arraybuffer',
        });
        let authorName = 'Anonymous';
        let authorUrl = '';
        if (html_attributions === null || html_attributions === void 0 ? void 0 : html_attributions[0]) {
            console.log(`html_attributions: ${JSON.stringify(html_attributions, null, 2)}`);
            const $ = cheerio_1.load(html_attributions[0]);
            const anchor = $('a');
            if (anchor.length) {
                authorName = anchor.text();
                authorUrl = anchor.attr('href') || '';
            }
        }
        console.log(`authorName: ${authorName}, authorUrl: ${authorUrl}`);
        // query Photographers collection's name index to see if the photographer already exists
        console.log(`checking if photographer ${authorName} exists in the db`);
        const photographerTableName = getTableName_1.getTableName(process.env.API_TRAVA_PHOTOGRAPHERTABLE_NAME);
        const params = {
            TableName: photographerTableName,
            IndexName: 'byPhotographerName',
            KeyConditionExpression: '#name = :name',
            ExpressionAttributeNames: {
                '#name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': authorName,
            },
        };
        const { Items: photographerData } = yield dbClient_1.dbClient.query(params).promise();
        // get first result
        const existingPhotographer = photographerData === null || photographerData === void 0 ? void 0 : photographerData[0];
        let photographerId = uuid_1.v4(); // this will be used in the key of the photo object
        if (existingPhotographer) {
            console.log(`existingPhotographer exists`);
            photographerId = existingPhotographer.id;
        }
        else {
            console.log(`photographer does not exist. creating entry for ${photographerId}, ${authorName}`);
            // if the photographer doesn't exist, add them to the db
            yield createPhotographerInDb(photographerId, authorName, authorUrl);
        }
        // Use sharp to resize the image while maintaining the aspect ratio
        let img = sharp_1.default(googlePhoto.data);
        const metadata = yield img.metadata();
        const imageFormat = metadata.format; // This should give you 'jpeg', 'png', etc.
        const key = `attractions/coverImages/${destinationId}/${attractionId}/order=${order}_photographer=${photographerId}.${imageFormat}`;
        console.log(`key: ${key}`);
        // Create a pass-through stream
        const pass = new stream_1.PassThrough();
        if (metadata.width && metadata.height) {
            // Image has valid dimensions, resize it
            console.log(`image has valid dimensions: ${metadata.width} x ${metadata.height}`);
            const aspectRatio = 1.415; // target aspect ratio
            let resizeWidth, resizeHeight;
            if (metadata.width / metadata.height > aspectRatio) {
                // original image is wider than target aspect ratio
                resizeHeight = Math.min(1060, metadata.height);
                resizeWidth = Math.round(resizeHeight * aspectRatio);
            }
            else {
                // original image is taller than target aspect ratio
                resizeWidth = Math.min(1500, metadata.width);
                resizeHeight = Math.round(resizeWidth / aspectRatio);
            }
            img.resize(resizeWidth, resizeHeight).pipe(pass);
        }
        else {
            // Image dimensions are not valid, upload the original image
            sharp_1.default(googlePhoto.data).pipe(pass);
        }
        // Setting up S3 upload parameters
        const uploadParams = {
            Bucket: STORAGE_BUCKETNAME,
            Key: `public/${key}`,
            Body: pass,
        };
        // log bucket and key, but not the body
        console.log(`uploadParams: ${JSON.stringify({ Bucket: uploadParams.Bucket, Key: uploadParams.Key })}`);
        console.log('about to upload to S3');
        // Upload to S3
        yield s3.upload(uploadParams).promise();
        console.log(`uploaded to S3 successfully`);
        // Construct the S3Object to return
        const s3Object = {
            bucket: STORAGE_BUCKETNAME,
            region: (_a = s3.config.region) !== null && _a !== void 0 ? _a : 'us-east-1',
            key,
        };
        return s3Object;
    });
}
exports.getGooglePhoto = getGooglePhoto;
function createPhotographerInDb(photographerId, authorName, authorUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = {
            id: photographerId,
            name: authorName,
            url: authorUrl,
        };
        // use yup to validate input
        const PhotographerSchema = Yup.object({
            id: Yup.string().required('photographer id is required'),
            name: Yup.string().required('photographer name is required'),
            url: Yup.string().optional(),
        });
        try {
            yield PhotographerSchema.validate(input, { abortEarly: false });
        }
        catch (error) {
            console.error(`Create photographer input does not conform to schema: ${error}`);
            throw new Error(`Create photographer input does not conform to schema: ${error}`);
        }
        const params = {
            TableName: getTableName_1.getTableName(process.env.API_TRAVA_PHOTOGRAPHERTABLE_NAME),
            Item: input,
        };
        try {
            yield dbClient_1.dbClient.put(params).promise();
        }
        catch (error) {
            console.error(`Error creating photographer: ${error}`);
            throw new Error(`Error creating photographer: ${error}`);
        }
        return params.Item;
    });
}
