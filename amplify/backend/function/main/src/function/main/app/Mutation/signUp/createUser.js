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
exports.createUserMutation = void 0;
const API_1 = require("shared-types/API");
const ApiClient_1 = __importDefault(require("../../utils/ApiClient/ApiClient"));
exports.createUserMutation = `
  mutation CreateUser($input: CreateUserInput!, $condition: ModelUserConditionInput) {
    createUser(input: $input, condition: $condition) {
      id
    }
  }
`;
function create(user) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ApiClient_1.default.get()
            .useIamAuth()
            .apiFetch({
            query: exports.createUserMutation,
            variables: {
                input: user,
            },
        });
        // TODO unified error handler
        if ((_a = res.errors) === null || _a === void 0 ? void 0 : _a.length) {
            throw new Error(`Error calling method: ${res.errors.map((error) => error.message)}`);
        }
        return res.data.createUser;
    });
}
function getPrivacy(privacy) {
    if (privacy === API_1.PRIVACY.PRIVATE)
        return API_1.PRIVACY.PRIVATE;
    return API_1.PRIVACY.PUBLIC;
}
function createUser(sub, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = {
            id: sub,
            email: data.email,
            phone: data.phone,
            username: data.username,
            dateOfBirth: data.dateOfBirth,
            name: data.name,
            privacy: getPrivacy(data.privacy),
            pushNotifications: true,
        };
        yield create(input);
    });
}
exports.default = createUser;
