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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const checkTripAccessCreate_1 = __importDefault(require("./before/checkTripAccessCreate"));
const lambda_1 = require("shared-types/graphql/lambda");
const uploadToCloudinaryFromS3_1 = __importDefault(require("../../utils/uploadToCloudinaryFromS3"));
const beforeHooks = [checkTripAccessCreate_1.default];
function _privateCreatePost(createPostMutationVariables) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: lambda_1.lambdaCustomPrivateCreatePost,
            variables: createPostMutationVariables,
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            // TODO handle error message parsing:
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.privateCreatePost;
    });
}
const createPost = (event) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * before hooks
     */
    for (const hook of beforeHooks) {
        console.log(`Running before hook: "${hook.name}"`);
        yield hook(event);
    }
    if (event.arguments.input.cloudinaryInput) {
        const { cloudinaryInput } = event.arguments.input;
        const post = yield _privateCreatePost({
            input: {
                destinationId: event.arguments.input.destinationId,
                description: event.arguments.input.description,
                tripId: event.arguments.input.tripId,
                userId: event.arguments.input.userId,
                attractionId: event.arguments.input.attractionId,
                format: cloudinaryInput.format,
                width: cloudinaryInput.width,
                height: cloudinaryInput.height,
                mediaType: event.arguments.input.mediaType,
                cloudinaryUrl: cloudinaryInput.cloudinaryUrl,
                videoDuration: cloudinaryInput === null || cloudinaryInput === void 0 ? void 0 : cloudinaryInput.videoDuration,
                likesCount: 0,
                commentsCount: 0,
            },
        });
        if (!post) {
            throw new Error('Failed to create post');
        }
        return post.id;
    }
    if (!event.arguments.input.bufferItem) {
        throw new Error('BufferItem is missing');
    }
    const uploadResponse = yield (0, uploadToCloudinaryFromS3_1.default)(event.arguments.input.bufferItem.bucket, `public/${event.arguments.input.bufferItem.key}`, event.arguments.input.mediaType);
    const post = yield _privateCreatePost({
        input: {
            destinationId: event.arguments.input.destinationId,
            description: event.arguments.input.description,
            tripId: event.arguments.input.tripId,
            userId: event.arguments.input.userId,
            attractionId: event.arguments.input.attractionId,
            format: uploadResponse.format,
            width: uploadResponse.width,
            height: uploadResponse.height,
            mediaType: event.arguments.input.mediaType,
            cloudinaryUrl: uploadResponse.secure_url,
            videoDuration: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.duration,
            likesCount: 0,
            commentsCount: 0,
        },
    });
    if (!post) {
        throw new Error('Failed to create post');
    }
    return post.id;
});
exports.default = createPost;
