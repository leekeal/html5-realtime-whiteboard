var app = require('../app');

app.controller('indexCtrl',['$scope','$socket','$location',function($scope,$socket,$location){
	var events = $scope.events = {}
	$scope.classroomList  = {}

	// sent a request
	$socket.emit('classroomList','')
	
	// listen classroom list event
	$socket.on('classroomList',function(data){
		$scope.classroomList = data;
		$scope.$apply()

	})


	events.joinClass = function(classroom){
		console.log(classroom)
		$socket.emit('joinClass',classroom)
		$location.path('/lesson/student')
	}
}])