var app = require('../app');

// var Snap = require('snapsvg')
app.controller('testCtrl',['$scope','$http',function($scope,$http){
	
	var model = $scope.model = {};
	var events = $scope.events = {};

	var s = Snap("#svg");
	var line = s.path('M50,50 L100,100')
	line.attr({
		fill: "#bada55",
		stroke: "#000",
	})
	line.drag()

}])