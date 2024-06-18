import * as AWS from 'aws-sdk'
import axios from 'axios'
import { getSSMVariable } from '../getSSMVariable'

// TODO make me dynamic
const appsyncUrl = 'https://md6aoumzf5enrlp3v4h6vo5ydy.appsync-api.us-east-1.amazonaws.com/graphql'
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

class ApiClientProd {
  private static instance: ApiClientProd
  private authHeader: string | null

  private constructor() {
    this.authHeader = null
  }

  public static get(): ApiClientProd {
    if (!ApiClientProd.instance) {
      ApiClientProd.instance = new ApiClientProd()
    }

    return ApiClientProd.instance
  }

  public useAwsCognitoUserPoolAuth(authHeader: string): ApiClientProd {
    this.authHeader = authHeader
    return this
  }

  public useIamAuth(): ApiClientProd {
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
      // accessKeyId and secretAccessKey of IAM user api_client_production
      const credentials = {
        accessKeyId: await getSSMVariable('API_CLIENT_PRODUCTION_ACCESS_KEY_ID'),
        secretAccessKey: await getSSMVariable('API_CLIENT_PRODUCTION_SECRET_ACCESS_KEY'),
      }

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
      console.warn('TRAVA apiClientProd - errors', res.data.errors)
    }

    return res.data as Response<Out>
  }
}

export default ApiClientProd
