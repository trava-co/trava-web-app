"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOnlineLLMToClassifyLogistics = void 0;
const axios_1 = __importDefault(require("axios"));
const withExponentialBackoff_1 = require("./withExponentialBackoff");
const getSSMVariable_1 = require("./getSSMVariable");
async function askOnlineLLMToClassifyLogistics({ attractionName, destinationName, }) {
    const PERPLEXITY_API_KEY = await (0, getSSMVariable_1.getSSMVariable)('PERPLEXITY_API_KEY');
    // divide questions into two subsets: first two questions and remaining questions
    // then, ask each in sequence, waiting for the first to complete before asking the second
    // use withExponentialBackoff to retry each request up to 3 times, with delays of 3 seconds, 6 seconds, and 12 seconds
    // if either request fails more than 3 times, throw an error. otherwise, concatenate the responses and return them
    const firstQuestionSubset = questions.slice(0, 2);
    const secondQuestionSubset = questions.slice(2);
    const input = {
        attractionName,
        destinationName,
        PERPLEXITY_API_KEY,
    };
    const firstSubsetResponse = await askWithBackoff({ ...input, questionSubset: firstQuestionSubset, subsetIndex: 1 });
    const secondSubsetResponse = await askWithBackoff({ ...input, questionSubset: secondQuestionSubset, subsetIndex: 2 });
    const response = firstSubsetResponse + secondSubsetResponse;
    console.log(`Response from Perplexity: \n${response}`);
    return response;
}
exports.askOnlineLLMToClassifyLogistics = askOnlineLLMToClassifyLogistics;
// Updated function to handle the exponential backoff and errors
const askWithBackoff = async ({ attractionName, destinationName, questionSubset, PERPLEXITY_API_KEY, subsetIndex, }) => {
    try {
        return await (0, withExponentialBackoff_1.withExponentialBackoff)({
            func: () => askPerplexity({
                attractionName,
                destinationName,
                questionSubset,
                PERPLEXITY_API_KEY,
            }),
            maxRetries: 3,
            delay: 3000,
        });
    }
    catch (error) {
        // Log the error and rethrow with additional context
        console.error(`Error during askWithBackoff for subset ${subsetIndex}:`, error);
        throw new Error(`Error asking online LLM to classify logistics for subset ${subsetIndex}: ${error}`);
    }
};
const askPerplexity = async ({ attractionName, destinationName, questionSubset, PERPLEXITY_API_KEY, }) => {
    const question = formatQuestionsContent({ attractionName, destinationName, questionSubset });
    console.log(`Asking Perplexity: \n${question}`);
    const apiUrl = 'https://api.perplexity.ai/chat/completions';
    const payload = {
        model: 'llama-3-sonar-large-32k-online',
        messages: [
            {
                role: 'user',
                content: question,
            },
        ],
        temperature: 0,
    };
    const headers = {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
    };
    const response = await axios_1.default.post(apiUrl, payload, { headers: headers });
    const responseText = response.data.choices[0].message.content;
    // if response is fewer than 10 characters, it's probably an error message, so throw an error
    if (responseText.length < 10) {
        throw new Error(`Perplexity API returned too short a response: ${responseText}`);
    }
    return responseText;
};
// Function to format questions into a content string
function formatQuestionsContent({ attractionName, destinationName, questionSubset }) {
    let content = `Concisely answer the following questions about "${attractionName}" in ${destinationName}. If you can't find information, take a logical guess.\n\n`;
    questionSubset.forEach((question, index) => {
        const optionsText = question.options?.join(', ') ?? '';
        content += `${index + 1}. ${question.questionText} ${optionsText}\n\n`;
    });
    return content;
}
const questions = [
    {
        questionId: 'reservationPolicy',
        questionText: 'Is it necessary to make a reservation in advance?',
    },
    {
        questionId: 'costPerPerson',
        questionText: 'Is a ticket or admission fee required to visit? If so, approximately how much does it cost per person:',
        options: ['free', 'under $25', '$25-$50', '$50-$75', 'more than $75'],
    },
    {
        questionId: 'greatFor',
        questionText: 'Which groups would this attraction be great for? Select all that apply:',
        options: [
            'couples',
            'large groups',
            'kids',
            'pets',
            'bachelorette parties (raucous groups who enjoy drinking)',
            'indoor activities for rainy days',
        ],
    },
    {
        questionId: 'categories',
        questionText: 'Select a primary category and if it makes sense, a secondary category, that best describes this attraction:',
        options: [
            'action & physical activity (involving hiking, biking, or other physical activity)',
            'arts & museums',
            'entertainment',
            'leisure',
            'nature',
            'bars drinking & nightlife',
            'shopping',
            'sights & landmarks',
        ],
    },
];
