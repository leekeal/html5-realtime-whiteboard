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


var Writer = require('../lib/writer.js')
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

	$socket.on('room-users',function(data){
		$scope.users = data;
		console.log(data)
		$scope.$apply()
	})
	
	var options = {
		width : $(".canvas").width(),
		height : $(".canvas").height(),
	}

	writer = new Writer('canvas',options)

	


	$(window).on('resize',function(event){
		writer.resize($(".canvas").width(),$(".canvas").height())

	})

	writer.progress(function(report){
		// console.log(report)
		$socket.emit('whiteboard',report);
	})



	// events listener
	$scope.pen = {
		size: 12,
		color:'#000000',
	}

	$scope.$watch('pen.size',function(size){

		size = (parseInt(size) + 5) / 6;
		$scope.styles.penSize = {height:size, background: $scope.pen.color}

		writer.penSize = size;
	})

	$scope.$watch('pen.color',function(color){
		$scope.styles.penColor = {background:color};

		var size = (parseInt($scope.pen.size) + 5) / 6;
		$scope.styles.penSize = {height: size,background: color};

		writer.penColor = color;
	})

	events.changeMode = function(mode){
		writer.mode = mode;
	}


}])