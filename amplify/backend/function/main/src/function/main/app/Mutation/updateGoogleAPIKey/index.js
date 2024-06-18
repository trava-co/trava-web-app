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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoogleAPIKey = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const API_1 = require("shared-types/API");
const updateGoogleAPIKey = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting Google API Key Update:');
    // Authorization Check
    if (!(event.identity &&
        'sub' in event.identity &&
        'claims' in event.identity &&
        'cognito:groups' in event.identity.claims &&
        event.identity.claims['cognito:groups'].includes('admin'))) {
        throw new Error('Not Authorized');
    }
    console.log(`event.arguments: ${JSON.stringify(event.arguments, null, 2)}`);
    // Validate Input
    if (!(event.arguments &&
        'input' in event.arguments &&
        'googleAPIKey' in event.arguments.input)) {
        throw new Error('Invalid Input');
    }
    const { googleAPIKey, platform, isDev } = event.arguments.input;
    const ssmClient = new client_ssm_1.SSMClient({ region: 'us-east-1' });
    const envsUpdated = [];
    const envsFailed = [];
    for (const env of Object.values(API_1.BACKEND_ENV_NAME)) {
        const parameterName = `/amplify/d3nzalola22yka/${env.toLowerCase()}/AMPLIFY_main_GOOGLE_AUTOCOMPLETE_API_KEY_${isDev ? 'DEV' : platform}`;
        console.log(`setting ${parameterName} for ${env}`);
        try {
            const command = new client_ssm_1.PutParameterCommand({
                Name: parameterName,
                Value: googleAPIKey,
                Overwrite: true,
                Type: 'SecureString',
            });
            yield ssmClient.send(command);
            console.log(`Updated parameter for ${env}`);
            envsUpdated.push(env);
        }
        catch (error) {
            console.error(`Error updating SSM Parameter for ${env}:`, error);
            envsFailed.push(env);
        }
    }
    return {
        __typename: 'UpdateGoogleAPIKeyResponse',
        envsUpdated,
        envsFailed,
    };
});
exports.updateGoogleAPIKey = updateGoogleAPIKey;
exports.default = exports.updateGoogleAPIKey;
