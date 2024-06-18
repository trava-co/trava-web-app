import { InfoItemInput } from 'shared-types/API'

export const infoItemsToString = (
  infoItems: (InfoItemInput | null)[] | null | undefined,
  title: string,
): string | null => {
  if (!infoItems) {
    return null
  }

  // Filter out items with negative === true, then map to get their names.
  const itemNames = infoItems
    .filter((item): item is InfoItemInput => Boolean(item))
    .filter((item) => !item.negative)
    .map((item) => item.name)

  // If there's no item names after filtering, return null.
  if (itemNames.length === 0) {
    return null
  }

  // Join the names together into a single string with commas in between, and prepend with the title.
  return `${title}: ${itemNames.join(', ')}`
}
