"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSentenceRelevanceMap = exports.getSentenceRelevanceMapFromEmbeddings = void 0;
const createEmbeddings_1 = require("./createEmbeddings");
const cosineSimilarities_1 = require("./cosineSimilarities");
const sentence_tokenizer_1 = __importDefault(require("sentence-tokenizer"));
const embeddings_1 = require("../embeddings");
const API_1 = require("shared-types/API");
const logError_1 = require("./logError");
const sentenceTokenizer = new sentence_tokenizer_1.default();
/** Returns an obj with keys = questions, and each question has a value of an obj with keys = sentence text & val = max relevance score to the question */
async function getSentenceRelevanceMapFromEmbeddings({ segmentsWithEmbeddings, questionsWithEmbeddings, attractionId, attractionName, destinationName, }) {
    const questionEmbeddings = questionsWithEmbeddings.map((q) => q.embedding);
    if (!questionEmbeddings || questionEmbeddings.some((e) => !e)) {
        throw new Error(`questionEmbeddings contains falsy values: ${questionEmbeddings}`);
    }
    // Step 1: Get top 30 most relevant segments as measured by similarity to any one question
    const segmentsAndRelevanceScore = segmentsWithEmbeddings.map(({ segment, embedding: segmentEmbedding }) => {
        if (!segmentEmbedding) {
            console.error(`segmentEmbedding is falsy: ${segmentEmbedding}`);
            return { segment, score: 0 };
        }
        // score the segment by its highest similarity to any question
        const maxSimilarity = Math.max(...questionEmbeddings.map((questionEmbedding) => (0, cosineSimilarities_1.cosineSimilarity)(segmentEmbedding, questionEmbedding)));
        return { segment, score: maxSimilarity };
    });
    // sort the segments by their maximum similarity to any question
    const sortedSegmentsByRelevance = segmentsAndRelevanceScore.sort((a, b) => b.score - a.score);
    // get the top 30 most relevant segments
    const mostRelevantSegments = sortedSegmentsByRelevance.slice(0, 30).map((item) => item.segment);
    // we've reduced the universe of segments to 30. now, process in greater detail by evaluating each sentence within.
    // Tokenize to sentences
    sentenceTokenizer.setEntry(mostRelevantSegments.join(' '));
    const sentences = sentenceTokenizer.getSentences();
    let sentenceEmbeddings = [];
    try {
        sentenceEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
            input: sentences,
            attractionId,
            attractionName,
            destinationName,
            context: 'get sentence embeddings',
        });
    }
    catch (error) {
        console.error('Error creating embeddings for getSentenceRelevanceMapFromEmbeddings');
        throw error;
    }
    // Step 2: Compute relevanceMap
    const relevanceMap = {};
    for (const { segment: question, embedding: questionEmbedding } of questionsWithEmbeddings) {
        const sentenceScores = {};
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            const sentenceEmbedding = sentenceEmbeddings[i];
            const score = (0, cosineSimilarities_1.cosineSimilarity)(sentenceEmbedding, questionEmbedding);
            sentenceScores[sentence] = score;
        }
        // Sort sentences by score for this question
        const sortedSentences = Object.entries(sentenceScores).sort((a, b) => b[1] - a[1]);
        // Store sorted sentences and their scores in relevanceMap
        relevanceMap[question] = Object.fromEntries(sortedSentences);
    }
    return relevanceMap;
}
exports.getSentenceRelevanceMapFromEmbeddings = getSentenceRelevanceMapFromEmbeddings;
const questionsDoOrEatEmbeddings = {
    DO: embeddings_1.doQuestionEmbeddings,
    EAT: embeddings_1.eatQuestionEmbeddings,
};
// [{segment: "what's the atmosphere like?", embedding: [0.1, 0.2, 0.3]}, ...}]
const questionsWithEmbeddings = {
    DO: Object.entries(questionsDoOrEatEmbeddings[API_1.ATTRACTION_TYPE.DO]).map(([question, embedding]) => ({
        segment: question,
        embedding,
    })),
    EAT: Object.entries(questionsDoOrEatEmbeddings[API_1.ATTRACTION_TYPE.EAT]).map(([question, embedding]) => ({
        segment: question,
        embedding,
    })),
};
async function getSentenceRelevanceMap({ segments, attractionId, attractionName, destinationName, attractionType, }) {
    // math representation of each chunk of text
    let segmentEmbeddings = [];
    try {
        segmentEmbeddings = await (0, createEmbeddings_1.createEmbeddings)({
            input: segments,
            attractionId,
            attractionName,
            destinationName,
            context: `${attractionName} in ${destinationName}: Relevant text embeddings`,
        });
    }
    catch (error) {
        await (0, logError_1.logError)({
            error: error,
            context: `CreateEmbeddingsError for ${attractionName} in ${destinationName}`,
            shouldThrow: true,
        });
    }
    // [{segment: "casual atmosphere", embedding: [0.1, 0.2, 0.3]}, ...}]
    const segmentsWithEmbeddings = segments.map((segment, index) => ({
        segment,
        embedding: segmentEmbeddings[index],
    }));
    // {"what's the atmosphere like?": {"casual atmosphere": 0.98, ...} ...}
    let relevanceMap = {};
    try {
        relevanceMap = await getSentenceRelevanceMapFromEmbeddings({
            segmentsWithEmbeddings,
            questionsWithEmbeddings: questionsWithEmbeddings[attractionType],
            attractionId,
            attractionName,
            destinationName,
        });
    }
    catch (error) {
        await (0, logError_1.logError)({
            error: error,
            context: `getSentenceRelevanceMapFromEmbeddings for ${name} in ${destinationName}`,
            shouldThrow: true,
        });
    }
    return relevanceMap;
}
exports.getSentenceRelevanceMap = getSentenceRelevanceMap;
