var app = require('../app');

var Writer = require('../lib/writer.js');
app.controller('whiteboardReviewCtrl',['$scope','$http','$socket',function($scope,$http,$socket){
	var canvasDiv = $('div.canvas');


	var options = {
		width:canvasDiv.width(),
		height:canvasDiv.height(),
	}
	writer = new Writer("canvas",options)



	window.socket = $socket;
	$socket.on('whiteboard',function(data){
		console.log(data)
		writer.review(data)
	})



}])