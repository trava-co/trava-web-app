import { AppSyncResolverHandler } from 'aws-lambda'
import chunk from 'lodash.chunk'
import {
  SyncContactsMutationVariables,
  PhoneBookContact,
  CreateUserContactInput,
  UpdateUserContactInput,
  DeleteUserContactInput,
  LambdaPrivateCreateUserContactMutationVariables,
  LambdaPrivateCreateUserContactMutation,
  LambdaPrivateUpdateUserContactMutationVariables,
  LambdaPrivateUpdateUserContactMutation,
  LambdaPrivateDeleteUserContactMutationVariables,
  LambdaPrivateDeleteUserContactMutation,
  SearchUser,
} from 'shared-types/API'
import {
  lambdaPrivateCreateUserContact,
  lambdaPrivateUpdateUserContact,
  lambdaPrivateDeleteUserContact,
} from 'shared-types/graphql/lambda'
import ApiClient from '../../utils/ApiClient/ApiClient'
import getAllUsers from './getAllUsers'
import getAllUserContacts from './getAllUserContacts'

const CHUNK_SIZE = 10

const syncContacts: AppSyncResolverHandler<SyncContactsMutationVariables, any> = async (event) => {
  console.log('syncContacts')

  ApiClient.get().useIamAuth()
  // check authorization type === AMAZON_COGNITO_USER_POOLS
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('Not authorized')
  }

  const requestingUserId = event.identity.sub
  const phoneBookContacts = event.arguments.input.contacts

  // get all Users in the Users table, and all UserContacts for this user
  const [travaUsers, userContactsInDb] = await Promise.all([
    getAllUsers(requestingUserId),
    getAllUserContacts(requestingUserId),
  ])

  const userContactsToUpdate: UpdateUserContactInput[] = []
  const userContactsToCreate: CreateUserContactInput[] = []

  // for each phoneBookContact, check if it exists in UserContact table already. If it doesn't, create it. If it does, check if it has changed, and if it has, update it.
  phoneBookContacts.forEach((phoneBookContact) => {
    const userContactExistsInDb = userContactsInDb.find(
      (userContactInDb) => userContactInDb.recordId === phoneBookContact.recordId,
    )

    // find if there are any users in the Users table with matching email/phone
    const travaUserIdsMatchingContactInfoFromPhoneBookContact = findTravaUsersMatchingPhoneBookContact(
      phoneBookContact,
      travaUsers,
    )

    if (!userContactExistsInDb) {
      // userContact does not exists in DB. add to userContactsToCreate.
      userContactsToCreate.push({
        userId: requestingUserId,
        recordId: phoneBookContact.recordId,
        travaUserIds: travaUserIdsMatchingContactInfoFromPhoneBookContact,
        name: phoneBookContact.name,
        email: phoneBookContact.email,
        phone: phoneBookContact.phone,
      })
    } else {
      // userContact exists in DB. Check if it has changed, comparing name, email, phone, and travaUserIds
      const contactToAddIfUpdated = {
        ...userContactExistsInDb,
        name: phoneBookContact.name,
        email: phoneBookContact.email,
        phone: phoneBookContact.phone,
        travaUserIds: travaUserIdsMatchingContactInfoFromPhoneBookContact,
      }

      const nameIsSame = userContactExistsInDb.name === phoneBookContact.name

      if (!nameIsSame) {
        return userContactsToUpdate.push(contactToAddIfUpdated)
      }

      // remove nulls from arrays to prevent TS issues
      const parsedEmailsFromUserContactInDb = removeNullsFromArray(userContactExistsInDb.email)
      const parsedEmailsFromPhoneBookContact = removeNullsFromArray(phoneBookContact.email)

      const emailsAreSame = arraysAreEqual(parsedEmailsFromUserContactInDb, parsedEmailsFromPhoneBookContact)

      if (!emailsAreSame) {
        return userContactsToUpdate.push(contactToAddIfUpdated)
      }

      const parsedPhoneNumbersFromUserContactInDb = removeNullsFromArray(userContactExistsInDb.phone)
      const parsedPhoneNumbersFromPhoneBookContact = removeNullsFromArray(phoneBookContact.phone)

      const phoneNumbersAreSame = arraysAreEqual(
        parsedPhoneNumbersFromUserContactInDb,
        parsedPhoneNumbersFromPhoneBookContact,
      )

      if (!phoneNumbersAreSame) {
        return userContactsToUpdate.push(contactToAddIfUpdated)
      }

      const travaUserIdsMatchingContactInfoInDbRecord = removeNullsFromArray(userContactExistsInDb.travaUserIds)

      // check if the arrays of matching trava users are the same
      const travaUserIdsMatchingContactInfoIsSame = arraysAreEqual(
        travaUserIdsMatchingContactInfoInDbRecord,
        travaUserIdsMatchingContactInfoFromPhoneBookContact,
      )

      if (!travaUserIdsMatchingContactInfoIsSame) {
        return userContactsToUpdate.push(contactToAddIfUpdated)
      }

      // otherwise, everything is the same, so no update required
    }
  })

  // for each userContact in the DB, check if it exists in the phoneBookContacts. If it doesn't, delete it.
  const userContactsToDelete: DeleteUserContactInput[] = userContactsInDb
    .filter((userContactInDb) => {
      return !phoneBookContacts.find((phoneBookContact) => phoneBookContact.recordId === userContactInDb.recordId)
    })
    .map((userContactInDb) => {
      return {
        userId: requestingUserId,
        recordId: userContactInDb.recordId,
      }
    })

  // create new records
  const createPromises = userContactsToCreate.map(async (userContactToCreate) => {
    return ApiClient.get().apiFetch<
      LambdaPrivateCreateUserContactMutationVariables,
      LambdaPrivateCreateUserContactMutation
    >({
      query: lambdaPrivateCreateUserContact,
      variables: {
        input: userContactToCreate,
      },
    })
  })

  // update existing records
  const updatePromises = userContactsToUpdate.map(async (userContactToUpdate) => {
    return ApiClient.get().apiFetch<
      LambdaPrivateUpdateUserContactMutationVariables,
      LambdaPrivateUpdateUserContactMutation
    >({
      query: lambdaPrivateUpdateUserContact,
      variables: {
        input: userContactToUpdate,
      },
    })
  })

  // delete records
  const deletePromises = userContactsToDelete.map(async (userContactToDelete) => {
    return ApiClient.get().apiFetch<
      LambdaPrivateDeleteUserContactMutationVariables,
      LambdaPrivateDeleteUserContactMutation
    >({
      query: lambdaPrivateDeleteUserContact,
      variables: {
        input: userContactToDelete,
      },
    })
  })

  const chunksCreatePromises = chunk(createPromises, CHUNK_SIZE)
  const chunksUpdatePromises = chunk(updatePromises, CHUNK_SIZE)
  const chunksDeletePromises = chunk(deletePromises, CHUNK_SIZE)

  for (const chunkOfPromises of chunksCreatePromises) {
    await Promise.all(chunkOfPromises)
  }

  for (const chunkOfPromises of chunksUpdatePromises) {
    await Promise.all(chunkOfPromises)
  }

  for (const chunkOfPromises of chunksDeletePromises) {
    await Promise.all(chunkOfPromises)
  }
}

