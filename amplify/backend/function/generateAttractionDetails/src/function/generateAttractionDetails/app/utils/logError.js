"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const logError = async ({ error, context, shouldThrow }) => {
    console.error(`Error: ${context ?? error.message}, timestamp: ${new Date().toISOString()}`);
    if (shouldThrow) {
        throw error;
    }
};
exports.logError = logError;
