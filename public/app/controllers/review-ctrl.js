var app = require('../app');

var Writer = require('../lib/writer.js');
app.controller('reviewCtrl',['$scope','$compile','$element',function($scope,$compile,$element){
	var writer = new Writer('review-canvas');

	// var socket = io('http://192.168.1.15:3000');

	// socket.on('whiteboard', function (data) {
	// 	console.log(data)
	// });




}])