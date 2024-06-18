import { dot, norm } from 'mathjs'

export function cosineSimilarity(a: number[], b: number[]) {
  // check the types of a and b to make sure they are both arrays of numbers
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.log(`a or b is not an array`)
    console.log(`a: ${a}`)
    console.log(`b: ${b}`)
    console.warn('Cannot compute cosine similarity of non-array types')
    return 0
  }
  if (a.some((el) => typeof el !== 'number') || b.some((el) => typeof el !== 'number')) {
    console.warn('Cannot compute cosine similarity of non-number types')
    return 0
  }
  const aNorm = norm(a) as number
  const bNorm = norm(b) as number
  if (aNorm === 0 || bNorm === 0) {
    throw new Error('Cannot compute cosine similarity of zero vectors')
  }
  try {
    return dot(a, b) / (aNorm * bNorm)
  } catch (error) {
    console.error(`Error computing cosine similarity of vectors ${a} and ${b}: ${error}`)
  }

  return 0
}
