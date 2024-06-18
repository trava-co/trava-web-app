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
exports.handler = void 0;
const tearex_1 = __importDefault(require("tearex"));
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const getSSMVariable_1 = require("./utils/getSSMVariable");
const getAllAttractionsFromPastWeek_1 = __importDefault(require("./utils/getAllAttractionsFromPastWeek"));
const getAllUsersFromPastWeek_1 = __importDefault(require("./utils/getAllUsersFromPastWeek"));
const getAllPostsFromPastWeek_1 = __importDefault(require("./utils/getAllPostsFromPastWeek"));
const CHUNK_SIZE = 20;
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ensureTearexEntitiesExist start:');
    const TEAREX_URL = yield getSSMVariable_1.getSSMVariable('TEAREX_URL');
    const TEAREX_API_KEY = yield getSSMVariable_1.getSSMVariable('TEAREX_API_KEY');
    const ENV = process.env.ENV;
    if (!ENV) {
        throw new Error('No ENV set');
    }
    if (!TEAREX_URL || !TEAREX_API_KEY) {
        throw new Error('Secrets not found');
    }
    tearex_1.default.init({
        url: TEAREX_URL,
        apiKey: TEAREX_API_KEY,
        stage: process.env.ENV,
    });
    const attractions = yield getAllAttractionsFromPastWeek_1.default();
    const users = yield getAllUsersFromPastWeek_1.default();
    const posts = yield getAllPostsFromPastWeek_1.default();
    const chunkedAttractions = lodash_chunk_1.default(attractions, CHUNK_SIZE);
    const chunkedUsers = lodash_chunk_1.default(users, CHUNK_SIZE);
    const chunkedPosts = lodash_chunk_1.default(posts, CHUNK_SIZE);
    for (const chunk of chunkedUsers) {
        yield tearex_1.default.batchCreateEntities(chunk.map((user) => ({
            id: user.id,
            label: 'User',
        })));
    }
    for (const chunk of chunkedPosts) {
        yield tearex_1.default.batchCreateEntities(chunk.map((post) => ({
            id: post.id,
            label: 'Post',
        })));
    }
    for (const chunk of chunkedAttractions) {
        yield tearex_1.default.batchCreateEntities(chunk.map((attraction) => ({
            id: attraction.id,
            label: 'Attraction',
        })));
    }
});
exports.handler = handler;
