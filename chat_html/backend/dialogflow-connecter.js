const dialogflow = require('dialogflow');
const uuid = require('uuid/v1');
const { projects, credentials } = require('./utils/service-credentials/credentials');

// let privateKey = (process.env.NODE_ENV == "production") ? JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY) : process.env.DIALOGFLOW_PRIVATE_KEY
// let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL

async function sendTextMessageToDialogFlow(body, res) {
	// Define session path
	let { sessionID, projectID } = body;
	let config = {
		credentials: {}
	};
	sessionID = sessionID || uuid();
	projectID = projects[projectID];
	if (!projectID || !credentials[projectID]) {
		res.status(400).send('project ID not found');
	}
	config.credentials = credentials[projectID];
	const sessionClient = new dialogflow.SessionsClient(config);
	const sessionPath = sessionClient.sessionPath(projectID, sessionID);

	let request = processRequest(sessionPath, body, res);

	try {
		return await sessionClient.detectIntent(request);
	} catch (err) {
		console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
		res.status(400).send('something went wrong');
		throw err;
	}
}
function processRequest(sessionPath, body, res) {
	let { query, event } = body;
	if (!(query || (event && event.name))) {
		res.status(400).send('query or event name not found');
	}
	let request = {
		session: sessionPath,
		queryInput: {
			text: {
				text: query,
				languageCode: 'en'
			}
		}
	};
	if (event) {
		request.queryInput.event = {
			name: event.name,
			parameters: event.parameters || {},
			languageCode: 'en'
		};
	} else {
		request.queryInput.text = {
			text: query,
			languageCode: 'en'
		};
	}
	return request;
}

module.exports = {
	sendTextMessageToDialogFlow
};
