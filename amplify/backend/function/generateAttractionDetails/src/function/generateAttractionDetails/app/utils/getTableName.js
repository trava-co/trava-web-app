"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableName = void 0;
const getTableName = (table) => {
    let tableName = table || '';
    if (process.env.AWS_EXECUTION_ENV?.includes('-mock')) {
        tableName = tableName.split('-')[0] + 'Table';
    }
    return tableName;
};
exports.getTableName = getTableName;
