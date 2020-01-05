const express = require('express');
const cors = require('cors');
const app = express();
const request = require('request');
require('dotenv').config();

const connecter = require('./dialogflow-connecter');
let PORT = process.env.PORT || 3000;
app.use(cors());
// app.use(express.json());
app.get('/dfcheck', (req, res) => {
	console.log('get successful');

	res.send('connection active');
});
setInterval(() => {
	request(process.env.endpoint, (error, response, body) => {
		console.log(body);
	});
}, 29 * 60 * 1000);

app.post('/smalltalk', express.json(), async (req, res) => {
	console.log('request body', JSON.stringify(req.body));

	let response = await connecter.sendTextMessageToDialogFlow(req.body, res);
	console.log('response', JSON.stringify(response, null, 4));

	res.send({ response });
});
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
