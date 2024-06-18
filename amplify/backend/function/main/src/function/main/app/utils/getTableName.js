"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTableName = (table) => {
    var _a;
    let tableName = table || '';
    if ((_a = process.env.AWS_EXECUTION_ENV) === null || _a === void 0 ? void 0 : _a.includes('-mock')) {
        tableName = tableName.split('-')[0] + 'Table';
    }
    return tableName;
};
exports.default = getTableName;
