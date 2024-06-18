"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const lambda_1 = require("shared-types/graphql/lambda");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
const getAllUsers_1 = __importDefault(require("./getAllUsers"));
const getAllUserContacts_1 = __importDefault(require("./getAllUserContacts"));
const CHUNK_SIZE = 10;
const syncContacts = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('syncContacts');
    ApiClient_1.default.get().useIamAuth();
    // check authorization type === AMAZON_COGNITO_USER_POOLS
    if (!(event.identity && 'sub' in event.identity)) {
        throw new Error('Not authorized');
    }
    const requestingUserId = event.identity.sub;
    const phoneBookContacts = event.arguments.input.contacts;
    // get all Users in the Users table, and all UserContacts for this user
    const [travaUsers, userContactsInDb] = yield Promise.all([
        (0, getAllUsers_1.default)(requestingUserId),
        (0, getAllUserContacts_1.default)(requestingUserId),
    ]);
    const userContactsToUpdate = [];
    const userContactsToCreate = [];
    // for each phoneBookContact, check if it exists in UserContact table already. If it doesn't, create it. If it does, check if it has changed, and if it has, update it.
    phoneBookContacts.forEach((phoneBookContact) => {
        const userContactExistsInDb = userContactsInDb.find((userContactInDb) => userContactInDb.recordId === phoneBookContact.recordId);
        // find if there are any users in the Users table with matching email/phone
        const travaUserIdsMatchingContactInfoFromPhoneBookContact = findTravaUsersMatchingPhoneBookContact(phoneBookContact, travaUsers);
        if (!userContactExistsInDb) {
            // userContact does not exists in DB. add to userContactsToCreate.
            userContactsToCreate.push({
                userId: requestingUserId,
                recordId: phoneBookContact.recordId,
                travaUserIds: travaUserIdsMatchingContactInfoFromPhoneBookContact,
                name: phoneBookContact.name,
                email: phoneBookContact.email,
                phone: phoneBookContact.phone,
            });
        }
        else {
            // userContact exists in DB. Check if it has changed, comparing name, email, phone, and travaUserIds
            const contactToAddIfUpdated = Object.assign(Object.assign({}, userContactExistsInDb), { name: phoneBookContact.name, email: phoneBookContact.email, phone: phoneBookContact.phone, travaUserIds: travaUserIdsMatchingContactInfoFromPhoneBookContact });
            const nameIsSame = userContactExistsInDb.name === phoneBookContact.name;
            if (!nameIsSame) {
                return userContactsToUpdate.push(contactToAddIfUpdated);
            }
            // remove nulls from arrays to prevent TS issues
            const parsedEmailsFromUserContactInDb = removeNullsFromArray(userContactExistsInDb.email);
            const parsedEmailsFromPhoneBookContact = removeNullsFromArray(phoneBookContact.email);
            const emailsAreSame = arraysAreEqual(parsedEmailsFromUserContactInDb, parsedEmailsFromPhoneBookContact);
            if (!emailsAreSame) {
                return userContactsToUpdate.push(contactToAddIfUpdated);
            }
            const parsedPhoneNumbersFromUserContactInDb = removeNullsFromArray(userContactExistsInDb.phone);
            const parsedPhoneNumbersFromPhoneBookContact = removeNullsFromArray(phoneBookContact.phone);
            const phoneNumbersAreSame = arraysAreEqual(parsedPhoneNumbersFromUserContactInDb, parsedPhoneNumbersFromPhoneBookContact);
            if (!phoneNumbersAreSame) {
                return userContactsToUpdate.push(contactToAddIfUpdated);
            }
            const travaUserIdsMatchingContactInfoInDbRecord = removeNullsFromArray(userContactExistsInDb.travaUserIds);
            // check if the arrays of matching trava users are the same
            const travaUserIdsMatchingContactInfoIsSame = arraysAreEqual(travaUserIdsMatchingContactInfoInDbRecord, travaUserIdsMatchingContactInfoFromPhoneBookContact);
            if (!travaUserIdsMatchingContactInfoIsSame) {
                return userContactsToUpdate.push(contactToAddIfUpdated);
            }
            // otherwise, everything is the same, so no update required
        }
    });
    // for each userContact in the DB, check if it exists in the phoneBookContacts. If it doesn't, delete it.
    const userContactsToDelete = userContactsInDb
        .filter((userContactInDb) => {
        return !phoneBookContacts.find((phoneBookContact) => phoneBookContact.recordId === userContactInDb.recordId);
    })
        .map((userContactInDb) => {
        return {
            userId: requestingUserId,
            recordId: userContactInDb.recordId,
        };
    });
    // create new records
    const createPromises = userContactsToCreate.map((userContactToCreate) => __awaiter(void 0, void 0, void 0, function* () {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateCreateUserContact,
            variables: {
                input: userContactToCreate,
            },
        });
    }));
    // update existing records
    const updatePromises = userContactsToUpdate.map((userContactToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateUpdateUserContact,
            variables: {
                input: userContactToUpdate,
            },
        });
    }));
    // delete records
    const deletePromises = userContactsToDelete.map((userContactToDelete) => __awaiter(void 0, void 0, void 0, function* () {
        return ApiClient_1.default.get().apiFetch({
            query: lambda_1.lambdaPrivateDeleteUserContact,
            variables: {
                input: userContactToDelete,
            },
        });
    }));
    const chunksCreatePromises = (0, lodash_chunk_1.default)(createPromises, CHUNK_SIZE);
    const chunksUpdatePromises = (0, lodash_chunk_1.default)(updatePromises, CHUNK_SIZE);
    const chunksDeletePromises = (0, lodash_chunk_1.default)(deletePromises, CHUNK_SIZE);
    for (const chunkOfPromises of chunksCreatePromises) {
        yield Promise.all(chunkOfPromises);
    }
    for (const chunkOfPromises of chunksUpdatePromises) {
        yield Promise.all(chunkOfPromises);
    }
    for (const chunkOfPromises of chunksDeletePromises) {
        yield Promise.all(chunkOfPromises);
    }
});
/** for input phoneBookContact, checks if any trava users exists with matching email/phone info and returns matched user ids */
const findTravaUsersMatchingPhoneBookContact = (phoneBookContact, travaUsers) => {
    const matchedUserIds = [];
    const phoneBookContactEmails = phoneBookContact.email
        .filter((email) => !!email)
        .map((email) => email.toLowerCase());
    const phoneBookContactPhones = phoneBookContact.phone
        .filter((phone) => !!phone)
        .map((phone) => formatPhoneNumberLastEightDigits(phone));
    // check if there are any users in the Users table with matching email/phone
    travaUsers.forEach((travaUser) => {
        var _a, _b;
        const travaUserEmail = (_a = travaUser.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const travaUserPhone = formatPhoneNumberLastEightDigits((_b = travaUser.phone) !== null && _b !== void 0 ? _b : '');
        if (travaUserEmail && phoneBookContactEmails.includes(travaUserEmail)) {
            return matchedUserIds.push(travaUser.id);
        }
        if (travaUserPhone && phoneBookContactPhones.includes(travaUserPhone)) {
            matchedUserIds.push(travaUser.id);
        }
    });
    return matchedUserIds;
};
/** checks if two arrays are equal */
function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    const sortedArr1 = arr1.sort();
    const sortedArr2 = arr2.sort();
    for (let i = 0; i < arr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }
    return true;
}
/** sanitizes phone number and returns the last 8 digits */
function formatPhoneNumberLastEightDigits(phoneNumber) {
    const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    return formattedPhoneNumber.length > 8 ? formattedPhoneNumber.slice(-8) : formattedPhoneNumber;
}
/** removes nulls from array */
const removeNullsFromArray = (arr) => {
    if (!arr)
        return [];
    return arr.filter((item) => !!item);
};
exports.default = syncContacts;
