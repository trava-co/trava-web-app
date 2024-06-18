import getAllPaginatedData from '../../utils/getAllPaginatedData'
import ApiClient from '../../utils/ApiClient/ApiClient'
import {
  UserContact,
  LambdaPrivateListUserContactsQueryVariables,
  LambdaPrivateListUserContactsQuery,
} from 'shared-types/API'
import { lambdaPrivateListUserContacts } from 'shared-types/graphql/lambda'

const getAllUserContacts = async (userId: string) => {
  // get all UserContacts for this user
  const userContacts: UserContact[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateListUserContactsQueryVariables,
        LambdaPrivateListUserContactsQuery
      >({
        query: lambdaPrivateListUserContacts,
        variables: {
          userId,
          nextToken,
          limit: 1000,
        },
      })

      return {
        data: res.data?.privateListUserContacts?.items,
        nextToken: res.data?.privateListUserContacts?.nextToken,
      }
    },
    (data) => {
      data?.forEach((item) => {
        if (!item) return

        userContacts.push(item)
      })
    },
  )

  return userContacts
}

export default getAllUserContacts
