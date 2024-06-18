import aws from 'aws-sdk'

export async function getSSMVariable (variableName: string) {
    const { Parameters } = await (new aws.SSM()).getParameters({
        Names: [variableName].map(secretName => process.env[secretName] || ''),
        WithDecryption: true
    }).promise()

    if (!Parameters) {
        throw new Error('Failed to retrieve SSM parameters')
    }

    const token = Parameters.find(parameter => parameter.Name === process.env[variableName])?.Value

    if (!token || token.length === 0) {
        throw new Error(`Failed to retrieve a secret value: ${variableName}`)
    }

    return token
}