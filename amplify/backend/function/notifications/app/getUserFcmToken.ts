import { CustomGetUserFcmTokenQuery, CustomGetUserFcmTokenQueryVariables } from 'shared-types/API'
import ApiClient from './utils/apiClient'
import { customGetUserFcmToken } from 'shared-types/graphql/user'

const getUserFcmToken = async (variables: CustomGetUserFcmTokenQueryVariables) => {
  const res = await ApiClient.get()
    .useIamAuth()
    .apiFetch<CustomGetUserFcmTokenQueryVariables, CustomGetUserFcmTokenQuery>({
      query: customGetUserFcmToken,
      variables,
    })
    .catch((err) => {
      throw new Error(err)
    })

  console.log('fcmToken', res.data.getUser?.fcmToken)

  return res.data.getUser?.fcmToken || ''
}

export default getUserFcmToken
