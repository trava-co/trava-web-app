"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withExponentialBackoff = void 0;
const sleep_1 = require("./sleep");
async function withExponentialBackoff({ func, maxRetries = 5, cleanup, delay = 1000, // 1 second
 }) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await func();
        }
        catch (error) {
            if (cleanup) {
                await cleanup();
            }
            if (i === maxRetries - 1) {
                throw error; // If we're out of retries, throw the error
            }
            console.log(`Error: ${error}. Retrying in ${delay / 1000} seconds...`);
            await (0, sleep_1.sleep)(delay);
            delay *= 2; // Double the delay
        }
    }
}
exports.withExponentialBackoff = withExponentialBackoff;
