var app = require('../app');

app.service('$socket',function(){
	var socket = io();
	socket.on('connected', function (data) {
		console.log(data)
	});
	return socket;
});