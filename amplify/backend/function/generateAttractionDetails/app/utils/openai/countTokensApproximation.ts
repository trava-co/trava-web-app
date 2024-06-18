export function countTokensApproximation(text: string) {
  // 75 words = 100 tokens
  return text.split(/\s+/).length * (100 / 75)
}
