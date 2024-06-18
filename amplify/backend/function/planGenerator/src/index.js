/* Amplify Params - DO NOT EDIT
	API_TRAVA_DISTANCETABLE_ARN
	API_TRAVA_DISTANCETABLE_NAME
	API_TRAVA_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const { Scheduler } = require('./engine')

exports.handler = async (event, context, callback) => {
  return callback(null, await Scheduler(event.arguments))
}
