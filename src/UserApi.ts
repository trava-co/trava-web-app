import { ApiCallHandler } from './api-call-handler.ts';
import { getUser, customGetAttractionsForScheduler } from './graphql/queries.ts';

class UserApi {
  static async getUserById(id: string) {
    return await ApiCallHandler._apiCall({
      query: getUser,
      variables: { id },
    });
  }

  async getAttractionsForScheduler(variables: CustomGetAttractionsForSchedulerQueryVariables) {
    const result = await ApiCallHandler._apiCall<CustomGetAttractionsForSchedulerQuery>({
      query: customGetAttractionsForScheduler,
      variables,
    })

    return result.getAttractionsForScheduler
  }
}

export default UserApi;