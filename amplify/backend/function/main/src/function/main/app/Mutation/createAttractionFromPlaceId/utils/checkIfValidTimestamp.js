"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfValidTimestamp = void 0;
const checkIfValidTimestamp = (value) => {
    if (!value)
        return true;
    const regex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:([0-9]{2}:)?([0-9]{2}.)?[0-9]{3}([+-][0-9]{2}:[0-9]{2}|Z)$', 'i');
    return regex.test(value);
};
exports.checkIfValidTimestamp = checkIfValidTimestamp;
