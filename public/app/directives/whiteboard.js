// var app = require('../app');
// var Writer = require('../lib/writer.js');
// app.directive('whiteboard',['$rootScope',function($rootScope){
// 	return	{
// 		restrict:'C',
// 		scope:true,
// 		controller:'whiteboardCtrl',
// 		link:function(scope,element,attrs){

// 		},

// 	}


// }])




// app.controller('whiteboardCtrl',['$scope','$compile','$element',function($scope,$compile,$element){
// 	var writer = new Writer('canvas');

// 	// var socket = io('http://192.168.1.15:3000');
// 	// socket.on('hello', function (data) {
// 	// 	console.log(data)
// 	// 	socket.emit('hello','hello server');
// 	// });

// 	writer.progress(function(report){
// 		console.log(report)
// 	})


// }])


var app = require('../app');
var Writer = require('../lib/writer.js');




app.directive('accordion',function(){
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		template : '<div ng-transclude></div>',
		// controller : function() {
		// 	this.opened = function(event){
		// 		console.log(event);
		// 	}
		// }
	}
});


app.directive('toggle',['$scope',function($scope){
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		require : '^?accordion',
		template :'<div>'
		+'<li class="list-group-item" ng-click="toggle()">{{data.title}}</li>'
		+'<div ng-show="showMe">{{data.li}}</div>'
		+'</div>',
		link : function(scope,goAccordionController) {
			scope.showMe = false;
			scope.toggle = function toggle() {
				scope.showMe = !scope.showMe;
				// console.log(goAccordionController);
				goAccordionController.opened(scope);
			}

			goAccordionController.opened = function(scope,event){
				var datas = [];
				// console.log(event);
				console.log($scope.datas);
				// angular.forEach()
			}
		}
	}
}]);














