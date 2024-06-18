import * as AWS from 'aws-sdk'
import axios from 'axios'

const appsyncUrl = process.env.API_TRAVA_GRAPHQLAPIENDPOINTOUTPUT || 'test'
const region = process.env.REGION as string
const endpoint = new AWS.Endpoint(appsyncUrl)

export interface Body<V = Record<any, any>> {
  query: string
  variables?: V
}

export interface Response<R> {
  data: R
  errors: any[]
}

class ApiClient {
  private static instance: ApiClient
  private authHeader: string | null

  private constructor() {
    this.authHeader = null
  }

  public static get(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }

    return ApiClient.instance
  }

  public useAwsCognitoUserPoolAuth(authHeader: string): ApiClient {
    this.authHeader = authHeader
    return this
  }

  public useIamAuth(): ApiClient {
    this.authHeader = null
    return this
  }

  public async apiFetch<V, Out = Record<any, any>>(body: Body<V>): Promise<Response<Out>> {
    const req = new AWS.HttpRequest(endpoint, region)

    req.method = 'POST'
    req.headers.host = endpoint.host
    req.headers['Content-Type'] = 'application/json'
    req.body = JSON.stringify(body)

    if (!this.authHeader) {
      // @ts-ignore
      const signer = new AWS.Signers.V4(req, 'appsync', true)
      // @ts-ignore
      signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())
    } else {
      req.headers.Authorization = this.authHeader
    }

    const res = await axios({
      method: 'post',
      url: endpoint.href,
      data: req.body,
      headers: req.headers,
    })

    // @ts-ignore
    if (res.data.errors?.length) {
      // @ts-ignore
      res.data.errors.forEach((error: any) => console.log(error))
      // @ts-ignore
      console.warn('TRAVA apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }
}

export default ApiClient
