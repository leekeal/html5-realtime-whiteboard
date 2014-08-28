var app = require('../app');

var Writer = require('../lib/writer.js');

app.controller('lessonCtrl',['$scope','$http','$location','$classroom','$socket',function($scope,$http,$location,$classroom,$socket){
	
	var model = $scope.model = {};
	var events = $scope.events = {};

	$http.get(app.api('teacher/lesson-status')).success(function(data){
		if(data.teacher){

			$classroom.name = data.name;
			$classroom.teacher = data.teacher;
			$classroom.lessonName = data.lessonName
			$location.path('lesson/class')
		}
	})


	$scope.events.addLesson = function () {

		$classroom.lessonName = model.lessonName;

		$socket.emit('createClass',{
			lessonName : $classroom.lessonName
		})

		$location.path('lesson/class');
	}

}])


app.controller('lessonClassCtrl',['$scope','$http','$location','$classroom','$socket',function($scope,$http,$location,$classroom,$socket){
	
	if(!$classroom.lessonName){
		$location.path('lesson')
		return 
	}
	
	$socket.emit('joinClass',$classroom);

	
	var events = $scope.events = {};
	$scope.lesson = $classroom;

	var canvasDiv = $('div.canvas');
	var options = {
		width:canvasDiv.width(),
		height:canvasDiv.height(),
	}
	writer = new Writer("canvas",options)
	writer.progress(function(report){
		$socket.emit('whiteboard',report);
	})


}])