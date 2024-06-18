import * as AWS from 'aws-sdk'
import axios from 'axios'
import { getSSMVariable } from './getSSMVariable'

const region = process.env.REGION as string

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

    // @ts-ignore
    if (res.data.errors?.length) {
      // @ts-ignore
      res.data.errors.forEach((error: any) => console.log(error))
      // @ts-ignore
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

    // @ts-ignore
    if (res.data.errors?.length) {
      // @ts-ignore
      res.data.errors.forEach((error: any) => console.log(error))
      // @ts-ignore
      console.warn('TRAVA opensearch multisearch apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }

  // Method to initiate the scroll context
  public async openSearchScrollInit<V, Out = Record<any, any>>(
    index: string,
    body: V,
    scrollDuration: string = '1m', // default scroll duration
  ): Promise<Response<Out>> {
    const openSearchUrl = (await getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test'
    const openSearchScrollInitEndpoint = new AWS.Endpoint(`${openSearchUrl}/${index}/_search?scroll=${scrollDuration}`)
    const req = new AWS.HttpRequest(openSearchScrollInitEndpoint, region)

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
      url: openSearchScrollInitEndpoint.href,
      data: req.body,
      headers: req.headers,
    })

    // @ts-ignore
    if (res.data.errors?.length) {
      // @ts-ignore
      res.data.errors.forEach((error: any) => console.log(error))
      // @ts-ignore
      console.warn('TRAVA opensearch apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }

  // Method to continue scrolling with the existing scroll ID
  public async openSearchScrollContinue<Out = Record<any, any>>(
    scrollId: string,
    scrollDuration: string = '1m', // default scroll duration
  ): Promise<Response<Out>> {
    const openSearchUrl = (await getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test'
    const openSearchScrollContinueEndpoint = new AWS.Endpoint(`${openSearchUrl}/_search/scroll`)
    const req = new AWS.HttpRequest(openSearchScrollContinueEndpoint, region)

    req.method = 'POST'
    req.headers.host = req.endpoint.host
    req.headers['Content-Type'] = 'application/json'
    req.body = JSON.stringify({
      scroll: scrollDuration,
      scroll_id: scrollId,
    })

    // AWS signing logic
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
      url: openSearchScrollContinueEndpoint.href,
      data: req.body,
      headers: req.headers,
    })

    if (res.data.errors?.length) {
      res.data.errors.forEach((error: any) => console.log(error))
      console.warn('TRAVA opensearch apiClient - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }

  // Method to clear the scroll context
  public async openSearchScrollClear(scrollId: string[]): Promise<void> {
    const openSearchUrl = (await getSSMVariable('OPENSEARCH_ENDPOINT')) || 'test'
    const openSearchClearScrollEndpoint = new AWS.Endpoint(`${openSearchUrl}/_search/scroll`)
    const req = new AWS.HttpRequest(openSearchClearScrollEndpoint, region)

    req.method = 'DELETE'
    req.headers.host = req.endpoint.host
    req.headers['Content-Type'] = 'application/json'
    req.body = JSON.stringify({
      scroll_id: scrollId,
    })

    // AWS signing logic
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

    try {
      await axios({
        method: 'delete',
        url: openSearchClearScrollEndpoint.href,
        data: req.body,
        headers: req.headers,
      })
    } catch (error) {
      console.error('Error in openSearchScrollClear:', error)
      throw error
    }
  }
}

export default ApiClient
