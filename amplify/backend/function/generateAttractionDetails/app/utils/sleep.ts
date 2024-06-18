// function that accepts a number in ms and returns a Promise that resolves after that time
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// function that sleeps a random amount of time between the lower and upper bounds, provided in seconds
export async function sleepRandom(lowerBound: number, upperBound: number) {
  const ms = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound) * 1000
  await sleep(ms)
}
