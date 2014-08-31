var app = require('../app');

var Writer = require('../lib/writer.js');
app.controller('whiteboardCtrl',['$scope','$http','$socket',function($scope,$http,$socket){

	var canvasDiv = $('div.canvas');
	var options = {
		width:canvasDiv.width(),
		height:canvasDiv.height(),
	}
	writer = new Writer("canvas",options)
	writer.progress(function(report){
		$socket.emit('whiteboard',report);
	})

	$scope.datas = [{
		title : 'student',
		li : '1111'
	},
	{
		title : 'setting up',
		li : '222222'
	},
	{
		title : 'test',
		li : '33333'
	}];
}])