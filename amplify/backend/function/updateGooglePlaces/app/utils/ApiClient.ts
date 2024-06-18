import * as AWS from 'aws-sdk'
import axios from 'axios'
import { getSSMVariable } from './getSSMVariable'

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
      // needs to be set this way, otherwise this will not work on mock
      // see: https://github.com/aws-amplify/amplify-cli/issues/9100
      const mockCredentials = {
        accessKeyId: 'ASIAVJKIAM-AuthRole',
        secretAccessKey: 'fake',
      }
      const credentials = endpoint.hostname === 'localhost' ? mockCredentials : AWS.config.credentials

      // @ts-ignore
      const signer = new AWS.Signers.V4(req, 'appsync', true)
      // @ts-ignore
      signer.addAuthorization(credentials, AWS.util.date.getDate())
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

  public async openSearchFetch<V, Out = Record<any, any>>(index: string, body: V): Promise<Response<Out>> {
    const openSearchUrl = (await getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test'
    const openSearchEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_search`)
    const req = new AWS.HttpRequest(openSearchEndpoint, region)

    req.method = 'POST'
    req.headers.host = req.endpoint.host
    req.headers['Content-Type'] = 'application/json'
    req.body = JSON.stringify(body)

    if (!this.authHeader) {
      const mockCredentials = {
        accessKeyId: 'ASIAVJKIAM-AuthRole',
        secretAccessKey: 'fake',
      }
      const credentials = req.endpoint.hostname === 'localhost' ? mockCredentials : AWS.config.credentials

      // @ts-ignore
      const signer = new AWS.Signers.V4(req, 'es', true)
      // @ts-ignore
      signer.addAuthorization(credentials, AWS.util.date.getDate())
    } else {
      req.headers.Authorization = this.authHeader
    }

    const res = await axios({
      method: 'post',
      url: openSearchEndpoint.href,
      data: req.body,
      headers: req.headers,
    })

    if (res.data.errors?.length) {
      res.data.errors.forEach((error: any) => console.log(error))
      console.warn('TRAVA opensearch apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }

  public async openSearchMSearch<Out = Record<any, any>>(index: string, body: string | Buffer): Promise<Response<Out>> {
    const openSearchUrl = (await getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test'
    const openSearchMultiSearchEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_msearch`)
    const req = new AWS.HttpRequest(openSearchMultiSearchEndpoint, region)

    req.method = 'POST'
    req.headers.host = req.endpoint.host
    req.headers['Content-Type'] = 'application/x-ndjson'
    req.body = body

    if (!this.authHeader) {
      const mockCredentials = {
        accessKeyId: 'ASIAVJKIAM-AuthRole',
        secretAccessKey: 'fake',
      }
      const credentials = req.endpoint.hostname === 'localhost' ? mockCredentials : AWS.config.credentials

      // @ts-ignore
      const signer = new AWS.Signers.V4(req, 'es', true)
      // @ts-ignore
      signer.addAuthorization(credentials, AWS.util.date.getDate())
    } else {
      req.headers.Authorization = this.authHeader
    }

    const res = await axios({
      method: 'post',
      url: openSearchMultiSearchEndpoint.href,
      data: req.body,
      headers: req.headers,
    })

    if (res.data.errors?.length) {
      res.data.errors.forEach((error: any) => console.log(error))
      console.warn('TRAVA opensearch multisearch apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }
}

export default ApiClient
