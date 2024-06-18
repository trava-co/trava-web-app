async function getAllPaginatedData<T>(
  request: (nextToken?: null | string) => Promise<{ nextToken: string | null | undefined; data: T }>,
  callback: (data: T) => void,
) {
  let iterations = 0

  let res = await request()
  callback(res.data)

  while (res.nextToken) {
    iterations += 1

    if (iterations >= 300) {
      // too many iterations - stop infinite loop - targetIRR not reached
      throw new Error('Failed to calculate the IRR in 300 iterations. Please change the input parameters')
    }

    res = await request(res.nextToken)
    callback(res.data)
  }
}

export default getAllPaginatedData
