export const checkIfValidTimestamp = (value: string | undefined) => {
  if (!value) return true
  const regex = new RegExp(
    '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:([0-9]{2}:)?([0-9]{2}.)?[0-9]{3}([+-][0-9]{2}:[0-9]{2}|Z)$',
    'i',
  )
  return regex.test(value)
}
