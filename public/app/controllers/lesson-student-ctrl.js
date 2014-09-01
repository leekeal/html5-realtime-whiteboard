var app = require('../app');

var Writer = require('../lib/canvas-writer.js')
app.controller('lessonStudentCtrl',['$scope','$http','$socket',function($scope,$http,$socket){
	var canvasDiv = $('div.canvas');


	// test 用
	$socket.emit('joinClass',{name:'leeke-test'});

	var options = {
		width : $(".canvas").width(),
		height : $(".canvas").height(),
	}

	writer = new Writer('canvas',options)
	// writer.set('mode','review')

	$(window).on('resize',function(event){
		writer.resize($(".canvas").width(),$(".canvas").height())

	})

	
	$socket.on('whiteboard',function(data){
		
		try{
			writer.review(data)
		}catch(err){
			console.error(err)
		}
	})



}])