"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryObjects = void 0;
const createQueryObjects = (query) => {
    if (!query) {
        return '';
    }
    const header = JSON.stringify({});
    const body = JSON.stringify(query);
    return header + '\n' + body + '\n';
};
exports.createQueryObjects = createQueryObjects;
