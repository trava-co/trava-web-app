import { ApiCallHandler } from './api-call-handler.ts';
import { getUser } from './graphql/queries.ts';
import { customGetAttractionsForScheduler } from './graphql/attraction.ts'
import { CustomGetAttractionsForSchedulerQueryVariables, CustomGetAttractionsForSchedulerQuery } from './API.ts';

class UserApi {
  static async getUserById(id: string) {
    return await ApiCallHandler._apiCall({
      query: getUser,
      variables: { id },
    });
  }

  static async getAttractionsForScheduler(variables: CustomGetAttractionsForSchedulerQueryVariables) {
    const result = await ApiCallHandler._apiCall<CustomGetAttractionsForSchedulerQuery>({
      query: customGetAttractionsForScheduler,
      variables,
    })

    return result.getAttractionsForScheduler
  }
}

export default UserApi;