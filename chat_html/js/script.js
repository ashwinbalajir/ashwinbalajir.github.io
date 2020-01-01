let active = false;
let initstate = true;

$(function() {
	// this will be called when the DOM is ready
	$('#user-input').keyup(function(event) {
		if (event.keyCode === 13) {
			$('.send-button').click();
		}
	});
});
function openChatWindow() {
	var currentstate = document.getElementById('chat-window').style.visibility;
	//Make newstate the opposite of the current state.
	var newstate = currentstate == 'hidden' ? 'visible' : 'hidden';
	var popupicon = newstate == 'hidden' ? 'visible' : 'hidden';
	//Apply the new state.
	document.getElementById('chat-window').style.visibility = newstate;
	console.log('popupicon', popupicon);
	document.getElementById('chat_icon').style.visibility = popupicon;
	if (initstate) {
		$('.chats').append(
			$(`
		<div class="received-message">
		<div class="received-text">
		  <strong>Bot</strong><br />
		  Hello how can i help you today?
		</div>
		<div class="message-info">Bot at ${new Date().toLocaleTimeString()}</div>
	  </div>`)
		);
		initstate = false;
	}

	var input = document.getElementById('user-input');
	input.focus();
}

window.onload = function() {
	//Start with the div visible
	document.getElementById('chat-window').style.visibility = 'hidden';
	document.getElementById('chat_icon').style.visibility = 'visible';

	//Listen for click on button.
	// document.getElementById('chat_icon').addEventListener('click', function() {
	// 	//Get current state of CSS display property.
	// });
};

const userAction = async () => {
	let user_message = $('#user-input').val();
	if (user_message.trim() === '') {
		return;
	}
	$('#user-input').val('');
	//   console.log(myJson);
	$('.chats').append(
		$(`
  <div class="user-message">
	<div class="user-text">
	  <strong>User</strong><br />
	  ${user_message}
	</div>
	<div class="user-message-info">user at  ${new Date().toLocaleTimeString()}</div>
  </div>`)
	);
	$('.msg-inbox').scrollTop($('.msg-inbox')[0].scrollHeight);

	try {
		const response = await fetch('https://dialogflow-service-widget.herokuapp.com/smalltalk', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},

			body: JSON.stringify({ query: user_message, sessionID: '1234', projectID:"smalltalk" })
		});
		let res = await response.json(); //extract JSON from the http response
		var reply = res.response[0].queryResult.fulfillmentText;
	} catch (err) {
		var reply = 'Oops!! something went wrong';
	}

	$('.chats').append(
		$(` <div class="received-message">
  <div class="received-text">
	<strong>Bot</strong><br />
	${reply}
  </div>
  <div class="message-info">Bot at  ${new Date().toLocaleTimeString()}</div>
</div>
`)
	);
	$('.msg-inbox').scrollTop($('.msg-inbox')[0].scrollHeight);
	var input = document.getElementById('user-input');
	input.focus();
};
