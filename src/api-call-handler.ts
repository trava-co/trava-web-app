import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql'
import { API } from 'aws-amplify'
import Observable from 'zen-observable-ts'

interface SubscriptionResult<T> {
  value: {
    data: T
  }
  provider: any
}

export const ApiCallHandler = {
  async _apiCall<T>(options: GraphQLOptions) {
    try {
      const result = (await API.graphql(options)) as GraphQLResult<T>

      if (!result.data) {
        throw new Error('Request returned no data')
      }

      return result.data
    } catch (error) {
      if (error?.errors && error?.errors.length) {
        error.errors.forEach((item: any, index: number) => {
          console.error(index, item)
        })
      }

      throw error
    }
  },

  _apiSubscription<T>(options: GraphQLOptions) {
    return API.graphql(options) as Observable<SubscriptionResult<T>>
  },
}
