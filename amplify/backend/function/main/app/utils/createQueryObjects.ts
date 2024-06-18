export const createQueryObjects = (query: any) => {
  if (!query) {
    return ''
  }
  const header = JSON.stringify({})
  const body = JSON.stringify(query)
  return header + '\n' + body + '\n'
}
