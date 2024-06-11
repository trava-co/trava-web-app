import { ApiCallHandler } from './api-call-handler.ts';
import { getUser } from './graphql/queries.ts';

class UserApi {
  static async getUserById(id: string) {
    return await ApiCallHandler._apiCall({
      query: getUser,
      variables: { id },
    });
  }
}

export default UserApi;