import ApiClient from '../../utils/ApiClient/ApiClient'
import { LambdaGetReferringUserInfoQuery, LambdaGetReferringUserInfoQueryVariables } from 'shared-types/API'
import { lambdaGetReferringUserInfo } from 'shared-types/graphql/lambda'

const getReferringUserInfo = async (userId: string) => {
  const res = await ApiClient.get().apiFetch<LambdaGetReferringUserInfoQueryVariables, LambdaGetReferringUserInfoQuery>(
    {
      query: lambdaGetReferringUserInfo,
      variables: {
        id: userId,
      },
    },
  )
  return res.data?.getUser
}

export default getReferringUserInfo
