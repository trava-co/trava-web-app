const getTableName = (table?: string) => {
  let tableName = table || ''
  if (process.env.AWS_EXECUTION_ENV?.includes('-mock')) {
    tableName = tableName.split('-')[0] + 'Table'
  }
  return tableName
}
export default getTableName
