const AWS = require("aws-sdk")

const docClient = new AWS.DynamoDB.DocumentClient()

const getDistanceString = (location1, location2) => {
  /*
  long,lat format
   */
  return `${location1[0]},${location1[1]};${location2[0]},${location2[1]}`
}

async function getTravelTimeBatch(distanceStrings) {
  const uniqueStrings = [...new Set(distanceStrings)]

  const requests = []

  while (uniqueStrings.length) {
    const workingDistances = uniqueStrings.splice(0, 100) // batch can have at most 100 distances queried

    const params = {
      RequestItems: {
        [process.env.API_TRAVA_DISTANCETABLE_NAME]: {
          Keys: workingDistances.map(distanceString => ({'key': distanceString})) // [{ 'key': distanceString }]
        }
      }
    }

    requests.push(docClient.batchGet(params).promise())
  }

  const res = await Promise.all(requests)

  return Object.fromEntries(res.flatMap(r => {
    return r.Responses[process.env.API_TRAVA_DISTANCETABLE_NAME].map(item => [item.key, item.value / 10])
  }))
}

module.exports = { getDistanceString, getTravelTimeBatch }

