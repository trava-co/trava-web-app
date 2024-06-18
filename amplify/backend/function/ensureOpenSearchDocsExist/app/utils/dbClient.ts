import AWS from 'aws-sdk'

let dynamoOptions = {}

// development mock
if (process.env.AWS_EXECUTION_ENV?.includes('-mock')) {
  dynamoOptions = {
    endpoint: 'http://localhost:62224',
    region: 'us-fake-1',
    secretAccessKey: 'fake',
    accessKeyId: 'fake',
  }
}

const dbClient = new AWS.DynamoDB.DocumentClient(dynamoOptions)

export { dbClient }