/** for input phoneBookContact, checks if any trava users exists with matching email/phone info and returns matched user ids */
const findTravaUsersMatchingPhoneBookContact = (phoneBookContact: PhoneBookContact, travaUsers: SearchUser[]) => {
  const matchedUserIds: string[] = []
  const phoneBookContactEmails = phoneBookContact.email
    .filter((email): email is string => !!email)
    .map((email) => email.toLowerCase())
  const phoneBookContactPhones = phoneBookContact.phone
    .filter((phone): phone is string => !!phone)
    .map((phone) => formatPhoneNumberLastEightDigits(phone))

  // check if there are any users in the Users table with matching email/phone
  travaUsers.forEach((travaUser) => {
    const travaUserEmail = travaUser.email?.toLowerCase()
    const travaUserPhone = formatPhoneNumberLastEightDigits(travaUser.phone ?? '')

    if (travaUserEmail && phoneBookContactEmails.includes(travaUserEmail)) {
      return matchedUserIds.push(travaUser.id)
    }

    if (travaUserPhone && phoneBookContactPhones.includes(travaUserPhone)) {
      matchedUserIds.push(travaUser.id)
    }
  })

  return matchedUserIds
}

/** checks if two arrays are equal */
function arraysAreEqual(arr1: String[], arr2: String[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  const sortedArr1 = arr1.sort()
  const sortedArr2 = arr2.sort()

  for (let i = 0; i < arr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false
    }
  }

  return true
}

/** sanitizes phone number and returns the last 8 digits */
function formatPhoneNumberLastEightDigits(phoneNumber: string) {
  const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
  return formattedPhoneNumber.length > 8 ? formattedPhoneNumber.slice(-8) : formattedPhoneNumber
}

/** removes nulls from array */
const removeNullsFromArray = (arr: (string | null)[] | null | undefined) => {
  if (!arr) return []

  return arr.filter((item): item is string => !!item)
}

export default syncContacts
