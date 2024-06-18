import { AppSyncResolverHandler } from 'aws-lambda'
import {
  GetUserContactsResponse,
  LambdaPrivateGetUserContactsByUserByContactNameQuery,
  LambdaPrivateGetUserContactsByUserByContactNameQueryVariables,
  ModelSortDirection,
  SearchUser,
  LambdaCustomSearchUsersQuery,
  LambdaCustomSearchUsersQueryVariables,
  Contact,
} from 'shared-types/API'
import { lambdaPrivateGetUserContactsByUserByContactName, lambdaCustomSearchUsers } from 'shared-types/graphql/lambda'
import { CUSTOM_NOT_AUTHORIZED_GET_USER_CONTACTS } from 'shared-types/lambdaErrors'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getAllPaginatedData from '../../utils/getAllPaginatedData'

const getUserContacts: AppSyncResolverHandler<any, GetUserContactsResponse> = async (event) => {
  console.log('getUserContacts')

  ApiClient.get().useIamAuth()

  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error(CUSTOM_NOT_AUTHORIZED_GET_USER_CONTACTS)
  }

  const requestingUserId = event.identity.sub

  let userContactsOnTravaIds: string[] = []
  let contactsNotOnTrava: Contact[] = []

  await getAllPaginatedData(
    async (nextToken) => {
      // query UserContact model's local secondary index for all UserContacts for this user in alphabetical order
      const res = await ApiClient.get().apiFetch<
        LambdaPrivateGetUserContactsByUserByContactNameQueryVariables,
        LambdaPrivateGetUserContactsByUserByContactNameQuery
      >({
        query: lambdaPrivateGetUserContactsByUserByContactName,
        variables: {
          userId: requestingUserId,
          sortDirection: ModelSortDirection.ASC,
          nextToken,
          limit: 1000,
        },
      })

      return {
        data: res.data?.privateGetUserContactsByUserByContactName?.items,
        nextToken: res.data?.privateGetUserContactsByUserByContactName?.nextToken,
      }
    },
    (data) => {
      data?.forEach((userContactItem) => {
        if (userContactItem) {
          if (userContactItem.travaUserIds?.length) {
            const parsedTravaUserIds = (userContactItem?.travaUserIds ?? [])?.filter((id): id is string => !!id)
            userContactsOnTravaIds.push(...parsedTravaUserIds)
          } else {
            contactsNotOnTrava.push({
              __typename: 'Contact',
              id: userContactItem.recordId,
              name: userContactItem.name,
              emailAddresses: userContactItem.email ?? [],
              phoneNumbers: userContactItem.phone ?? [],
            })
          }
        }
      })
    },
  )

  // get all User objects for contacts on Trava
  const contactsOnTrava = await getUsersMatchingUserIds(userContactsOnTravaIds)

  // return an array of Users describing contacts on trava, contacts not on trava, and public users
  return {
    __typename: 'GetUserContactsResponse',
    contactsOnTrava,
    contactsNotOnTrava,
    userContactsOnTravaIds,
  }
}

export const getUsersMatchingUserIds = async (userIds: string[]) => {
  const users: SearchUser[] = []

  if (userIds.length === 0) {
    return users
  }

  await getAllPaginatedData(
    async (nextToken) => {
      const res = await ApiClient.get().apiFetch<LambdaCustomSearchUsersQueryVariables, LambdaCustomSearchUsersQuery>({
        query: lambdaCustomSearchUsers,
        variables: {
          nextToken,
          filter: {
            or: [
              ...userIds.map((userId) => {
                return {
                  id: {
                    eq: userId,
                  },
                }
              }),
            ],
          },
        },
      })

      return {
        nextToken: res.data?.searchUsers?.nextToken,
        data: res.data?.searchUsers?.items,
      }
    },
    (data) => {
      data?.forEach((user) => {
        if (user) {
          users.push({
            __typename: 'SearchUser',
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })
        }
      })
    },
  )

  return users
}

export default getUserContacts
