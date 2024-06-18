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
const createUser_1 = __importDefault(require("./createUser"));
const federatedSignUp = (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('federatedSignUp');
    if (!event.arguments.input)
        throw new Error('No input params passed in request');
    try {
        yield (0, createUser_1.default)(event.arguments.input);
    }
    catch (err) {
        throw err;
    }
    return {
        __typename: 'FederatedSignUpResponse',
        id: event.arguments.input.sub,
    };
});
exports.default = federatedSignUp;
