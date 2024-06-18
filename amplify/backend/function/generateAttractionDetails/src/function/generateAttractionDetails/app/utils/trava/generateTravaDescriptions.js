"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTravaDescriptions = void 0;
const askOpenAIChat_1 = require("../openai/askOpenAIChat");
const descriptionLong_1 = require("../prompts/descriptionLong");
const checkForOpenAIViolations_1 = require("../openai/checkForOpenAIViolations");
const descriptionShort_1 = require("../prompts/descriptionShort");
const constants_1 = require("../constants");
const API_1 = require("shared-types/API");
const questions_1 = require("../prompts/questions");
const buildRelevantInputText_1 = require("../buildRelevantInputText");
const TravaCardCreationErrors_1 = require("../TravaCardCreationErrors");
const BUFFER = 100; // margin of error for response tokens
const RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3 = 500 + BUFFER; // 500 tokens
const RESPONSE_TOKENS_LONG_DESCRIPTION_GPT4 = 300 + BUFFER; // About 225 words, more than enough for 4-5 sentences
const RESPONSE_TOKENS_SHORT_DESCRIPTION = 100 + BUFFER; // About 75 words, more than enough for 1-2 sentences
async function generateTravaDescriptions({ attractionId, attractionName, destinationName, attractionType, currentInputForSummary, relevanceMap, }) {
    console.log(`generateTravaDescriptions for ${attractionName} in ${destinationName}`);
    // only feed relevant questions responses to chatbot, to avoid discussion on logistics
    let relevantQuestions = [];
    if (attractionType === API_1.ATTRACTION_TYPE.DO) {
        relevantQuestions = [
            questions_1.questions[attractionType].UNIQUE,
            questions_1.questions[attractionType].HIGHLIGHTS,
            questions_1.questions[attractionType].LOCAL_TRADITION,
        ];
    }
    else {
        relevantQuestions = [
            questions_1.questions[attractionType].UNIQUE,
            questions_1.questions[attractionType].EXPERIENCE,
            questions_1.questions[attractionType].SIGNATURE_DISHES,
            questions_1.questions[attractionType].INTERIOR,
        ];
    }
    // get the relevance map for only the relevant questions
    const relevanceMapRelevantQuestions = Object.entries(relevanceMap).filter(([question]) => relevantQuestions.includes(question));
    // prepare the input, using the most relevant sentences
    const allSentenceScores = [];
    for (const [question, sentenceScores] of relevanceMapRelevantQuestions) {
        for (const [sentence, score] of Object.entries(sentenceScores)) {
            allSentenceScores.push({ sentence, score });
        }
    }
    const sortedAllSentenceByScores = allSentenceScores.sort((a, b) => b.score - a.score).map(({ sentence }) => sentence);
    // Deduplicate sentences
    const dedupedSortedSentences = Array.from(new Set(sortedAllSentenceByScores));
    // From all the reviews, construct the relevant input to get 30 bullets from gpt-3.5 about the restaurant, which will be used to generate the long description with gpt-4
    const buildChatThreadForLongDescription = (inputWithNewSentence) => {
        return (0, descriptionLong_1.getInputToDescriptionLongPrompt)(attractionType, inputWithNewSentence);
    };
    // input to get our bulleted list of 30 bullets
    let inputToGetSummary;
    try {
        inputToGetSummary = (0, buildRelevantInputText_1.buildRelevantInputText)({
            relevantSentences: dedupedSortedSentences,
            buildChatThread: buildChatThreadForLongDescription,
            inputThatMustBeIncluded: currentInputForSummary,
            responseTokens: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3,
        });
    }
    catch (error) {
        console.error('Error when assembling input to create descriptions');
        throw error;
    }
    const { messages: messagesInputToGetSummary } = inputToGetSummary;
    console.log('Checking for OpenAI violations...');
    // query moderation api to check for violations
    const flagged = await (0, checkForOpenAIViolations_1.checkForOpenAIViolations)(messagesInputToGetSummary.join(' '));
    if (flagged) {
        throw new TravaCardCreationErrors_1.TravaDescriptionError({
            message: 'OpenAI flagged the description as inappropriate',
            attractionId,
            attractionName,
            destinationName,
        });
    }
    console.log('No violations found.');
    let inputToDescriptionLong = '';
    try {
        inputToDescriptionLong = await (0, askOpenAIChat_1.askOpenAIChat)({
            messages: messagesInputToGetSummary,
            temperature: 0,
            model: constants_1.CHAT_MODELS.NEW_GPT_3,
            maxTokensForAnswer: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT3,
            context: `${attractionName} in ${destinationName}: inputToDescriptionLong`,
        });
    }
    catch (error) {
        console.error('Error querying OpenAI to create input to long description with GPT3.5');
        throw error;
    }
    const descriptionLongPrompt = (0, descriptionLong_1.getTravaDescriptionLongPrompt)(attractionName, attractionType, inputToDescriptionLong);
    let descriptionLong = '';
    try {
        descriptionLong = await (0, askOpenAIChat_1.askOpenAIChat)({
            messages: descriptionLongPrompt,
            model: constants_1.CHAT_MODELS.NEW_GPT_4,
            temperature: 0.8,
            topP: 0.8,
            maxTokensForAnswer: RESPONSE_TOKENS_LONG_DESCRIPTION_GPT4,
            context: `${attractionName} in ${destinationName}: descriptionLong`,
        });
    }
    catch (error) {
        console.error('Error querying OpenAI to create edited long description with GPT4');
        throw error;
    }
    const messagesShortDescription = (0, descriptionShort_1.getTravaDescriptionShortPrompt)(attractionType, descriptionLong);
    let descriptionShort = '';
    try {
        descriptionShort = await (0, askOpenAIChat_1.askOpenAIChat)({
            messages: messagesShortDescription,
            temperature: 0.85,
            model: constants_1.CHAT_MODELS.NEW_GPT_4,
            maxTokensForAnswer: RESPONSE_TOKENS_SHORT_DESCRIPTION,
            context: `${attractionName} in ${destinationName}: descriptionShort`,
        });
    }
    catch (error) {
        console.error('Error querying OpenAI to create short description with GPT4');
        throw error;
    }
    // if descriptionShort starts or ends with quotes, remove them:
    if (descriptionShort.startsWith('"') && descriptionShort.endsWith('"')) {
        descriptionShort = descriptionShort.substring(1, descriptionShort.length - 1);
    }
    // correct for over-exuberance: if string ends with !, replace with .
    if (descriptionShort.endsWith('!')) {
        descriptionShort = descriptionShort.substring(0, descriptionShort.length - 1) + '.';
    }
    return {
        inputToSummary: inputToDescriptionLong,
        inputToDescriptionLong,
        descriptionLong,
        descriptionShort,
    };
}
exports.generateTravaDescriptions = generateTravaDescriptions;
