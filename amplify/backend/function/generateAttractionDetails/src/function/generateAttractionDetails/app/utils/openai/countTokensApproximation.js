"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countTokensApproximation = void 0;
function countTokensApproximation(text) {
    // 75 words = 100 tokens
    return text.split(/\s+/).length * (100 / 75);
}
exports.countTokensApproximation = countTokensApproximation;
