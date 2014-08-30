var app = require('../app');



app.controller('lessonCtrl',['$scope','$http','$location','$classroom','$socket',function($scope,$http,$location,$classroom,$socket){
	
	var model = $scope.model = {};
	var events = $scope.events = {};

	$http.get(app.api('teacher/lesson-status')).success(function(data){
		if(data.teacher){

			$classroom.name = data.name;
			$classroom.teacher = data.teacher;
			$classroom.lessonName = data.lessonName
			$location.path('lesson/teacher')
		}
	})


	$scope.events.addLesson = function () {

		$classroom.lessonName = model.lessonName;

		$socket.emit('createClass',{
			lessonName : $classroom.lessonName
		})

		$location.path('lesson/teacher');
	}

}])


var Writer = require('../lib/svg-writer.js');
app.controller('lessonTeacherCtrl',['$scope','$http','$location','$classroom','$socket',function($scope,$http,$location,$classroom,$socket){
	var events = $scope.events = {};
	var styles = $scope.styles = {}

	// 判断课程是否存在,不存在就返回创建课堂
	if(!$classroom.lessonName){
		$location.path('lesson')
		return 
	}
	// 课堂存在就向服务器发送信息加入课堂
	$socket.emit('joinClass',$classroom);

	
	



	var options = {
		width : $("#svg").parent().width(),
		height : $("#svg").parent().height(),
	}

	writer = new Writer("#svg",options)
	// auto resize svg paper
	$(window).on('resize',function(event){
		writer.resize($("#svg").parent().width(),$("#svg").parent().height())

	})

	writer.progress(function(report){
		console.log(report)
		$socket.emit('whiteboard',report);
	})


	$scope.pen = {
		size: 1,
		color:'#000000',
	}
	$scope.$watch('pen.size',function(size){

		size = (parseInt(size) + 5) / 6;
		$scope.styles.penSize = {height:size}

		writer.pen('size',size)
	})

	$scope.$watch('pen.color',function(color){
		$scope.styles.penColor = {background:color};
		writer.pen('color',color)
	})

	events.undo = function(){
		console.log('undo')
		writer.undo()
	}
	events.repeat = function(){
		writer.repeat()
	}


}])