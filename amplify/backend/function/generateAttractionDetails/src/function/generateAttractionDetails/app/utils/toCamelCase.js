"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = void 0;
function toCamelCase(str) {
    // split the string into words
    const words = str.toLowerCase().split(' ');
    // join the words together, capitalizing the first letter of each word after the first
    return words.map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1))).join('');
}
exports.toCamelCase = toCamelCase;
