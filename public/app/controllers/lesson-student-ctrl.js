var app = require('../app');

var Writer = require('../lib/svg-writer.js');
app.controller('lessonStudentCtrl',['$scope','$http','$socket',function($scope,$http,$socket){
	var canvasDiv = $('div.canvas');


	var options = {
		width : $("#svg").parent().width(),
		height : $("#svg").parent().height(),
	}
	writer = new Writer("#svg",options)
	writer.set('mode','review')
	$(window).on('resize',function(event){
		writer.resize($("#svg").parent().width(),$("#svg").parent().height())

	})
	window.socket = $socket;
	$socket.on('whiteboard',function(data){
		
		try{
			writer.review(data)
		}catch(err){
			console.error(err)
		}
	})



}])