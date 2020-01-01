const express = require('express');
const cors = require('cors');
const app = express();
const request=require('request');
const credentials=require("./utils/projects/credentials");
const fs=require('fs');
require('dotenv').config();

const connecter = require('./dialogflow-connecter');
let PORT = process.env.PORT || 3000;
app.use(cors());
// app.use(express.json());

setTimeout(function(){ request('https://dialogflow-service-widget.herokuapp.com/dfcheck', function (error, response, body) {

  })}, 1800000);

app.get('/dfcheck', (req, res) => {

	res.send("Active Connection");
});


app.post('/botresponse', express.json(), async (req, res) => {
	console.log(req.body);
	let {query,sessionID,projectID}=req.body;
	let config=JSON.parse(fs.readFileSync(`./utils/service_credentials/${credentials[projectID]}.json`,'utf-8'));
	console.log(config);
	
	let response = await connecter.sendTextMessageToDialogFlow(query, sessionID,config);
	console.log('response', JSON.stringify(response, null, 4));

	res.send({ response });
});
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
