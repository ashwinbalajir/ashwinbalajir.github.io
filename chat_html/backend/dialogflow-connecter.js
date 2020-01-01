const dialogflow = require("dialogflow");


// let privateKey = (process.env.NODE_ENV == "production") ? JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY) : process.env.DIALOGFLOW_PRIVATE_KEY
// let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL



async function sendTextMessageToDialogFlow(textMessage, sessionId,config) {
  // Define session path
  let sessionClient = new dialogflow.SessionsClient(config);

  console.log("in", config.credentials.projectId, sessionId);

  const sessionPath = sessionClient.sessionPath(config.credentials.projectId, sessionId);
  console.log("TCL: sendTextMessageToDialogFlow -> sessionPath", sessionPath);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textMessage,
        languageCode: "en"
      }
    }
  };
  console.log("TCL: sendTextMessageToDialogFlow -> request", request);
  try {
    return await sessionClient.detectIntent(request);

    // let responses = await this.sessionClient.detectIntent(request)
    // console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent', responses);
    // return responses
  } catch (err) {
    console.error("DialogFlow.sendTextMessageToDialogFlow ERROR:", err);
    throw err;
  }
}

module.exports = {
  sendTextMessageToDialogFlow
};
