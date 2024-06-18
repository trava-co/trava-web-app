class ChatError extends Error {
	context: string
	constructor(message: string, context: string) {
		super(message)
		this.name = this.constructor.name
		this.context = context
	}
}

class ExpectedFunctionCallError extends ChatError {
	functionName: string

	constructor(functionName: string, context: string) {
		super(`Expected function call ${functionName}`, context)
		this.functionName = functionName
	}
}

class MissingRequiredParametersError extends ChatError {
	missingParameters: string[]

	constructor(missingParameters: string[], context: string) {
		super(
			`Missing required parameters: ${missingParameters.join(', ')}`,
			context,
		)
		this.missingParameters = missingParameters
	}
}

class InvalidJsonArgumentsError extends ChatError {
	jsonError: string

	constructor(jsonError: string, context: string) {
		super(`Arguments are not valid JSON: ${jsonError}`, context)
		this.jsonError = jsonError
	}
}

class TooManyCallsError extends ChatError {
	numCalls: number

	constructor(numCalls: number, context: string) {
		super(
			`Expected one function call, but received: ${numCalls} calls`,
			context,
		)
		this.numCalls = numCalls
	}
}

class FunctionNotFoundError extends ChatError {
	functionName: string

	constructor(functionName: string, context: string) {
		super(
			`No function definition found. Model hallucinated a function to call: ${functionName}`,
			context,
		)
		this.functionName = functionName
	}
}

class ExpectedArrayTypeError extends ChatError {
	parameter: string
	receivedType: string

	constructor(parameter: string, receivedType: string, context: string) {
		super(
			`Expected parameter ${parameter} to be an array, but got ${receivedType}`,
			context,
		)
		this.parameter = parameter
		this.receivedType = receivedType
	}
}

class EmptyArrayError extends ChatError {
	parameter: string

	constructor(parameter: string, context: string) {
		super(`Expected parameter ${parameter} to be a non-empty array`, context)
		this.parameter = parameter
	}
}

class ExpectedItemTypeError extends ChatError {
	parameter: string
	expectedType: string
	receivedType: string

	constructor(
		parameter: string,
		expectedType: string,
		receivedType: string,
		context: string,
	) {
		super(
			`Expected parameter ${parameter} to be an array of ${expectedType}, but got ${receivedType}`,
			context,
		)
		this.parameter = parameter
		this.expectedType = expectedType
		this.receivedType = receivedType
	}
}

class UnexpectedEnumValueError extends ChatError {
	parameter: string
	expectedType: string
	expectedEnumValues: string[]
	receivedValue: any

	constructor(
		parameter: string,
		expectedType: string,
		expectedEnumValues: string[],
		receivedValue: any,
		context: string,
	) {
		super(
			`Expected parameter ${parameter} to be an array of ${expectedType} with values in ${expectedEnumValues}, but got ${receivedValue}`,
			context,
		)
		this.parameter = parameter
		this.expectedType = expectedType
		this.expectedEnumValues = expectedEnumValues
		this.receivedValue = receivedValue
	}
}

class ExpectedStringTypeError extends ChatError {
	parameter: string
	receivedType: string

	constructor(parameter: string, receivedType: string, context: string) {
		super(
			`Expected parameter ${parameter} to be a string, but got ${receivedType}`,
			context,
		)
		this.parameter = parameter
		this.receivedType = receivedType
	}
}

class EmptyStringError extends ChatError {
	parameter: string

	constructor(parameter: string, context: string) {
		super(`Expected parameter ${parameter} to be a non-empty string`, context)
		this.parameter = parameter
	}
}

export {
	ChatError,
	EmptyArrayError,
	ExpectedFunctionCallError,
	MissingRequiredParametersError,
	InvalidJsonArgumentsError,
	FunctionNotFoundError,
	ExpectedArrayTypeError,
	ExpectedItemTypeError,
	UnexpectedEnumValueError,
	ExpectedStringTypeError,
	EmptyStringError,
	TooManyCallsError,
}
