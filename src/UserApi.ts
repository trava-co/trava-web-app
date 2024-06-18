import { ApiCallHandler } from './api-call-handler';
import { getUser } from './graphql/queries';
import { customGetAttractionsForScheduler } from './graphql/attraction'
import { customGenerateTripPlan } from './graphql/tripPlan'
import { CustomGetAttractionsForSchedulerQueryVariables, CustomGetAttractionsForSchedulerQuery,
         CustomGenerateTripPlanQueryVariables, CustomGenerateTripPlanQuery } from './API';

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

  static async generateTripPlan(variables?: CustomGenerateTripPlanQueryVariables) {
    const result = await ApiCallHandler._apiCall<CustomGenerateTripPlanQuery>({
      query: customGenerateTripPlan,
      variables,
    })

    return result.generateTripPlan
  }
}

export default UserApi;