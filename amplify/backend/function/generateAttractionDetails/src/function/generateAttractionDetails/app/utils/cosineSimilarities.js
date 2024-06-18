"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = void 0;
const mathjs_1 = require("mathjs");
function cosineSimilarity(a, b) {
    // check the types of a and b to make sure they are both arrays of numbers
    if (!Array.isArray(a) || !Array.isArray(b)) {
        console.log(`a or b is not an array`);
        console.log(`a: ${a}`);
        console.log(`b: ${b}`);
        console.warn('Cannot compute cosine similarity of non-array types');
        return 0;
    }
    if (a.some((el) => typeof el !== 'number') || b.some((el) => typeof el !== 'number')) {
        console.warn('Cannot compute cosine similarity of non-number types');
        return 0;
    }
    const aNorm = (0, mathjs_1.norm)(a);
    const bNorm = (0, mathjs_1.norm)(b);
    if (aNorm === 0 || bNorm === 0) {
        throw new Error('Cannot compute cosine similarity of zero vectors');
    }
    try {
        return (0, mathjs_1.dot)(a, b) / (aNorm * bNorm);
    }
    catch (error) {
        console.error(`Error computing cosine similarity of vectors ${a} and ${b}: ${error}`);
    }
    return 0;
}
exports.cosineSimilarity = cosineSimilarity;
