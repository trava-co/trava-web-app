"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyCallsError = exports.EmptyStringError = exports.ExpectedStringTypeError = exports.UnexpectedEnumValueError = exports.ExpectedItemTypeError = exports.ExpectedArrayTypeError = exports.FunctionNotFoundError = exports.InvalidJsonArgumentsError = exports.MissingRequiredParametersError = exports.ExpectedFunctionCallError = exports.EmptyArrayError = exports.ChatError = void 0;
class ChatError extends Error {
    context;
    constructor(message, context) {
        super(message);
        this.name = this.constructor.name;
        this.context = context;
    }
}
exports.ChatError = ChatError;
class ExpectedFunctionCallError extends ChatError {
    functionName;
    constructor(functionName, context) {
        super(`Expected function call ${functionName}`, context);
        this.functionName = functionName;
    }
}
exports.ExpectedFunctionCallError = ExpectedFunctionCallError;
class MissingRequiredParametersError extends ChatError {
    missingParameters;
    constructor(missingParameters, context) {
        super(`Missing required parameters: ${missingParameters.join(', ')}`, context);
        this.missingParameters = missingParameters;
    }
}
exports.MissingRequiredParametersError = MissingRequiredParametersError;
class InvalidJsonArgumentsError extends ChatError {
    jsonError;
    constructor(jsonError, context) {
        super(`Arguments are not valid JSON: ${jsonError}`, context);
        this.jsonError = jsonError;
    }
}
exports.InvalidJsonArgumentsError = InvalidJsonArgumentsError;
class TooManyCallsError extends ChatError {
    numCalls;
    constructor(numCalls, context) {
        super(`Expected one function call, but received: ${numCalls} calls`, context);
        this.numCalls = numCalls;
    }
}
exports.TooManyCallsError = TooManyCallsError;
class FunctionNotFoundError extends ChatError {
    functionName;
    constructor(functionName, context) {
        super(`No function definition found. Model hallucinated a function to call: ${functionName}`, context);
        this.functionName = functionName;
    }
}
exports.FunctionNotFoundError = FunctionNotFoundError;
class ExpectedArrayTypeError extends ChatError {
    parameter;
    receivedType;
    constructor(parameter, receivedType, context) {
        super(`Expected parameter ${parameter} to be an array, but got ${receivedType}`, context);
        this.parameter = parameter;
        this.receivedType = receivedType;
    }
}
exports.ExpectedArrayTypeError = ExpectedArrayTypeError;
class EmptyArrayError extends ChatError {
    parameter;
    constructor(parameter, context) {
        super(`Expected parameter ${parameter} to be a non-empty array`, context);
        this.parameter = parameter;
    }
}
exports.EmptyArrayError = EmptyArrayError;
class ExpectedItemTypeError extends ChatError {
    parameter;
    expectedType;
    receivedType;
    constructor(parameter, expectedType, receivedType, context) {
        super(`Expected parameter ${parameter} to be an array of ${expectedType}, but got ${receivedType}`, context);
        this.parameter = parameter;
        this.expectedType = expectedType;
        this.receivedType = receivedType;
    }
}
exports.ExpectedItemTypeError = ExpectedItemTypeError;
class UnexpectedEnumValueError extends ChatError {
    parameter;
    expectedType;
    expectedEnumValues;
    receivedValue;
    constructor(parameter, expectedType, expectedEnumValues, receivedValue, context) {
        super(`Expected parameter ${parameter} to be an array of ${expectedType} with values in ${expectedEnumValues}, but got ${receivedValue}`, context);
        this.parameter = parameter;
        this.expectedType = expectedType;
        this.expectedEnumValues = expectedEnumValues;
        this.receivedValue = receivedValue;
    }
}
exports.UnexpectedEnumValueError = UnexpectedEnumValueError;
class ExpectedStringTypeError extends ChatError {
    parameter;
    receivedType;
    constructor(parameter, receivedType, context) {
        super(`Expected parameter ${parameter} to be a string, but got ${receivedType}`, context);
        this.parameter = parameter;
        this.receivedType = receivedType;
    }
}
exports.ExpectedStringTypeError = ExpectedStringTypeError;
class EmptyStringError extends ChatError {
    parameter;
    constructor(parameter, context) {
        super(`Expected parameter ${parameter} to be a non-empty string`, context);
        this.parameter = parameter;
    }
}
exports.EmptyStringError = EmptyStringError;
