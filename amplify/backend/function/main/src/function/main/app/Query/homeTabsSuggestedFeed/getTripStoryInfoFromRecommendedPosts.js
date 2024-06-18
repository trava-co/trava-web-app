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
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const lambda_1 = require("shared-types/graphql/lambda");
const getTripStoryInfoFromRecommendedPosts = (recommendations, gtTimestampForData) => __awaiter(void 0, void 0, void 0, function* () {
    // construct a dictionary with key of string, value an object describing tripStory metadata
    const tripStoryInfoDictionary = {};
    const postsPromises = recommendations === null || recommendations === void 0 ? void 0 : recommendations.map((recommendation) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const res = yield ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateGetStoryInfoFromPost,
            variables: {
                id: (_a = recommendation.entity.id) === null || _a === void 0 ? void 0 : _a.toString(),
            },
        });
        const post = res.data.privateGetPost;
        // suggested feed should only display public posts that haven't been deleted
        if (((_b = post === null || post === void 0 ? void 0 : post.user) === null || _b === void 0 ? void 0 : _b.privacy) === API_1.PRIVACY.PUBLIC && !(post === null || post === void 0 ? void 0 : post.deletedAt)) {
            const postCreatedAt = new Date(post.createdAt);
            const gtTimestampForDataDate = new Date(gtTimestampForData);
            if (postCreatedAt > gtTimestampForDataDate) {
                const storyId = `${post.userId}#${post.tripId}`;
                // if the storyId is in the dictionary, operate on it and return
                if (tripStoryInfoDictionary[storyId]) {
                    tripStoryInfoDictionary[storyId].score += recommendation.score;
                    tripStoryInfoDictionary[storyId].postCount += 1;
                    tripStoryInfoDictionary[storyId].averageScore =
                        tripStoryInfoDictionary[storyId].score / tripStoryInfoDictionary[storyId].postCount;
                    return;
                }
                // otherwise the storyId is not in the dictionary, so add it
                tripStoryInfoDictionary[storyId] = {
                    userId: post.userId,
                    tripId: post.tripId,
                    score: recommendation.score,
                    postCount: 1,
                    averageScore: recommendation.score,
                };
            }
        }
    }));
    yield Promise.all(postsPromises !== null && postsPromises !== void 0 ? postsPromises : []);
    return tripStoryInfoDictionary;
});
exports.default = getTripStoryInfoFromRecommendedPosts;
