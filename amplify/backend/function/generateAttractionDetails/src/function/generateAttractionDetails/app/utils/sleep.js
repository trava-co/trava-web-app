"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepRandom = exports.sleep = void 0;
// function that accepts a number in ms and returns a Promise that resolves after that time
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
// function that sleeps a random amount of time between the lower and upper bounds, provided in seconds
async function sleepRandom(lowerBound, upperBound) {
    const ms = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound) * 1000;
    await sleep(ms);
}
exports.sleepRandom = sleepRandom;
